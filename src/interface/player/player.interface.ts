export interface Admin {
    // Define the structure of your result object here
    _id: string;
    userid: string;
    agentid: string;
    platform: number;
    role: string;
    date: Date;
    twoFactorEnabled: boolean;
};

export interface Player {
    // Define the structure of your result object here
    _id: string;
    name: string;
    phone: string;
    balance: number;
    platform: string;
    deptime: number;
    origin: string;
    date: Date;
    access: boolean;
    bban: string;
    bbn: string;
    bbun: string;
};

interface TransactionDetailProps {
    clientCode: string;
    date: Date;
    payAmount: number;
    trxNo: string;
    status: string;
  }
  

export interface PlayerStat {
    // Define the structure of your result object here
    _id: string;
    userName: string;
    agent: string;
    totalDepositAmount: number;
    totalDepositTimes: number;
    totalWithdrawalAmount: number;
    totalWithdrawalTimes: number;
    winlose: number;
    origin: string;
    date: Date;
    totalDepositTrxIDs: string[];
    totalWithdrawalTrxIDs: string[];
    totalDepositTransactions: TransactionDetailProps[];
    totalWithdrawalTransactions: TransactionDetailProps[];
};

export interface PlayerWinLoss {
    userid: string;
    username: string;
    platform: string;
    type: string;
    location: string;
    betCount: number;
    validTurnover: number;
    betAmount: number;
    totalBet: number;

    playerWinLoss: number;
    playerAdjustment: number;
    playerTotalPL: number;
    playerMargin: number;

    agentPTWinLoss: number;
    agentAdjustment: number;
    agentTotalPL: number;

    masterAgentPTWinLoss: number;
    masterAgentAdjustment: number;
    masterAgentTotalPL: number;

    companyTotalPL: number;
}

interface URL {
    description : String
    url : String
    _id :  String
}

export interface Permission {
    _id: string; // Assuming the backend expects a URL ID.
    access: boolean;
    url: URL; // Assuming each permission has a human-readable label.
}

export interface Role {
    _id: string;
    permissions: Permission[];
}

export type PermissionList = Permission[]

export type PlayerList = Player[]

export type AdminList = Admin[]

export type PlayerStatList = PlayerStat[]

export type PlayerWinLossList = PlayerWinLoss[]