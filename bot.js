"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var e_1, _a;
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var discord_js_1 = __importDefault(require("discord.js"));
var auth_json_1 = require("./auth.json");
var client = new discord_js_1.default.Client();
var environment = process.env.ENV || "stage";
client.commands = new discord_js_1.default.Collection();
var commandFiles = fs_1.default.readdirSync("./commands").filter(function (file) { return file.endsWith(".js"); });
var scraperFiles = fs_1.default
    .readdirSync("./Scripts")
    .filter(function (file) { return file.endsWith(".js"); })
    .map(function (file) {
    return require("./Scripts/" + file);
});
var timedMessage;
try {
    for (var commandFiles_1 = __values(commandFiles), commandFiles_1_1 = commandFiles_1.next(); !commandFiles_1_1.done; commandFiles_1_1 = commandFiles_1.next()) {
        var file = commandFiles_1_1.value;
        // TODO: Not use require here
        // tslint:disable-next-line
        var command = require("./commands/" + file);
        client.commands.set(command.name, command);
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (commandFiles_1_1 && !commandFiles_1_1.done && (_a = commandFiles_1.return)) _a.call(commandFiles_1);
    }
    finally { if (e_1) throw e_1.error; }
}
var dataStore = {
    dragalia: {
        weapons: [],
        dragons: [],
        units: [],
        prints: [],
    },
};
// TODO: Type me
var requests = [];
client.once("ready", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Bot is running on " + client.guilds.size + " servers");
                client.user.setActivity(">help");
                return [4 /*yield*/, runUpdates(scraperFiles)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
client.on("messageReactionAdd", function (reaction, user) {
    if (reaction.emoji.name === "🤝" && reaction.message.id === "606589614123384843") {
        try {
            var role = reaction.message.guild.roles.get("606594867136823316");
            var member = reaction.message.guild.members.find(function (_a) {
                var id = _a.user.id;
                return id === user.id;
            });
            console.log("CO-OP || " + user.username + " has requested the Co-op Role.");
            if (member && role) {
                if (!member.roles.has(role.id)) {
                    member.addRole(role).catch(console.error);
                }
            }
        }
        catch (e) {
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
client.on("messageReactionRemove", function (reaction, user) {
    if (reaction.emoji.name === "🤝" && reaction.message.id === "606589614123384843") {
        try {
            var role = reaction.message.guild.roles.get("606594867136823316");
            var member = reaction.message.guild.members.find(function (_a) {
                var id = _a.user.id;
                return id === user.id;
            });
            console.log("CO-OP || " + user.username + " has un-requested the Co-op Role.");
            if (member && role) {
                if (member.roles.has(role.id)) {
                    member.removeRole(role).catch(console.error);
                }
            }
        }
        catch (e) {
            console.error("Error removing role");
            console.debug("reaction: ", reaction);
            console.debug("user: ", user);
            // ToDo: Figure somethin out.
        }
    }
});
client.on("raw", function (packet) {
    if (!["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(packet.t)) {
        return;
    }
    var channel = client.channels.get(packet.d.channel_id);
    if (!channel || channel.messages.has(packet.d.message_id)) {
        return;
    }
    channel.fetchMessage(packet.d.message_id).then(function (message) {
        var emoji = packet.d.emoji.id ? packet.d.emoji.name + ":" + packet.d.emoji.id : packet.d.emoji.name;
        var reaction = message.reactions.get(emoji);
        var user = client.users.get(packet.d.user_id);
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
client.on("message", function (message) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (message.content.includes("typescript")) {
            return [2 /*return*/, message.reply("Typescript!")];
        }
        return [2 /*return*/];
    });
}); });
var antnee = "115270563349528579";
client.on("message", function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var guilds, guilds_1, guilds_1_1, guild, requests_1, requests_1_1, carry, channel, messageToSend, img, args, command, clientCommand;
    var e_2, _a, e_3, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (message.content === "thanks bud" && message.author.id === antnee) {
                    message.reply("no problem fam");
                    return [2 /*return*/];
                }
                if (message.content === ">debug") {
                    guilds = client.guilds.array();
                    try {
                        for (guilds_1 = __values(guilds), guilds_1_1 = guilds_1.next(); !guilds_1_1.done; guilds_1_1 = guilds_1.next()) {
                            guild = guilds_1_1.value;
                            if (guild.owner) {
                                console.log(guild.name + " : " + guild.id + " : " + guild.owner.user.username);
                            }
                            else {
                                console.log(guild.name + " : " + guild.id);
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (guilds_1_1 && !guilds_1_1.done && (_a = guilds_1.return)) _a.call(guilds_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    return [2 /*return*/];
                }
                if (!(message.content === ">debug update")) return [3 /*break*/, 2];
                message.reply("Starting Data Update");
                return [4 /*yield*/, runUpdates(scraperFiles)];
            case 1:
                _c.sent();
                message.reply("Data Update Done");
                _c.label = 2;
            case 2:
                if (message.content === ">debug carries") {
                    try {
                        for (requests_1 = __values(requests), requests_1_1 = requests_1.next(); !requests_1_1.done; requests_1_1 = requests_1.next()) {
                            carry = requests_1_1.value;
                            console.dir(carry, { depth: 1, color: true });
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (requests_1_1 && !requests_1_1.done && (_b = requests_1.return)) _b.call(requests_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
                if (message.content === ">debug data") {
                    // console.dir(dataStore.dragalia.weapons.length, {depth: 5, colors: true});
                    console.log("Dragons: " +
                        dataStore.dragalia.dragons.length +
                        "\n" +
                        "Units: " +
                        dataStore.dragalia.units.length +
                        "\n" +
                        "Weapons: " +
                        dataStore.dragalia.weapons.length +
                        "\n" +
                        "Prints: " +
                        dataStore.dragalia.prints.length);
                }
                try {
                    if (message.content === ">start alerts") {
                        channel = message.channel.guild.channels.get("597471505571381272");
                        if (!channel) {
                            return [2 /*return*/];
                        }
                        messageToSend = "```md\nALERT\n===========\nPlease refrain from making general discussion in this channel. Individuals chatting in here are expected to either be posting gacha/scouting results or salt about these posts. Anyone who is caught utilizing #gacha-results as a second #pm-chat will receive a warning or mute with no verbal warning beforehand. Any selling or trading is strictly prohibited on the pokemon masters discord, and anyone suspected of trying to initiate an account exchange with other users will be immediately banned. Remember to spend your money wisely, gacha is gambling.```";
                        channel.send(messageToSend);
                        settime(messageToSend, channel);
                    }
                    if (message.content === ">stop alerts") {
                        clearTimeout(timedMessage);
                    }
                }
                catch (e) {
                    //
                }
                try {
                    if (message.guild.id === "583120259708616715") {
                        if (message.channel.id === "603818219131764736" || message.channel.id === "604281012901511178") {
                            return [2 /*return*/];
                        }
                    }
                }
                catch (e) {
                    //
                }
                try {
                    if (message.channel.id === "611678630925565972") {
                        if (message.channel.guild.id !== "583120259708616715") {
                            return [2 /*return*/];
                        }
                        addTrainerRole(message);
                    }
                    if (message.channel.guild.id === "259802877269245952") {
                        if (message.attachments !== null) {
                            img = message.attachments.first().url;
                            console.log("SNOOP || " + message.author.username + " => " + img);
                        }
                        else {
                            console.log("SNOOP || " + message.author.username + " => " + message.content);
                        }
                    }
                }
                catch (e) {
                    //
                }
                if (message.author.bot) {
                    return [2 /*return*/];
                }
                if (!message.content.startsWith(auth_json_1.prefix) || message.author.bot) {
                    return [2 /*return*/];
                }
                args = message.content.slice(auth_json_1.prefix.length).split(/ +/);
                command = args.shift().toLowerCase();
                if (!client.commands.has(command)) {
                    return [2 /*return*/];
                }
                try {
                    clientCommand = client.commands.get(command);
                    if (clientCommand) {
                        clientCommand.execute(message, args, client, dataStore, requests);
                    }
                }
                catch (error) {
                    console.error(error);
                    message.reply("Cannot run command!");
                }
                return [2 /*return*/];
        }
    });
}); });
client.login(environment === "production" ? auth_json_1.prodToken : auth_json_1.stagingToken);
function addTrainerRole(message) {
    return __awaiter(this, void 0, void 0, function () {
        var member, trainerRole, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(message.content === ">enter")) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    member = message.member;
                    trainerRole = message.guild.roles.get("611638752015679596");
                    if (!(member && trainerRole)) return [3 /*break*/, 3];
                    if (!!member.roles.has(trainerRole.id)) return [3 /*break*/, 3];
                    return [4 /*yield*/, member.addRole(trainerRole).catch(console.error)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    message.delete(2000).catch(console.error);
                    message.channel.send("Trainer role given to " + message.author.username);
                    return [3 /*break*/, 5];
                case 4:
                    e_4 = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    message.delete(10000).catch(console.error);
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
function settime(messageToSend, channel) {
    timedMessage = setTimeout(function () {
        channel.send(messageToSend);
        settime(messageToSend, channel);
    }, 10800000);
}
// ToDo: something is FUCKY with the prod version of this runs fine on staging
function runUpdates(scripts) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("Starting data update");
            // for (const script of scripts) {
            //     switch (script.key) {
            //         case "dragalia-units":
            //             await script.getUnitData().then(async (data: Promise<any>[]) => {
            //                 for (const unit of data) {
            //                     dataStore.dragalia.units.push(await unit);
            //                 }
            //                 console.log("Units updated.");
            //             });
            //             break;
            //         case "dragalia-weapons":
            //             await script.getWeaponData().then(async (data: Promise<any>[]) => {
            //                 for (const weapon of data) {
            //                     dataStore.dragalia.weapons.push(await weapon);
            //                 }
            //                 console.log("Weapons updated.");
            //             });
            //             break;
            //         case "dragalia-dragons":
            //             await script.getDragonData(await script.getDragonLinks()).then(async (data: Promise<any>[]) => {
            //                 for (const dragon of data) {
            //                     dataStore.dragalia.dragons.push(await dragon);
            //                 }
            //                 console.log("Dragons updated.");
            //             });
            //             break;
            //         case "dragalia-prints":
            //             await script.getPrintData().then(async (data: Promise<any>[]) => {
            //                 for (const print of data) {
            //                     dataStore.dragalia.prints.push(await print);
            //                 }
            //                 console.log("Prints updated.");
            //             });
            //             break;
            //     }
            // }
            console.log("Data Update Done");
            return [2 /*return*/];
        });
    });
}
