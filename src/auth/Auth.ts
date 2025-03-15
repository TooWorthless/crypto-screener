// import Auth0 from 'auth0-js';
// import { Storage } from '../storage/Storage';
// import { authApi } from '../api/authApi';
// import { authConfig } from './authConfig';
// import { AuthUser, Tokens } from './types';

// export class Auth {
//     private auth0: Auth0.WebAuth;
//     private storage: Storage;

//     constructor(storage: Storage) {
//         this.auth0 = new Auth0.WebAuth(authConfig.auth0);
//         this.storage = storage;
//     }

//     // Авторизация через Google (OAuth)
//     //   loginWithGoogle(): void {
//     //     this.auth0.authorize({ connection: 'google-oauth2' });
//     //   }
//     loginWithGoogle(): void {
//         this.auth0.authorize({
//             connection: 'google-oauth2',
//             redirectUri: window.location.origin + '/callback', // Явно указываем
//         });
//     }

//     // Авторизация через логин/пароль (будущий бэкенд)
//     async loginWithCredentials(email: string, password: string): Promise<AuthUser> {
//         const response = await authApi.loginWithCredentials(email, password);
//         this.storage.setItem('accessToken', response.accessToken);
//         return response.user;
//     }

//     // Обработка callback после OAuth
//     // handleAuthentication(): Promise<Tokens> {
//     //     return new Promise((resolve, reject) => {
//     //         this.auth0.parseHash((err, authResult) => {
//     //             if (err) return reject(err);
//     //             if (authResult && authResult.accessToken) {
//     //                 this.storage.setItem('accessToken', authResult.accessToken);
//     //                 if (authResult.idToken) this.storage.setItem('idToken', authResult.idToken);
//     //                 resolve({
//     //                     accessToken: authResult.accessToken,
//     //                     idToken: authResult.idToken,
//     //                     expiresIn: authResult.expiresIn,
//     //                 });
//     //             } else {
//     //                 reject(new Error('No tokens received'));
//     //             }
//     //         });
//     //     });
//     // }
//     handleAuthentication(): Promise<Tokens> {
//         console.log('handleAuthentication called at:', new Date().toISOString());
//         return new Promise((resolve, reject) => {
//             this.auth0.parseHash((err, authResult) => {
//                 console.log('parseHash result:', { err, authResult });
//                 if (err) {
//                     console.error('parseHash error:', err);
//                     return reject(err);
//                 }
//                 if (authResult && authResult.accessToken) {
//                     console.log('Tokens received:', {
//                         accessToken: authResult.accessToken,
//                         idToken: authResult.idToken,
//                         expiresIn: authResult.expiresIn,
//                     });
//                     this.storage.setItem('accessToken', authResult.accessToken);
//                     if (authResult.idToken) this.storage.setItem('idToken', authResult.idToken);
//                     resolve({
//                         accessToken: authResult.accessToken,
//                         idToken: authResult.idToken,
//                         expiresIn: authResult.expiresIn,
//                     });
//                 } else {
//                     reject(new Error('No tokens received'));
//                 }
//             });
//         });
//     }

//     // Выход
//     logout(): void {
//         this.storage.removeItem('accessToken');
//         this.storage.removeItem('idToken');
//         this.auth0.logout({ returnTo: window.location.origin });
//     }

//     // Проверка авторизации
//     isAuthenticated(): boolean {
//         return !!this.storage.getItem('accessToken');
//     }

//     // Получение данных пользователя
//     getUserInfo(): Promise<AuthUser> {
//         return new Promise((resolve, reject) => {
//             const accessToken = this.storage.getItem('accessToken');
//             if (!accessToken) return reject(new Error('Not authenticated'));
//             this.auth0.client.userInfo(accessToken, (err, user) => {
//                 if (err) return reject(err);
//                 resolve(user as AuthUser);
//             });
//         });
//     }
// }
import Auth0 from 'auth0-js';
import { Storage } from '../storage/Storage';
import { authApi } from '../api/authApi';
import { authConfig } from './authConfig';
import { User, Tokens } from './types';

export class Auth {
  private auth0: Auth0.WebAuth;
  private storage: Storage;
  private user: User | null = null;

  constructor(storage: Storage) {
    this.auth0 = new Auth0.WebAuth(authConfig.auth0);
    this.storage = storage;
  }

  loginWithGoogle(): void {
    this.auth0.authorize({
      connection: 'google-oauth2',
      redirectUri: window.location.origin + '/callback',
    });
  }

  async handleAuthentication(): Promise<Tokens> {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.storage.setItem('accessToken', authResult.accessToken);
          this.storage.setItem('refreshToken', authResult.idToken);
          resolve({
            accessToken: authResult.accessToken,
            idToken: authResult.idToken,
            expiresIn: authResult.expiresIn || 7200,
          });
        } else {
          reject(new Error('No tokens received'));
        }
      });
    });
  }

  async syncWithBackend(user: User, authType: 'google' | 'credentials'): Promise<void> {
    try {
      const response = await authApi.checkUser(user.email);
      const backendUser = response.data.user;

      if (backendUser) {
        if (backendUser.authType !== authType) {
          throw new Error(`User already exists with a different auth type: ${backendUser.authType}`);
        }
        this.user = {
          _id: backendUser._id,
          username: backendUser.username,
          email: backendUser.email,
          isVerified: backendUser.isVerified,
        };
      } else {
        const registerResponse = await authApi.registerWithBackend({
          username: user.username || user.email.split('@')[0],
          email: user.email,
          authType,
        });
        this.user = registerResponse.data.user;
      }
    } catch (err: any) {
      throw new Error(err.message || 'Failed to sync with backend');
    }
  }

  async loginWithCredentials(username: string, password: string): Promise<void> {
    try {
      const response = await authApi.loginWithCredentials(username, password);
      const { accessToken, refreshToken, user } = response.data;
      this.storage.setItem('accessToken', accessToken);
      this.storage.setItem('refreshToken', refreshToken);
      this.user = user;
    } catch (err: any) {
      throw new Error(err.message || 'Login failed');
    }
  }

  async registerWithCredentials(username: string, email: string, password: string): Promise<{ userId: string }> {
    try {
      const response = await authApi.registerWithCredentials(username, email, password);
      return { userId: response.data.userId };
    } catch (err: any) {
      throw new Error(err.message || 'Registration failed');
    }
  }

  async verifyEmail(userId: string, code: string): Promise<void> {
    try {
      const response = await authApi.verifyEmail(userId, code);
      const { accessToken, refreshToken, user } = response.data;
      this.storage.setItem('accessToken', accessToken);
      this.storage.setItem('refreshToken', refreshToken);
      this.user = user;
    } catch (err: any) {
      throw new Error(err.message || 'Verification failed');
    }
  }

  logout(): void {
    this.storage.removeItem('accessToken');
    this.storage.removeItem('refreshToken');
    this.user = null;
    this.auth0.logout({ returnTo: window.location.origin });
  }

  isAuthenticated(): boolean {
    return !!this.storage.getItem('accessToken');
  }

  getUserInfo(): User | null {
    return this.user;
  }

  async refreshToken(): Promise<Tokens> {
    const refreshToken = this.storage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');
    try {
      const response = await authApi.refreshToken(refreshToken);
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      this.storage.setItem('accessToken', accessToken);
      this.storage.setItem('refreshToken', newRefreshToken);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to refresh token');
    }
  }
}