module.exports = {
	name: 'date',
	description: 'Sends message [its "insert day here" my dudes.]',
	execute(message) {
        // Gets current date, if date ==
        let date = new Date().getDay()
        console.log(date)
        // 0 is Sunday, 1 is monday, and so on
        if (date == 0)
            message.channel.send("https://imgur.com/JcsIYJs")
        if (date == 1)
             message.channel.send("https://imgur.com/q1J8xO5")
        if (date == 2)
            message.channel.send("https://imgur.com/IDpAG8c")
        if (date == 3)
            message.channel.send("https://imgur.com/D8407BW")
        if (date == 4)
            message.channel.send("https://imgur.com/BMYUtr7")
        if (date == 5)
            message.channel.send("https://imgur.com/XDqrJMG")
        if (date == 6)
            message.channel.send("https://imgur.com/LapzGfR")
	},
};