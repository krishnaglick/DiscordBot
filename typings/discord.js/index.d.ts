import Discord from "discord.js";

interface Command {
    execute: (
        message: Discord.Message,
        args: string[],
        client: Discord.Client,
        data: any,
        requests?: any[],
    ) => Promise<void>;
    name: string;
    display: string;
    description: string;
}

declare module "discord.js" {
    export interface Channel {
        messages: Map<string, Discord.TextChannel>;
        fetchMessage: (messageId: string) => Promise<Discord.Message>;
    }
    export interface Client {
        commands: Discord.Collection<string, Command>;
    }
    export interface Channel {
        guild: Discord.Guild;
        send: (message: string) => void;
    }
}
