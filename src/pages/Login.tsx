// import { useState } from "react";
// import { useAuth } from "../auth/useAuth";
// import { VerificationForm } from "../components/VerificationForm";
// import { LoginButton } from "../components/LoginButton";
// import { LogoutButton } from "../components/LogoutButton";

import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { VerificationForm } from "../components/VerificationForm";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    CircularProgress,
} from '@mui/material';
import { LoginButton } from "../components/LoginButton";
import { LogoutButton } from "../components/LogoutButton";

// export const LoginPage = () => {
//     const { loginWithCredentials, registerWithCredentials, loading, error } = useAuth();
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [isRegistering, setIsRegistering] = useState(false);
//     const [userId, setUserId] = useState<string | null>(null);

//     const handleLogin = async (e: React.FormEvent) => {
//       e.preventDefault();
//       try {
//         await loginWithCredentials(username, password);
//       } catch (err) {
//         console.error('Login failed:', err);
//       }
//     };

//     const handleRegister = async (e: React.FormEvent) => {
//       e.preventDefault();
//       try {
//         const id = await registerWithCredentials(username, email, password);
//         setUserId(id);
//       } catch (err) {
//         console.error('Registration failed:', err);
//       }
//     };

//     if (userId) return <VerificationForm userId={userId} />;

//     return (
//       <div>
//         <h1>{isRegistering ? 'Register' : 'Login'}</h1>
//         <form onSubmit={isRegistering ? handleRegister : handleLogin}>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Username"
//             disabled={loading}
//           />
//           {isRegistering && (
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email"
//               disabled={loading}
//             />
//           )}
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             disabled={loading}
//           />
//           <button type="submit" disabled={loading}>
//             {loading ? 'Loading...' : isRegistering ? 'Register' : 'Login'}
//           </button>
//         </form>
//         <button onClick={() => setIsRegistering(!isRegistering)}>
//           {isRegistering ? 'Switch to Login' : 'Switch to Register'}
//         </button>
//         <LoginButton />
//         <LogoutButton />
//         {error && <p>{error}</p>}
//       </div>
//     );
//   };


export const LoginPage = () => {
    const { loginWithCredentials, registerWithCredentials, loading, error } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginWithCredentials(username, password);
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const id = await registerWithCredentials(username, email, password);
            setUserId(id);
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    if (userId) return <VerificationForm userId={userId} />;

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {isRegistering ? 'Register' : 'Login'}
                </Typography>
                <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                    <TextField
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        margin="normal"
                    />
                    {isRegistering && (
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            margin="normal"
                        />
                    )}
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                        {loading ? <CircularProgress size={24} /> : isRegistering ? 'Register' : 'Login'}
                    </Button>
                    <Button
                        variant="text"
                        color="secondary"
                        fullWidth
                        onClick={() => setIsRegistering(!isRegistering)}
                        sx={{ mt: 1 }}
                    >
                        {isRegistering ? 'Switch to Login' : 'Switch to Register'}
                    </Button>
                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                </form>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <LoginButton />
                    <LogoutButton />
                </Box>
            </Paper>
        </Box>
    );
};