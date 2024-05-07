export interface Bet {
    // Define the structure of your result object here
    _id: string;
    userId: string;
    gameType: string;
    gameCode: string;
    gameName: string;
    platform: string;
    currency: string;
    betTime: Date;
    txTime: Date;
    betAmount: number;
    turnover: number;
    winAmount: number;
    action: string;
    refPlatformTxId: string;
    settleType: string;
};

export type BetList = Bet[]