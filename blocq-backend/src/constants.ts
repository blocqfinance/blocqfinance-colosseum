export const RedisKeys = {
    RefreshToken: 'auth:refresh',
    OneTimePassword: 'auth:otp',
    VerificationCode: 'auth:verification',
};

export const OTP_EXPIRATION = 5 * 60; // 5 minutes

export const SECONDS_IN_A_DAY = 24 * 60 * 60;

/* Regex:
  ^               - start of the string
  (?=.*[a-z])     - at least one lowercase letter
  (?=.*[A-Z])     - at least one uppercase letter
  (?=.*\d)        - at least one number
  (?=.*[^a-zA-Z\d]) - at least one special character (not a letter or number)
  .{6,}           - at least 6 characters long
  $               - end of the string
*/
export const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/;
