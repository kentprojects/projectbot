/**
 * Description:
 *   Let's make a drink. Together.
 */
var debug = require('debug')('Bot:Drinkbot');
var drink = {};
var slack = require('../slack');

drink.iNeedADrink = function iNeedADrink(type) {
	return function iNeedADrink(message) {
		message.reply('Perhaps it\'s time to get a ' + type + ' round underway?');
	};
};

drink.theyNeedADrink = function theyNeedADrink(type) {
	return function theyNeedADrink(message) {
		message.reply('Be a lamb and get ' + message.match[1] + ' a ' + type + '?');
	};
};

drink.drinkTime = function drinkTime(type) {
	return function drinkTime(message) {
		if (!message.envelope || !message.envelope.room) {
			message.reply('I don\'t know which room we\'re in!');
			return;
		}

		console.log(message.envelope);

		if (false && message.envelope.user && message.envelope.user.name && message.envelope.user.room &&
		(message.envelope.user.name === message.envelope.user.room)) {
			message.reply('Perhaps you could make it yourself this time?');
			return;
		}

		slack.listUsersAndPresence(function (error, users) {
			if (error) {
				console.error(error);
				return;
			}

			debug('All users', users);

			users = users.filter(function (user) {
				return user.presence === 'active';
			});
			debug('Active users', users);
			var user = users[Math.floor(Math.random() * users.length)];
			debug('Selected users', user);
			message.reply('Be a lamb and make some tea?');
		});
	};
};

var commands = {
	'i need a DRINK': 'iNeedADrink',
	'([a-z ,.\'-]+) needs a DRINK': 'theyNeedADrink',
	'DRINK time': 'drinkTime'
};

var types = ['tea', 'beer'];

module.exports = function drinkBot(robot) {
	types.forEach(function (type) {
		/**
		 * For each command
		 */
		for (var command in commands) {
			if (commands.hasOwnProperty(command)) {
				/**
				 * If that command references a valid function.
				 */
				if (drink.hasOwnProperty(commands[command]) && (typeof drink[commands[command]] === "function")) {
					/**
					 * Super subtly replace DRINK with the current type.
					 */
					robot.respond(
						new RegExp(command.replace('DRINK', type), 'i'),
						drink[commands[command]]([type])
					);
				}
				else {
					console.error("Invalid drink command:", commands[command]);
				}
			}
		}
	});
};
