export enum LCStatus {
    PendingFunding = 'pendingFunding',
    AwaitingSeller = 'awaitingSeller',
    Active = 'active',
    DocumentSubmitted = 'documentSubmitted',
    Completed = 'completed',
    Cancelled = 'cancelled',
}

export enum DocumentRequired {
    AirWaybill = 'airWaybill',
    BillOfLading = 'billOfLading',
    RoadConsignment = 'roadConsignment',
}

export enum LCUpdateTrigger {
    FundLC = 'fundLC',
    SellerRegistered = 'sellerRegistered',
    DocumentUpload = 'documentUpload',
}
