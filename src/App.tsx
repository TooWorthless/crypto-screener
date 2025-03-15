import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { LoginButton } from './components/LoginButton';
import { LogoutButton } from './components/LogoutButton';
import { UserProfile } from './components/UserProfile';
import { Callback } from './pages/Callback';
import { LoginPage } from './pages/Login';

// <>
//   <LoginButton />
//   <LogoutButton />
// </>

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          <h1>My App</h1>
          <Routes>
            <Route
              path="/"
              element={
                <LoginPage />
              }
            />
            <Route path="/callback" element={<Callback />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;