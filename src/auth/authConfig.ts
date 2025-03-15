export const authConfig = {
    auth0: {
      domain: 'dev-5sl20g0k1nyakuxs.us.auth0.com', 
      clientID: 'wwqoVQZdixA0g7ld2usImz4FS0dTyWLT',  
      redirectUri: window.location.origin + '/callback',
      responseType: 'token id_token',
      scope: 'openid profile email',
    },
    apiUrl: 'http://localhost:3000/api', 
  };