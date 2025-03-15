// import { useAuth } from '../auth/useAuth';

// export const LoginButton = () => {
//   const { loginWithGoogle, loginWithCredentials, loading, error } = useAuth();

//   const handleCredentialsLogin = () =>
//     loginWithCredentials('test@example.com', 'password');

//   return (
//     <div>
//       <button onClick={loginWithGoogle} disabled={loading}>
//         Login with Google
//       </button>
//       <button onClick={handleCredentialsLogin} disabled={loading}>
//         Login with Email
//       </button>
//       {loading && <p>Loading...</p>}
//       {error && <p>Error: {error}</p>}
//     </div>
//   );
// };


import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../auth/useAuth';

export const LoginButton = () => {
  const { loginWithGoogle, loading } = useAuth();

  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<GoogleIcon />}
      onClick={loginWithGoogle}
      disabled={loading}
      sx={{ mt: 2 }}
    >
      {loading ? 'Loading...' : 'Login with Google'}
    </Button>
  );
};