export interface Overview {
    // Define the structure of your result object here
    newEnteringCustomersCount: number;
    firstDepositNewCustomersCount: number;
    totalDeposit: number;
    totalWithdraw: number;
    totalProfit: number;
};


interface PlayerApplyData {
    name: String
    deposit: Number
    withdrawl: Number
}

export type PlayerApplyDataList = PlayerApplyData[]