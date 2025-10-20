import { handleGetRequest, handlePostRequest } from "./requestHelpers"


export const fetchLC = (url:string) => handleGetRequest(url)
export const sendOtp = (data:Object) => handlePostRequest('lc/send-seller-otp',data)
export const verifyOtpCall = (data:Object) => handlePostRequest('lc/verify-seller-otp',data)
export const updateSellerLc = (id:string, data:Object) => handlePostRequest(`lc/${id}/update-status`, data)