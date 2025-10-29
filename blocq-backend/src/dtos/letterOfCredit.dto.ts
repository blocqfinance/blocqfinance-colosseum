import 'reflect-metadata';
import {
    IsString,
    IsEmail,
    IsEnum,
    MinLength,
    MaxLength,
    IsNumberString,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsDate,
    IsBoolean,
    IsNumber,
} from 'class-validator';
import { IsEthereumAddress } from '../decorators/is-ethereum-address.decorator';
import { Type } from 'class-transformer';
import { DocumentRequired, LCStatus, LCUpdateTrigger } from '../enums/enums';
import { Activity } from '../models/letterOfCredit.model';
import { IsFutureDate } from '../decorators/is-future-date.decorator';

export class CreateLCDto {
    @IsMongoId()
    buyer!: string;

    @IsEmail()
    sellerEmail!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    sellerCompany!: string;

    @IsNumber()
    amount!: number;

    @IsOptional()
    @MinLength(2)
    @MaxLength(10)
    @IsString()
    currency?: string;

    @IsString()
    @MinLength(5)
    @MaxLength(500)
    goodsDescription!: string;

    @IsDate()
    @Type(() => Date)
    @IsFutureDate({ message: 'Shipping deadline must be in the future' })
    shippingDeadline!: Date;

    @IsEnum(DocumentRequired)
    requiredDocument!: DocumentRequired;
}

export class UpdateLCDto {
    @IsNotEmpty()
    @IsString()
    lcId!: string;

    @IsEnum(LCUpdateTrigger)
    trigger!: LCUpdateTrigger;

    @IsOptional()
    @IsNotEmpty()
    // @IsEthereumAddress({ message: 'Invalid buyer wallet address' })
    buyerWalletAddress?: string;

    @IsOptional()
    @IsNotEmpty()
    // @IsEthereumAddress({ message: 'Invalid seller wallet address' })
    sellerWalletAddress?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(LCStatus)
    status?: LCStatus;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    documentUrl?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(DocumentRequired)
    requiredDocument?: DocumentRequired;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    action?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    message?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    actor?: 'buyer' | 'seller' | 'system';

    @IsOptional()
    @IsBoolean()
    @IsOptional()
    termsAcceptedBySeller?: boolean;
}

export class sendSellerOtpDto {
    @IsEmail()
    email!: string;
}

export class VerifySellerOtpDto {
    @IsEmail()
    email!: string;

    @IsNumberString()
    @MinLength(6)
    @MaxLength(6)
    otp!: string;
}

export class uploadDocumentDto {
    @IsEmail()
    email!: string;

    @IsNumberString()
    @MinLength(6)
    @MaxLength(6)
    otp!: string;
}
