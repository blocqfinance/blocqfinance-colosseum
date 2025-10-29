import {
    IsString,
    IsEmail,
    IsEnum,
    MinLength,
    MaxLength,
    IsNumberString,
    Matches,
    IsPhoneNumber,
    IsMongoId,
    IsJWT,
    IsBoolean,
} from 'class-validator';
import { passwordRegex } from '../constants';

export class SignUpDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    firstName!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastName!: string;

    @IsString()
    @MinLength(5)
    @MaxLength(100)
    address!: string;

    @IsString()
    companyName!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    country!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    city!: string;

    @IsString()
    @MinLength(4)
    @MaxLength(10)
    postalCode!: string;

    @IsEnum(['importer', 'exporter'])
    importerOrExporter!: 'importer' | 'exporter';

    @IsPhoneNumber()
    phone!: string; // including country code with "+"
}

export class LoginDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password!: string;
}

export class RequestPasswordResetLinkDto {
    @IsEmail()
    email!: string;
}

export class ResetPasswordDto {
    @IsString()
    code!: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @Matches(passwordRegex, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    new_password!: string;
}

export class VerifyOtpDto {
    @IsEmail()
    email!: string;

    @IsNumberString()
    @MinLength(6)
    @MaxLength(6)
    otp!: string;
}

export class ResendOtpDto {
    @IsEmail()
    email!: string;
}

export class RefreshTokenDto {
    @IsJWT()
    refreshToken?: string;

    @IsMongoId()
    userId!: string;

    @IsEmail()
    email!: string;

    @IsBoolean()
    isActive!: boolean;
}

export class LogoutDto {
    @IsMongoId()
    userId!: string;
}
