import { Document, Schema, model, Types } from 'mongoose';
import { LCStatus, DocumentRequired } from '../enums/enums';
import { IUser } from './user.model';

export interface Activity extends Document {
    action: string;
    message: string;
    actor: 'buyer' | 'seller' | 'system';
}

export interface ILetterOfCredit extends Document {
    lcId: string;
    buyer: Types.ObjectId | IUser;
    sellerEmail: string;
    sellerCompany: string;
    amount: number;
    currency: string;
    goodsDescription: string;
    shippingDeadline: Date;
    buyerWalletAddress?: string;
    contractAddress: string;
    sellerWalletAddress?: string;
    sellerAcceptsTerms?: boolean;
    requiredDocument: DocumentRequired;
    documentUrl?: string;
    activityLogs: Activity[];
    status: LCStatus;
}

const activitySchema = new Schema<Activity>(
    {
        action: { type: String, required: true },
        message: { type: String, required: true },
        actor: {
            type: String,
            enum: ['buyer', 'seller', 'system'],
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
        _id: false,
    },
);

const letterOfCreditSchema = new Schema<ILetterOfCredit>(
    {
        lcId: { type: String, required: true, unique: true },
        buyer: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        sellerEmail: { type: String, required: true },
        sellerCompany: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true, default: 'usdc' },
        goodsDescription: { type: String, required: true },
        shippingDeadline: { type: Date, required: true },
        contractAddress: { type: String, required: true },
        buyerWalletAddress: { type: String, required: false },
        sellerWalletAddress: { type: String, required: false },
        sellerAcceptsTerms: { type: Boolean, required: false },
        requiredDocument: {
            type: String,
            required: true,
            enum: Object.values(DocumentRequired),
        },
        documentUrl: {
            type: String,
            required: false,
        },
        activityLogs: [activitySchema],
        status: {
            type: String,
            enum: Object.values(LCStatus),
            default: LCStatus.PendingFunding,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);

letterOfCreditSchema.set('toJSON', {
    transform: (doc, ret: unknown) => {
        const returnedObj = ret as ILetterOfCredit &
            Required<{
                _id: unknown;
            }> & {
                __v?: number;
            };
        returnedObj.id = returnedObj._id;
        delete returnedObj.__v;
        delete returnedObj._id;
        return returnedObj;
    },
});

export default model<ILetterOfCredit>('LetterOfCredit', letterOfCreditSchema);
