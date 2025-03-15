export interface User {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}