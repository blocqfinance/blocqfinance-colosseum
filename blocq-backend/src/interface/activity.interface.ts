export interface IActivity {
    action: string;
    message: string;
    actor: 'buyer' | 'seller' | 'system';
}
