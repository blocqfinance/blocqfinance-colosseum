import { compare, genSalt, hash } from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await genSalt(10);
    return await hash(password, salt);
};

export const comparePassword = async (
    password: string,
    hash: string,
): Promise<boolean> => {
    return await compare(password, hash);
};
