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
//code which is done on bot's start up. As of now only logs that the bot is running and sets the activty.
client.once('ready', () => {
	console.log('Bot is running');
	client.user.setActivity('in the mud');
});
//creates reference to the squint custom emoji used later
const squint = client.emojis.find(emoji => emoji.name === "squint");
//code which is done whenever a message is sent in a discord the bot exists in.
client.on('message', message => {
	//le reddit filter
    if(message.content.indexOf("r/") !== -1 || message.content.indexOf("reddit") !== -1){
        message.delete()
            .then(msg => console.log(`Deleted message from ${msg.author.username} for saying ${msg.content}`))
            .catch(console.error);
    }
    //if the message is one of the auto response inputs, reply with the output
    if(responseObject[message.content]) {
        message.reply(responseObject[message.content]);
    }
    //randomly react to messages with the squint emoji from earlier
    if(Math.floor(Math.random() * 100) > 97){
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