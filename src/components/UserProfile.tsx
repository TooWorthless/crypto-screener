// import { useAuth } from '../auth/useAuth';

// export const UserProfile = () => {
//   const { user, loading, error, getUserInfo } = useAuth();

//   if (loading) return <div>Loading user info...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!user) {
//     return (
//       <div>
//         <p>Not authenticated</p>
//         <button onClick={() => getUserInfo()}>Load User Info</button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h2>User Profile</h2>
//       <p>Name: {user.name || 'N/A'}</p>
//       <p>Email: {user.email}</p>
//       {user.picture && <img src={user.picture} alt="Profile" width={100} />}
//     </div>
//   );
// };


import { useAuth } from '../auth/useAuth';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';

export const UserProfile = () => {
  const { user, loading, error } = useAuth();

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;
  if (!user) return <Typography align="center" sx={{ mt: 4 }}>No user data available</Typography>;

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            User Profile
          </Typography>
          <Typography variant="body1">Username: {user.username}</Typography>
          <Typography variant="body1">Email: {user.email}</Typography>
          <Typography variant="body1">
            Verified: {user.isVerified ? 'Yes' : 'No'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};