import fs from "fs";
import Discord from "discord.js";
import { prefix, prodToken, stagingToken } from "./getAuth";

const client = new Discord.Client();

const environment = process.env.NODE_ENV || "stage";

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const scraperFiles = fs
    .readdirSync("./Scripts")
    .filter(file => file.endsWith(".js"))
    .map(file => {
        return require(`./Scripts/${file}`);
    });
let timedMessage: NodeJS.Timeout;
for (const file of commandFiles) {
    // TODO: Not use require here
    // tslint:disable-next-line
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const dataStore = {
    dragalia: {
        weapons: [],
        dragons: [],
        units: [],
        prints: [],
    },
};

// TODO: Type me
const requests: any[] = [];

client.once("ready", async () => {
    console.log(`Bot is running on ${client.guilds.size} servers`);
    client.user.setActivity(">help");
    await runUpdates(scraperFiles);
});

client.on("messageReactionAdd", (reaction, user) => {
    if (reaction.emoji.name === "🤝" && reaction.message.id === "606589614123384843") {
        try {
            const role = reaction.message.guild.roles.get("606594867136823316");
            const member = reaction.message.guild.members.find(({ user: { id } }) => id === user.id);
            console.log(`CO-OP || ${user.username} has requested the Co-op Role.`);
            if (member && role) {
                if (!member.roles.has(role.id)) {
                    member.addRole(role).catch(console.error);
                }
            }
        } catch (e) {
            console.error("Error adding role");
            console.debug("reaction: ", reaction);
            console.debug("user: ", user);
            // ToDo: Figure somethin out.
        }
    }
    if (reaction.message.id === "622649753121062912") {
        console.log("cool");
    }
});
client.on("messageReactionRemove", (reaction, user) => {
    if (reaction.emoji.name === "🤝" && reaction.message.id === "606589614123384843") {
        try {
            const role = reaction.message.guild.roles.get("606594867136823316");
            const member = reaction.message.guild.members.find(({ user: { id } }) => id === user.id);
            console.log(`CO-OP || ${user.username} has un-requested the Co-op Role.`);
            if (member && role) {
                if (member.roles.has(role.id)) {
                    member.removeRole(role).catch(console.error);
                }
            }
        } catch (e) {
            console.error("Error removing role");
            console.debug("reaction: ", reaction);
            console.debug("user: ", user);
            // ToDo: Figure somethin out.
        }
    }
});

client.on("raw", (packet: any) => {
    if (!["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(packet.t)) {
        return;
    }
    const channel = client.channels.get(packet.d.channel_id);
    if (!channel || channel.messages.has(packet.d.message_id)) {
        return;
    }
    channel.fetchMessage(packet.d.message_id).then(message => {
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.get(emoji);
        const user = client.users.get(packet.d.user_id);
        if (reaction && user) {
            reaction.users.set(packet.d.user_id, user);
        }
        if (packet.t === "MESSAGE_REACTION_ADD") {
            client.emit("messageReactionAdd", reaction, user);
        }
        if (packet.t === "MESSAGE_REACTION_REMOVE") {
            client.emit("messageReactionRemove", reaction, user);
        }
    });
});

client.on("message", async message => {
    if (message.content.includes("typescript")) {
        return message.reply("Typescript!");
    }
});

const antnee = "115270563349528579";

client.on("message", async message => {
    if (message.content === "thanks bud" && message.author.id === antnee) {
        message.reply("no problem fam");
        return;
    }
    if (message.content === ">debug") {
        const guilds = client.guilds.array();
        for (const guild of guilds) {
            if (guild.owner) {
                console.log(guild.name + " : " + guild.id + " : " + guild.owner.user.username);
            } else {
                console.log(guild.name + " : " + guild.id);
            }
        }
        return;
    }

    if (message.content === ">debug update") {
        message.reply("Starting Data Update");
        await runUpdates(scraperFiles);
        message.reply("Data Update Done");
    }

    if (message.content === ">debug carries") {
        for (const carry of requests) {
            console.dir(carry, { depth: 1, color: true });
        }
    }

    if (message.content === ">debug data") {
        // console.dir(dataStore.dragalia.weapons.length, {depth: 5, colors: true});
        console.log(
            "Dragons: " +
                dataStore.dragalia.dragons.length +
                "\n" +
                "Units: " +
                dataStore.dragalia.units.length +
                "\n" +
                "Weapons: " +
                dataStore.dragalia.weapons.length +
                "\n" +
                "Prints: " +
                dataStore.dragalia.prints.length,
        );
    }

    try {
        if (message.content === ">start alerts") {
            const channel = message.channel.guild.channels.get("597471505571381272");
            if (!channel) {
                return;
            }
            const messageToSend =
                "```md\nALERT\n===========\nPlease refrain from making general discussion in this channel. Individuals chatting in here are expected to either be posting gacha/scouting results or salt about these posts. Anyone who is caught utilizing #gacha-results as a second #pm-chat will receive a warning or mute with no verbal warning beforehand. Any selling or trading is strictly prohibited on the pokemon masters discord, and anyone suspected of trying to initiate an account exchange with other users will be immediately banned. Remember to spend your money wisely, gacha is gambling.```";
            channel.send(messageToSend);
            settime(messageToSend, channel);
        }
        if (message.content === ">stop alerts") {
            clearTimeout(timedMessage);
        }
    } catch (e) {
        //
    }
    try {
        if (message.guild.id === "583120259708616715") {
            if (message.channel.id === "603818219131764736" || message.channel.id === "604281012901511178") {
                return;
            }
        }
    } catch (e) {
        //
    }

    try {
        if (message.channel.id === "611678630925565972") {
            if (message.channel.guild.id !== "583120259708616715") {
                return;
            }
            addTrainerRole(message);
        }
        if (message.channel.guild.id === "259802877269245952") {
            if (message.attachments !== null) {
                const img = message.attachments.first().url;
                console.log("SNOOP || " + message.author.username + " => " + img);
            } else {
                console.log("SNOOP || " + message.author.username + " => " + message.content);
            }
        }
    } catch (e) {
        //
    }

    if (message.author.bot) {
        return;
    }
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }
    const args = message.content.slice(prefix.length).split(/ +/);
    // TODO: Bother to fix the use of "!" here
    const command = args.shift()!.toLowerCase();
    if (!client.commands.has(command)) {
        return;
    }
    try {
        const clientCommand = client.commands.get(command);
        if (clientCommand) {
            clientCommand.execute(message, args, client, dataStore, requests);
        }
    } catch (error) {
        console.error(error);
        message.reply("Cannot run command!");
    }
});

client.login(environment === "production" ? prodToken : stagingToken);

async function addTrainerRole(message: Discord.Message) {
    if (message.content === ">enter") {
        try {
            const { member } = message;
            const trainerRole = message.guild.roles.get("611638752015679596");
            if (member && trainerRole) {
                if (!member.roles.has(trainerRole.id)) {
                    await member.addRole(trainerRole).catch(console.error);
                }
            }
            message.delete(2000).catch(console.error);
            message.channel.send(`Trainer role given to ${message.author.username}`);
        } catch (e) {
            //
        }
    } else {
        message.delete(10000).catch(console.error);
    }
}

function settime(messageToSend: string, channel: Discord.Channel) {
    timedMessage = setTimeout(() => {
        channel.send(messageToSend);
        settime(messageToSend, channel);
    }, 10800000);
}

// ToDo: something is FUCKY with the prod version of this runs fine on staging
async function runUpdates(scripts: any[]) {
    console.log("Starting data update");
    for (const script of scripts) {
        switch (script.key) {
            case "dragalia-units":
                const unitData: Promise<never>[] = await script.getUnitData();
                for (const unit of unitData) {
                    dataStore.dragalia.units.push(await unit);
                }
                console.log("Units updated.");
                break;
            case "dragalia-weapons":
                const weaponData: Promise<never>[] = await script.getWeaponData();
                for (const weapon of weaponData) {
                    dataStore.dragalia.weapons.push(await weapon);
                }
                console.log("Weapons updated.");
                break;
            case "dragalia-dragons":
                const dragonData: Promise<never>[] = await script.getDragonData(await script.getDragonLinks());
                for (const dragon of dragonData) {
                    dataStore.dragalia.dragons.push(await dragon);
                }
                console.log("Dragons updated.");
                break;
            case "dragalia-prints":
                const printData: Promise<never>[] = await script.getPrintData();
                for (const print of printData) {
                    dataStore.dragalia.prints.push(await print);
                }
                console.log("Prints updated.");
                break;
        }
    }
    console.log("Data Update Done");
}
