import { compare, hash, genSalt } from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';
const SALT_ROUNDS = 10;

export interface IUser extends Document {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    companyName: string;
    country: string;
    city: string;
    postalCode: string;
    importerOrExporter: 'importer' | 'exporter';
    phone: string;
    password: string;
    isActive: boolean;
    comparePassword(userPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        address: { type: String, required: true },
        companyName: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        importerOrExporter: {
            type: String,
            enum: ['importer', 'exporter'],
            required: true,
        },
        phone: { type: String },
        password: { type: String, required: false },
        isActive: { type: Boolean, default: false },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await genSalt(SALT_ROUNDS);
    this.password = await hash(this.password, salt);
    return next();
});

userSchema.methods.comparePassword = async function (
    userPassword: string,
): Promise<boolean> {
    return await compare(userPassword, this.password);
};

userSchema.set('toJSON', {
    transform: (doc, ret: unknown) => {
        const returnedObj = ret as IUser &
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

export default mongoose.model<IUser>('User', userSchema);
