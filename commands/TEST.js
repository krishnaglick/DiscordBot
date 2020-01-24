const PythonShell = require('python-shell');
const Discord = require('discord.js');

module.exports = {
    name: 'test',
    display: 'test',
    description: 'test`',
    async execute(message, args, client) {
        const options = {
            mode: 'text',
            pythonOptions: ['-u'],
            pythonPath: "/usr/bin/python2.7",
            scriptPath: __dirname + '/dl/adv',
            args: "-2"
        };
        PythonShell.PythonShell.run(`${args[0]}.py`, options, function (err, results) {
            if (err) {
                message.channel.send(new Discord.RichEmbed()
                    .setTitle(`Error`)
                    .addField('Description', `No DPS calc for this unit.`)
                    .setColor('#ff0000')
                );
                return;
            }
            let output = '';
            results.forEach((elem) => {
                output += elem + '\n';
            });
            console.table(results[0].split(','));
            message.channel.send('```' + output + '```');
        });
    }
};
