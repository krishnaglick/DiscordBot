//mandatory imports
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./auth.json');

//setup for discord client reference. Used as the basis for the bot.
const client = new Discord.Client();
//setup for commands collection.
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
//auto response dictionary. input on the left and output on the right. Type useless tbh
/*
const responseObject = {
    ":^)": "(^:",
    "based": "and redpilled",
    "ascii": "][_ {[]} ][_",
    "gay": "SHUT THE FUCK UP"
};
*/
//reddit filter establisher
//var fw = ["/r", "r/", "/r/", "eddit", ":leddit:", "eddit.com", "reddi"];
//var length = fw.length;
//var whileCon = length;
//code which is done on bot's start up. As of now only logs that the bot is running and sets the activty.
client.once('ready', () => {
	console.log(`Bot is running on ${client.guilds.size} servers`);
	client.user.setActivity('Please Read Pokemon Special');
});
//botgame prototype
var keyword = "asdafasdfasedfwqaefqerwsgqergwergsdafgadfsg";
var keywordFound = false;
var it = "";
var previt = "";
//emoji func for reactwait
const filter = (reaction, user) => {
    return ['🚫'].includes(reaction.emoji.name);
};
//maf init variables
var gameRunning = false;
var daychat;
var nightchat;
var playerRole;
var mafRole;
var playersFin = [[],[]];
//creates reference to the squint custom emoji used later
const squint = client.emojis.find(emoji => emoji.name === "squint");
//code which is done whenever a message is sent in a discord the bot exists in.
client.on('message', message => {
    //message id reference
    var messageID = message.id;
    //message vote to delete functionality.
    /*
    var users = [];
    var emotesToDelete = 1;
    var collectedEmotes = 0;
    client.on('messageReactionRemoveAll', (reaction) => {
        users.length = 0;
        collectedEmotes = 0;
    });
    client.on('messageReactionRemove', (reaction, user) => {
        if (reaction.emoji.name === "🚫" && reaction.message.id === messageID) {
            for( var i = 0; i < users.length; i++){
                if ( users[i] === user.username) {
                    users.splice(i, 1);
                }
            }
            collectedEmotes -= 1;
        }
    });
    client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.emoji.name === "🚫" && reaction.message.id === messageID) {
            users.push(user.username);
            collectedEmotes += 1;
        }
        if(collectedEmotes === 4){
            message.delete().then(msg => message.channel.send(`Deleted message from ${msg.author.username}\nVoted by: ${users.join(", ")}`)).catch(console.error);
            console.log("DEMOC || Message deleted by vote.");
        }
    });
    */
    //if the message is sent by a bot, ignore it.
    if (message.author.bot) return;
    //reset the filter array length so it can be ran through for each message.
    //if(whileCon !== length){
             //whileCon = length;
    //}
	//le reddit filter
    /*
    if(message.content.indexOf("r/") !== -1 || message.content.indexOf("reddit") !== -1 || message.content.indexOf("Reddit") !== -1) {
        message.delete()
            .then(msg => console.log(`Deleted message from ${msg.author.username} for saying ${msg.content}`))
            .catch(console.error);
    }*/
    //mafia handler
    var gameRunning = false;


    if(message.content.startsWith(">maf")){
        var params = message.content.slice(prefix.length).split(/ +/);
        switch (params[1]) {
            case "start":
                playerRole = message.guild.roles.find(roles => roles.id === "596434675090587669");
                mafRole = message.guild.roles.find(roles => roles.id === "596434740983234595");
                daychat = message.guild.channels.find(channels => channels.id === "596442699075289088");
                nightchat = message.guild.channels.find(channels => channels.name === "596442762077798422");
                gameRunning = true;
                roleSyntax(params[2], message);
                break;
        }
    }
    //keyword game handler
    /*
    if (message.guild) {
        //role reference for IT
        let itRole = message.guild.roles.find(role => role.name === "IT");
        //code block to run if the keyword is said by someone who isn't it.
        if ((message.content.indexOf(keyword) !== -1 || message.content.indexOf(keyword.toLocaleLowerCase()) !== -1 || message.content.indexOf(keyword.toLocaleUpperCase()) !== -1 || message.content.indexOf(keyword.charAt(0).toUpperCase() + keyword.substring(1,keyword.length)) !== -1) && keywordFound === false && message.author !== it) {
            keywordFound = true;
            it = message.author;
            message.member.addRole(itRole);
            message.react(client.emojis.find(emoji => emoji.name === "ru").id)
                .then(() => message.react("🇬"))
                .then(() => message.react("🇴"))
                .then(() => message.react("🇹"))
                .catch(() => console.error('One of the emojis failed to react.'));
            message.author.send("Congratulations! You've invoked the keyword: " + keyword + " that was set by " + previt + ". Go to the #bot-game channel I just added you to and set a new Keyword to continue the game. Use >kw [your new keyword]");
            console.log("The keyword: " + keyword + " has been found by " + message.author.username);
        }
        //code block to run when it sets their new keyword
        if (keywordFound === true && message.content.startsWith(">kw ") && message.author === it) {
            keyword = message.content.replace(">kw ", "");
            keywordFound = false;
            message.member.removeRole(itRole);
            message.author.send("You've set the new keyword. The game continues.");
            console.log("The keyword has been set to: " + keyword + " by " + message.author.username);
            previt = message.author.username;
            message.delete()
                .then(msg => console.log(`Deleted >kw from ${msg.author.username}`))
                .catch(console.error);
            return;
        }
        //debug command for setting IT
        if (message.content.startsWith(">debug set it")) {
            it = getUserFromMention(message.content.replace(">debug set it ", ""));
            console.log("DEBUG || It set to: " + it.username);
            message.delete()
                .then(msg => console.log(`Deleted >debug from ${msg.author.username}`))
                .catch(console.error);
            return;
        }
        //debug command for setting the keyword
        if (message.content.startsWith(">debug set word")) {
            keyword = message.content.replace(">debug set word ", "");
            console.log("DEBUG || KeyWord set to: " + keyword);
            message.delete()
                .then(msg => console.log(`Deleted >debug from ${msg.author.username}`))
                .catch(console.error);
            return;
        }
        //debug command to print current game information
        if (message.content.startsWith(">debug botgame info")) {
            var kwstatus = "";
            if (keywordFound) {
                kwstatus = "Found and awaiting >kw from " + it.username;
            } else {
                kwstatus = "Not Found";
            }
            console.log("DEBUG || KeyWord: " + keyword + "\n" +
                "      || Current IT: " + it.username + "\n" +
                "      || KeyWord Status: " + kwstatus);
            message.delete()
                .then(msg => console.log(`Deleted >debug from ${msg.author.username}`))
                .catch(console.error);
            return;
        }
    }
    */
    //if the message is one of the auto response inputs, reply with the output
    /*
    if (responseObject[message.content]) {
        message.reply(responseObject[message.content]);
    }
    */
    //le reddit filter
    /*
    while (whileCon--) {
        if (message.content.indexOf(fw[whileCon]) !== -1 && message.guild.id === "453732177058988034") {
            message.delete()
                .then(msg => console.log(`Deleted message from ${msg.author.username} for saying ${msg.content}`))
                .catch(console.error);
        }
    }
    whileCon = length;
    */
    //randomly react to messages with the squint emoji from earlier
    /*
    if (Math.floor(Math.random() * 100) > 97) {
        message.react(client.emojis.find(emoji => emoji.name === "squint").id);
    }
    */
    //checks the message's first character for the > prefix, if the prefix isnt found the function returns.
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    //if the prefix IS found, the command call is split with the word immediately following the prefix becoming command and everything after it becoming the space delimitted args array
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    //if the commaand is not found within the commands collection (ie. it doesnt exist) then the function returns. otherwise it will execute the function defined in the commands specific .js file in the commands folder
    if (!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Cannot run command!');
    }
});
client.login(token);
//Fix?
/*
function getUserFromMention(mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return client.users.get(mention);
    }
}
function MafGPLoop(currentChat, inactiveChat, Time, mafrole, playerrole){
    if(currentChat.name === "night-chat"){
        message.guild.channels.get(currentChat.id).send("You are Mafia aligned.");
        message.guild.channels.get(inactiveChat.id).send("The Game Begins.")
    }
    if(currentChat.name === "day-chat"){
    }
}
function AssignRoles(players, roleString, roleInt, message){
    var tempPlayers = players;
    var tempRoles = [];
    for(x in roleString){
        var count = roleInt[x];
        while(count !== 0){
            tempRoles.push(roleString[x]);
            count--;
        }
    }
    for(x in tempPlayers){
        var rand = Math.floor(Math.random() * Math.floor(tempRoles.length));
        playersFin[0].push(tempPlayers[x]);
        playersFin[1].push(tempRoles[rand]);
        tempPlayers[x].sendMessage("Your role is: " + playersFin[1][x]);
        tempRoles.splice(rand,1);
        var player = message.guild.members.find(member => member.user === tempPlayers[x]);
        if(alignment[playersFin[1][x]] === "Town"){
            player.addRole(playerRole);
        }
        else{
            player.addRole(mafRole);
        }
    }
    MafGPLoop(nightchat, daychat, 10, mafRole, playerRole);
}
const mafFilter = (reaction) => reaction.emoji.name === '👌';
function roleSyntax(rolecode, message){
    var based = rolecode.split(";");
    var yeet = "";
    var roles= [];
    var rolenums = [];
    var totalPlayers = 0;
    for(var x in based){
        var temp = based[x].split("-");
        var cope = roleMap[temp[0]];
        roles.push(cope);
        var num = temp[1];
        rolenums.push(num);
        yeet+= cope + ": " + num + "\n";
        totalPlayers += +num;
    }
    var intermediary = yeet + "Total Players Needed: " + totalPlayers;
    var players = [];
    message.channel.send(intermediary).then(
        message => {
            message.react('👌');
            message.awaitReactions(mafFilter, {max: totalPlayers+1, time: 600000}).then(
                collected => {
                    players.length = 0;
                    players = message.reactions.first().users.array();
                    players.shift();
                    message.edit(yeet += "\n" + `All ${totalPlayers} players found, starting game.\n Current Players: ${players.join(", ")}`);
                    AssignRoles(players, roles, rolenums, message);
                }
            ).catch(
                collected => {
                    //console.log("error");
                }
            )
        }
    );
}
const roleMap = {
    "vil" : "Villager",
    "maf" : "Mafia",
    "gof" : "GodFather",
    "cop" : "Cop",
    "doc" : "Doctor"
};
const alignment = {
    "Villager" : "Town",
    "Mafia" : "Mafia",
    "GodFather" : "Mafia",
    "Cop" : "Town",
    "Doctor" : "Town"
};
*/