const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./auth.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const responseObject = {
    ":^)": "(^:",
    "based": "and redpilled",
    "ascii": "][_ {[]} ][_",
    "gay": "SHUT THE FUCK UP"
};

client.once('ready', () => {
	console.log('Bot is running');
	client.user.setActivity('in the mud');
});

const squint = client.emojis.find(emoji => emoji.name === "squint");

client.on('message', message => {
    if(responseObject[message.content]) {
        message.reply(responseObject[message.content]);
    }
    if(Math.floor(Math.random() * 100) > 99){
        message.react(client.emojis.find(emoji => emoji.name === "squint").id);
    }

	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

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