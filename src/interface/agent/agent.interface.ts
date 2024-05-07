export interface Agent {
    // Define the structure of your result object here
    _id: string;
    url: string;
    agentid: string;
    platform: string;
    percentage: number;
    userid: string;
    pwd: string;
    parent: string;
    prefix: string;
    date: Date;
};

export type AgentList = Agent[]