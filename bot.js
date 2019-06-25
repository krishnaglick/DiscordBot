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
//auto response dictionary. input on the left and output on the right.
const responseObject = {
    ":^)": "(^:",
    "based": "and redpilled",
    "ascii": "][_ {[]} ][_",
    "gay": "SHUT THE FUCK UP"
};
//reddit filter establisher
var fw = ["/r", "r/", "/r/", "eddit", ":leddit:", "eddit.com", "reddi"];
var length = fw.length;
var whileCon = length;
//code which is done on bot's start up. As of now only logs that the bot is running and sets the activty.
client.once('ready', () => {
	console.log('Bot is running');
	client.user.setActivity('in the mud');
});
//botgame prototype
var keyword = "none";
var keywordFound = false;
var it = "";
var previt = "";

//creates reference to the squint custom emoji used later
const squint = client.emojis.find(emoji => emoji.name === "squint");
//code which is done whenever a message is sent in a discord the bot exists in.
client.on('message', message => {
    //if the message is sent by a bot, ignore it.
    if (message.author.bot) return;
    //reset the filter array length so it can be ran through for each message.
    if(whileCon !== length){
             whileCon = length;
    }
	//le reddit filter
    if(message.content.indexOf("r/") !== -1 || message.content.indexOf("reddit") !== -1 || message.content.indexOf("Reddit") !== -1) {
        message.delete()
            .then(msg => console.log(`Deleted message from ${msg.author.username} for saying ${msg.content}`))
            .catch(console.error);
    }
        //keyword game handler
        if (message.guild) {
            //role reference for IT
            let itRole = message.guild.roles.find(role => role.name === "IT");
            //code block to run if the keyword is said by someone who isn't it.
            if (message.content.indexOf(keyword) !== -1 && keywordFound === false && message.author !== it) {
                keywordFound = true;
                it = message.author;
                message.member.addRole(itRole);
                message.react(client.emojis.find(emoji => emoji.name === "ru").id);
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
        //if the message is one of the auto response inputs, reply with the output
        if (responseObject[message.content]) {
            message.reply(responseObject[message.content]);
        }
        //le reddit filter
        while (whileCon--) {
            if (message.content.indexOf(fw[whileCon]) !== -1 && message.guild.id === "453732177058988034") {
                message.delete()
                    .then(msg => console.log(`Deleted message from ${msg.author.username} for saying ${msg.content}`))
                    .catch(console.error);
            }
        }
        whileCon = length;
        //randomly react to messages with the squint emoji from earlier
        if (Math.floor(Math.random() * 100) > 97) {
            message.react(client.emojis.find(emoji => emoji.name === "squint").id);
        }
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