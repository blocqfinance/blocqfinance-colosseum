import { ethers } from 'ethers';
import { CONSTANTS } from '../../scripts/constants';
import { CreateLCDto, UpdateLCDto } from '../dtos/letterOfCredit.dto';

import LetterOfCredit, {
    ILetterOfCredit,
} from '../models/letterOfCredit.model';
import { IActivity } from '../interface/activity.interface';
import { LCStatus, LCUpdateTrigger } from '../enums/enums';
import sendEmail from './email.service';
import User, { IUser } from '../models/user.model';
import { generateOneTimePassword, paginate } from '../utils/helpers';
import { comparePassword, hashPassword } from '../utils/passwordHashing';
import { OTP_EXPIRATION, RedisKeys } from '../constants';
import { client } from './redis.service';
import { CustomError } from '../utils/customError';
// import compiledContract from '../../artifacts/LetterOfCredit.json';
import { verifyContractDeploymentChildProcess } from '../child-processes/verifyOnEtherScan.process';

export const letterOfCreditService = {
    // deployContract: async (deadline: number) => {
    //     const { adminAddress, usdcAddress, sepoliaRpcUrl, privateKey } =
    //         CONSTANTS;

    //     const { abi, bytecode } = compiledContract;

    //     const provider = new ethers.JsonRpcProvider(sepoliaRpcUrl);
    //     const wallet = new ethers.Wallet(privateKey, provider);

    //     console.log('Deploying with account:', wallet.address);

    //     const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    //     const contract = await factory.deploy(
    //         adminAddress,
    //         usdcAddress,
    //         +deadline,
    //     );

    //     console.log('Finalizing contract deployment...');
    //     await contract.waitForDeployment();

    //     const contractAddress = {
    //         address: await contract.getAddress(),
    //     };

    //     return contractAddress;
    // },

    createLC: async (input: CreateLCDto): Promise<ILetterOfCredit> => {
        const lcCount = await LetterOfCredit.countDocuments();
        const incrementLcCount = lcCount + 1;

        const lcId = 'lc-' + incrementLcCount.toString().padStart(5, '0');

        const log: IActivity = {
            action: 'create LC',
            message: 'Letter of credit created',
            actor: 'buyer',
        };

        // deploy contract
        const deadline = new Date(input.shippingDeadline).getTime() / 1000;
        // const runDeployment: { address: string } =
        //     await letterOfCreditService.deployContract(deadline);
        console.log('contract deployed');

        // Run child process to verify deployment
        // verifyContractDeploymentChildProcess(deadline, runDeployment.address);

        const payload = {
            ...input,
            lcId,
            // contractAddress: runDeployment.address,
            activityLogs: [log],
        };

        // save details on db
        const lc = new LetterOfCredit(payload);
        await lc.save();
        return lc;
    },

    getAllLC: async (input: {
        page?: string;
        limit?: string;
        status?: LCStatus;
    }) => {
        const limitInt = input.limit ? parseInt(input.limit) : 10;
        const pageInt = input.page ? parseInt(input.page) : 1;
        const skip = (pageInt - 1) * limitInt;

        const qry: Record<string, string> = {};

        if (input.status) {
            qry.status = input.status;
        }

        const count = await LetterOfCredit.countDocuments();

        const lc = await LetterOfCredit.find(qry).skip(skip).limit(limitInt);
        return {
            data: lc,
            count,
        };
    },

    getLC: async (lcId: string): Promise<ILetterOfCredit | null> => {
        const lc = await LetterOfCredit.findOne({ lcId }).populate('buyer');
        return lc;
    },

    sendSellerOTP: async (input: { email: string }) => {
        const otp = generateOneTimePassword();
        const hashedOtp = await hashPassword(otp);

        await client.set(
            `${RedisKeys.OneTimePassword}:${input.email}`,
            hashedOtp,
            { expiration: { type: 'EX', value: OTP_EXPIRATION } },
        );

        await sendEmail(
            input.email,
            'Blocq Finance OTP',
            `<p>Your one time password is <strong>${otp}</strong></p><p>It will expire in 5 minutes.</p>`,
        );

        return { success: true };
    },

    verifySellerOTP: async (input: { email: string; otp: string }) => {
        // check otp
        const cachedOtp = await client.get(
            `${RedisKeys.OneTimePassword}:${input.email}`,
        );
        if (!cachedOtp) {
            throw new CustomError('OTP expired or invalid', 400);
        }

        const isValidOtp = await comparePassword(
            input.otp as string,
            cachedOtp,
        );
        if (!isValidOtp) {
            throw new CustomError('OTP expired or invalid', 400);
        }

        // delete OTP from cache
        await client.del(`${RedisKeys.OneTimePassword}:${input.email}`);

        return { success: true };
    },

    updateLCStatus: async (
        input: UpdateLCDto,
    ): Promise<ILetterOfCredit | null> => {
        const lc = await LetterOfCredit.findOneAndUpdate(
            { lcId: input.lcId },
            {
                status: input.status,
                buyerWalletAddress: input.buyerWalletAddress,
                sellerWalletAddress: input.sellerWalletAddress,
                documentUrl: input.documentUrl,
                requiredDocument: input.requiredDocument,
                termsAcceptedBySeller: input.termsAcceptedBySeller,
                $push: {
                    activityLogs: {
                        action: input.action,
                        message: input.message,
                        actor: input.actor,
                    },
                },
            },
            { new: true },
        ).populate('buyer');

        const buyer = lc?.buyer as IUser;

        if (input.trigger === LCUpdateTrigger.FundLC) {
            const link = `https://${process.env.FRONTEND_URL}/seller/${lc?.lcId}`;
            // send invite to seller
            await sendEmail(
                lc?.sellerEmail as string,
                'Blocq Finance - Seller Invitation',
                `<p>A. Letter of credit has been created by a buyer with details below: <br/>
                    Name: ${buyer?.lastName} ${buyer?.firstName}
                    Email: ${buyer?.email}
                    </p>
                    <p>Click on the link below to accept the terms and register as a seller</p>
                    <a href="${link}">${link}</a>
                `,
            );
        }

        return lc;
    },
};
