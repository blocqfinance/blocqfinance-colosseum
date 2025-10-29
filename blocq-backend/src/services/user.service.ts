import { ChangePasswordDto, getProfileDto } from '../dtos/user.dto';
import User from '../models/user.model';
import { CustomError } from '../utils/customError';
import { isPasswordValid } from '../utils/helpers';
import { comparePassword } from '../utils/passwordHashing';

export const userService = {
    profile: async (input: getProfileDto) => {
        const user = await User.findById(input.userId);

        return user;
    },

    changePassword: async (input: ChangePasswordDto) => {
        if (!isPasswordValid(input.new_password)) {
            throw new CustomError(
                'Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                400,
            );
        }

        const user = await User.findById(input.userId).select('+password');

        if (!user) {
            throw new CustomError('User not found', 400);
        }

        const isCurrentPasswordValid = await comparePassword(
            input.current_password,
            user.password,
        );

        if (!isCurrentPasswordValid) {
            throw new CustomError('Invalid current password', 400);
        }

        const isNewPasswordSameAsCurrent = await comparePassword(
            input.new_password,
            user.password,
        );

        if (isNewPasswordSameAsCurrent) {
            throw new CustomError(
                'New Password must be different from current password',
                400,
            );
        }

        user.password = input.new_password;
        if (user.isActive === false) {
            user.isActive = true;
        }

        const response = await user.save();

        return response;
    },
};
