// import { useState } from 'react';
// import { useAuth } from '../auth/useAuth';

// interface VerificationFormProps {
//   userId: string;
// }

// export const VerificationForm = ({ userId }: VerificationFormProps) => {
//   const { verifyEmail, loading, error } = useAuth();
//   const [code, setCode] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await verifyEmail(userId, code);
//     } catch (err) {
//       console.error('Verification failed:', err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Verify Your Email</h2>
//       <input
//         type="text"
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//         placeholder="Enter verification code"
//         disabled={loading}
//       />
//       <button type="submit" disabled={loading}>
//         {loading ? 'Verifying...' : 'Verify'}
//       </button>
//       {error && <p>{error}</p>}
//     </form>
//   );
// };


import { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';

interface VerificationFormProps {
  userId: string;
}

export const VerificationForm = ({ userId }: VerificationFormProps) => {
  const { verifyEmail, loading, error } = useAuth();
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyEmail(userId, code);
    } catch (err) {
      console.error('Verification failed:', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Verify Your Email
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify'}
          </Button>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </form>
      </Paper>
    </Box>
  );
};