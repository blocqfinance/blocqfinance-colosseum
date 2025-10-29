export interface AccessTokenPayload {
    userId: string;
    email: string;
    isActive: boolean;
}

export interface RefreshTokenPayload {
    userId: string;
}

export interface HttpError extends Error {
    statusCode?: number;
}
