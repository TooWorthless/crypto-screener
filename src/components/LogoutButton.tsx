// import { useAuth } from '../auth/useAuth';

// export const LogoutButton = () => {
//   const { logout, loading } = useAuth();
//   return (
//     <button onClick={logout} disabled={loading}>
//       Logout
//     </button>
//   );
// };


import { Button } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '../auth/useAuth';

export const LogoutButton = () => {
  const { logout, loading } = useAuth();

  return (
    <Button
      variant="outlined"
      color="secondary"
      startIcon={<ExitToAppIcon />}
      onClick={logout}
      disabled={loading}
      sx={{ mt: 2, ml: 2 }}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </Button>
  );
};