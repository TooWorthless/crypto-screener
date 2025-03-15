// import { useContext, useState, useEffect, useCallback, useRef } from 'react';
// import { AuthContext } from './AuthProvider';
// import { AuthUser, Tokens } from './types';
// import { Auth } from './Auth';
// import { throttle } from '../utils/throttle';

// interface UseAuthReturn {
//   isAuthenticated: boolean;
//   user: AuthUser | null;
//   loading: boolean;
//   error: string | null;
//   loginWithGoogle: () => void;
//   loginWithCredentials: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   getUserInfo: () => Promise<AuthUser | null>;
//   auth: Auth;
// }

// export const useAuth = (): UseAuthReturn => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');

//   const { auth } = context;
//   const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const userCache = useRef<AuthUser | null>(null); // Кэш для данных пользователя

//   useEffect(() => {
//     const initializeAuth = async () => {
//       if (auth.isAuthenticated() && !userCache.current) {
//         setLoading(true);
//         try {
//           const userData = await auth.getUserInfo();
//           userCache.current = userData; // Сохраняем в кэш
//           setUser(userData);
//           setIsAuthenticated(true);
//         } catch (err) {
//           setError('Failed to load user info');
//           setIsAuthenticated(false);
//         } finally {
//           setLoading(false);
//         }
//       } else if (userCache.current) {
//         setUser(userCache.current); // Используем кэш
//         setIsAuthenticated(true);
//       }
//     };
//     initializeAuth();
//   }, [auth]);

//   const loginWithGoogle = useCallback(() => {
//     setLoading(true);
//     setError(null);
//     auth.loginWithGoogle();
//   }, [auth]);

//   const loginWithCredentials = useCallback(
//     async (email: string, password: string) => {
//       setLoading(true);
//       setError(null);
//       try {
//         const userData = await auth.loginWithCredentials(email, password);
//         userCache.current = userData;
//         setUser(userData);
//         setIsAuthenticated(true);
//       } catch (err: any) {
//         setError(err.message || 'Login failed');
//         setIsAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [auth]
//   );

//   const logout = useCallback(() => {
//     setLoading(true);
//     setError(null);
//     auth.logout();
//     userCache.current = null; // Очищаем кэш
//     setUser(null);
//     setIsAuthenticated(false);
//     setLoading(false);
//   }, [auth]);

//   const throttledGetUserInfo = useCallback(
//     throttle(async () => {
//       const userData = await auth.getUserInfo();
//       userCache.current = userData;
//       setUser(userData);
//       setIsAuthenticated(true);
//       return userData;
//     }, 1000), // Ограничение: 1 запрос в секунду
//     [auth]
//   );

//   const getUserInfo = useCallback(async () => {
//     if (userCache.current) return userCache.current;
//     setLoading(true);
//     setError(null);
//     try {
//       const userData = await throttledGetUserInfo();
//       return userData;
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch user info');
//       setIsAuthenticated(false);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, [throttledGetUserInfo]);


//   return {
//     isAuthenticated,
//     user,
//     loading,
//     error,
//     loginWithGoogle,
//     loginWithCredentials,
//     logout,
//     getUserInfo,
//     auth,
//   };
// };
import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AuthContext } from './AuthProvider';
import { User, Tokens } from './types';

interface UseAuthReturn {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
    loginWithGoogle: () => void;
    loginWithCredentials: (username: string, password: string) => Promise<void>;
    registerWithCredentials: (username: string, email: string, password: string) => Promise<string>;
    verifyEmail: (userId: string, code: string) => Promise<void>;
    logout: () => void;
    getUserInfo: () => Promise<User | null>;
    handleAuthentication: () => Promise<Tokens>;
}

