import { handleGetRequest, handlePostRequest } from "./requestHelpers";

export const createLcFunction = (data: object) =>
    handlePostRequest("lc/create", data);

export const updateLcAsFunded = (id:string, data: object) =>
    handlePostRequest(`lc/${id}/update-status`, data);

export const getAllLc= (url: string) => handleGetRequest(url);
export const getSingleLc= (url: string) => handleGetRequest(url);

export const uploadDocument = (id:string, data: object) => handlePostRequest(`lc/${id}/upload-document`, data)

export const updateFundRelease = (id:string, data:object)=> handlePostRequest(`lc/${id}/release-funds/update-status`, data)
