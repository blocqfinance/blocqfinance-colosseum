import crypto from 'node:crypto';
// const generatePassword = (): string => {
//   return Math.random().toString(36).slice(-10);
// };

import { passwordRegex } from '../constants';

export const generateRandomPassword = (length = 12) => {
    // Define character sets
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:",./<>?~';

    // Combine all character sets for filling the rest of the password
    const allChars =
        lowercaseChars + uppercaseChars + numberChars + specialChars;

    // Initialize the password with at least one of each required character type
    let password = '';
    password +=
        lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    password +=
        uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    password += numberChars[Math.floor(Math.random() * numberChars.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the remaining length of the password with random characters
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password string to ensure randomness
    password = password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');

    return password;
};

export const generateOneTimePassword = () => {
    const otp = Math.floor(Math.random() * 1000000);

    return String(otp).padStart(6, '0');
};

export const generateVerificationCode = (length = 12) => {
    // Define character sets
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';

    // Combine all character sets for filling the rest of the password
    const allChars = lowercaseChars + uppercaseChars + numberChars;

    // Initialize the password with at least one of each required character type
    let code = '';
    code += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    code += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    code += numberChars[Math.floor(Math.random() * numberChars.length)];

    // Fill the remaining length of the code with random characters
    for (let i = code.length; i < length; i++) {
        code += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password string to ensure randomness
    code = code
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');

    return code;
};

export const isPasswordValid = (password: string): boolean => {
    return passwordRegex.test(password);
};

export const paginate = <T>(
    data: T[],
    count: number,
    page?: string,
    limit?: string,
) => {
    const pageInt = page ? parseInt(page) : 1;
    const limitInt = limit ? parseInt(limit) : 10;
    // const startIndex = (pageInt - 1) * limitInt;
    // const endIndex = pageInt * limitInt;
    const total = count;
    const pagination = {
        total,
        page: pageInt,
        limit: limitInt,
        // startIndex,
        // endIndex,
        totalPage: Math.ceil(total / limitInt),
    };

    return { data, pagination };
};