export const useAuth = (): UseAuthReturn => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');

    const { auth } = context;
    const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const userCache = useRef<User | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    //   const initializeWebSocket = useCallback((accessToken: string) => {
    //     if (socketRef.current) socketRef.current.close();
    //     socketRef.current = new window.WebSocket(`ws://localhost:8081?token=${accessToken}`);

    //     socketRef.current.onopen = () => {
    //       console.log('WebSocket connected');
    //     };

    //     socketRef.current.onmessage = (event) => {
    //       const data = JSON.parse(event.data);
    //       console.log('WebSocket message:', data);
    //       if (data.type === 'connected') {
    //         console.log('Connected with userId:', data.userId);
    //       } else if (data.type === 'authExpired') {
    //         handleTokenRefresh();
    //       }
    //     };

    //     socketRef.current.onerror = (err) => {
    //       console.error('WebSocket error:', err);
    //       setTimeout(() => {
    //         if (socketRef.current?.readyState === WebSocket.CLOSED && auth.isAuthenticated()) {
    //           initializeWebSocket(accessToken);
    //         }
    //       }, 1000);
    //     };

    //     socketRef.current.onclose = (event) => {
    //       console.log('WebSocket disconnected', event);
    //       if (event.code === 1006) {
    //         console.log('Connection closed abnormally, attempting to refresh token');
    //         handleTokenRefresh();
    //       }
    //     };
    //   }, [auth]);
    const handleTokenRefresh = useCallback(async () => {
        try {
            const tokens = await auth.refreshToken();
            setIsAuthenticated(true);
            initializeWebSocket(tokens.accessToken);
        } catch (err) {
            setError('Session expired');
            logout();
        }
    }, [auth]);

    const initializeWebSocket = useCallback((accessToken: string) => {
        if (!accessToken) {
            console.error('No access token for WebSocket');
            return;
        }
        if (socketRef.current) socketRef.current.close();
        socketRef.current = new window.WebSocket(`ws://localhost:8081?token=${accessToken}`);

        socketRef.current.onopen = () => {
            console.log('WebSocket connected');
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket message:', data);
            if (data.type === 'connected') {
                console.log('Connected with userId:', data.userId);
            } else if (data.type === 'authExpired') {
                handleTokenRefresh();
            }
        };

        socketRef.current.onerror = (err) => {
            console.error('WebSocket error:', err);
            setTimeout(() => {
                if (socketRef.current?.readyState === WebSocket.CLOSED && auth.isAuthenticated()) {
                    const newToken = auth.storage.getItem('accessToken');
                    if (newToken) initializeWebSocket(newToken);
                }
            }, 1000);
        };

        socketRef.current.onclose = (event) => {
            console.log('WebSocket disconnected', event);
            if (event.code === 1006) {
                console.log('Connection closed abnormally, attempting to refresh token');
                handleTokenRefresh();
            }
        };
    }, [auth, handleTokenRefresh]);



    useEffect(() => {
        const initializeAuth = async () => {
            if (auth.isAuthenticated() && !userCache.current) {
                setLoading(true);
                try {
                    const userData = await auth.getUserInfo();
                    if (userData) {
                        userCache.current = userData;
                        setUser(userData);
                        setIsAuthenticated(true);
                        initializeWebSocket(auth.storage.getItem('accessToken')!);
                    } else {
                        throw new Error('User data not found');
                    }
                } catch (err: any) {
                    setError(err.message || 'Failed to load user info');
                    setIsAuthenticated(false);
                    auth.logout();
                } finally {
                    setLoading(false);
                }
            } else if (userCache.current) {
                setUser(userCache.current);
                setIsAuthenticated(true);
            }
        };
        initializeAuth();

        return () => {
            if (socketRef.current) socketRef.current.close();
        };
    }, [auth, initializeWebSocket]);

    const loginWithGoogle = useCallback(() => {
        setLoading(true);
        setError(null);
        auth.loginWithGoogle();
    }, [auth]);

    const loginWithCredentials = useCallback(
        async (username: string, password: string) => {
            setLoading(true);
            setError(null);
            try {
                await auth.loginWithCredentials(username, password);
                const userData = auth.getUserInfo();
                if (userData) {
                    userCache.current = userData;
                    setUser(userData);
                    setIsAuthenticated(true);
                    initializeWebSocket(auth.storage.getItem('accessToken')!);
                } else {
                    throw new Error('User data not found after login');
                }
            } catch (err: any) {
                setError(err.message || 'Login failed');
                setIsAuthenticated(false);
                auth.logout();
            } finally {
                setLoading(false);
            }
        },
        [auth, initializeWebSocket]
    );

    const registerWithCredentials = useCallback(
        async (username: string, email: string, password: string) => {
            setLoading(true);
            setError(null);
            try {
                const { userId } = await auth.registerWithCredentials(username, email, password);
                return userId;
            } catch (err: any) {
                setError(err.message || 'Registration failed');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [auth]
    );

    const verifyEmail = useCallback(
        async (userId: string, code: string) => {
            setLoading(true);
            setError(null);
            try {
                await auth.verifyEmail(userId, code);
                const userData = auth.getUserInfo();
                if (userData) {
                    userCache.current = userData;
                    setUser(userData);
                    setIsAuthenticated(true);
                    initializeWebSocket(auth.storage.getItem('accessToken')!);
                } else {
                    throw new Error('User data not found after verification');
                }
            } catch (err: any) {
                setError(err.message || 'Verification failed');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [auth, initializeWebSocket]
    );

    const logout = useCallback(() => {
        setLoading(true);
        setError(null);
        auth.logout();
        userCache.current = null;
        setUser(null);
        setIsAuthenticated(false);
        if (socketRef.current) socketRef.current.close();
        setLoading(false);
    }, [auth]);

    const getUserInfo = useCallback(async () => {
        const userData = auth.getUserInfo();
        if (userData) {
            userCache.current = userData;
            setUser(userData);
            setIsAuthenticated(true);
            return userData;
        }
        return null;
    }, [auth]);

    //   const handleAuthentication = useCallback(async () => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //       const tokens = await auth.handleAuthentication();
    //       const auth0User = await new Promise<User>((resolve, reject) => {
    //         this.auth0.client.userInfo(tokens.accessToken, (err, user) => {
    //           if (err) return reject(err);
    //           resolve(user as User);
    //         });
    //       });
    //       await auth.syncWithBackend(auth0User, 'google');
    //       const userData = auth.getUserInfo();
    //       if (userData) {
    //         userCache.current = userData;
    //         setUser(userData);
    //         setIsAuthenticated(true);
    //         initializeWebSocket(tokens.accessToken);
    //         return tokens;
    //       } else {
    //         throw new Error('User data not found after sync');
    //       }
    //     } catch (err: any) {
    //       setError(err.message || 'Authentication failed');
    //       setIsAuthenticated(false);
    //       auth.logout();
    //       throw err;
    //     } finally {
    //       setLoading(false);
    //     }
    //   }, [auth, initializeWebSocket]);

    const handleAuthentication = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const tokens = await auth.handleAuthentication();
            const auth0User = await new Promise<User>((resolve, reject) => {
                this.auth0.client.userInfo(tokens.accessToken, (err, user) => {
                    if (err) return reject(err);
                    resolve(user as User);
                });
            });
            await auth.syncWithBackend(auth0User, 'google');
            const userData = auth.getUserInfo();
            if (userData) {
                userCache.current = userData;
                setUser(userData);
                setIsAuthenticated(true);
                initializeWebSocket(tokens.accessToken);
                return tokens;
            } else {
                throw new Error('User data not found after sync');
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
            setIsAuthenticated(false);
            auth.logout();
            throw err;
        } finally {
            setLoading(false);
        }
    }, [auth, initializeWebSocket]);

    return {
        isAuthenticated,
        user,
        loading,
        error,
        loginWithGoogle,
        loginWithCredentials,
        registerWithCredentials,
        verifyEmail,
        logout,
        getUserInfo,
        handleAuthentication,
    };
};