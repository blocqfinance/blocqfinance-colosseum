import apiClient from "../client";
import { customError } from "../client";

export const handlePostRequest = async (
  url: string,
  data: any,
  config?: object
) => {
  try {
    const response = await apiClient.post(url, data, config);
    return response.data;
  } catch (error: any) {
    if (!error) {
      return customError(503, "Unable to complete request");
    } else {
      return customError(error.responseCode, error.message);
    }
  }
};

export const handleGetRequest = async (url: string) => {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: any) {
    if (!error) {
      return customError(503, "Unable to complete request");
    } else {
      return customError(error.responseCode, error.message);
    }
  }
};

export const handlePatchRequest = async (url: string, data: any) => {
  try {
    const response = await apiClient.patch(url, data);
    return response.data;
  } catch (error: any) {
    if (!error) {
      return customError(503, "Unable to complete request");
    } else {
      return customError(error.responseCode, error.message);
    }
  }
};
