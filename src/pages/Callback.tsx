// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../auth/useAuth';

// export const Callback = () => {
//     const { auth } = useAuth();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (window.location.hash === '') {
//             console.log('Already processed or no hash, skipping');
//             navigate('/'); // Если нет хэша, сразу уходим
//             return;
//         }

//         const authenticate = async () => {

//             try {
//                 await auth.handleAuthentication();
//                 navigate('/profile');
//             } catch (err) {
//                 console.error('Authentication error:', err);
//                 navigate('/');
//             }
//         };
//         authenticate();
//     }, []);

//     //   if (loading) return <div>Loading...</div>;
//     //   if (error) return <div>Error: {error}</div>;
//     return null; // Ничего не рендерим после редиректа
// };







import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export const Callback = () => {
    // const { auth } = useAuth();
    const { handleAuthentication, loading, error } = useAuth();
    const navigate = useNavigate();
    const isProcessedRef = useRef(false);

    useEffect(() => {
        console.log('Callback useEffect triggered at:', new Date().toISOString());
        console.log('Current hash:', window.location.hash);

        if (isProcessedRef.current || !window.location.hash) {
            console.log('Already processed or no hash, skipping');
            return;
        }

        const authenticate = async () => {
            console.log('Starting authentication process');
            isProcessedRef.current = true; 
            try {
                // await auth.handleAuthentication();
                await handleAuthentication();
                console.log('Authentication successful, navigating to /profile');
                navigate('/profile', { replace: true });
                window.history.replaceState({}, document.title, window.location.pathname); // Очищаем хэш
            } catch (err) {
                console.error('Authentication error in Callback:', err);
                navigate('/', { replace: true });
            }
        };
        authenticate();
    }, [handleAuthentication, navigate]);

    
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
    return null;
};