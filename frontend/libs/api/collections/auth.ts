import { handlePostRequest } from "./requestHelpers";

export const login = (data: object) =>
    handlePostRequest("auth/login", data);

export const signup = (data: object) =>
    handlePostRequest("auth/signup", data);

export const verify = (data: object) =>
    handlePostRequest("auth/verify-login", data);

export const resendOtp = (data: object) =>
    handlePostRequest("auth/resend-otp", data);

export const resetPassword = (data: object) =>
    handlePostRequest("auth/reset-password/request", data);

export const changePass = (data: object) =>
    handlePostRequest("auth/reset-password", data);