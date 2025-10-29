import {
    IsMongoId,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { passwordRegex } from '../constants';

export class getProfileDto {
    @IsMongoId()
    userId!: string;
}

export class ChangePasswordDto {
    @IsMongoId()
    userId!: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @Matches(passwordRegex, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character,,,',
    })
    current_password!: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @Matches(passwordRegex, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character,,,',
    })
    new_password!: string;
}
