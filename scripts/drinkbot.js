/**
 * Description:
 *   Let's make a drink. Together.
 */
var debug = require('debug')('Bot:Drinkbot');
var drink = {};
var slack = require('../slack');

function getString(type, string) {
	if (!strings.hasOwnProperty(type)) {
		console.error('Invalid strings type:', type);
		return;
	}

	if (!strings[type].hasOwnProperty(string)) {
		console.error('Invalid string for type:', string);
		return;
	}

	return strings[type][string];
}

drink.iNeedADrink = function iNeedADrink(type) {
	return function iNeedADrink(message) {
		message.reply(getString(type, 'suggest_round'));
	};
};

drink.theyNeedADrink = function theyNeedADrink(type) {
	return function theyNeedADrink(message) {
		message.reply(getString(type, 'suggest_for_person').replace('NAME', message.match[1]));
	};
};

drink.drinkTime = function drinkTime(type) {
	return function drinkTime(message) {
		if (!message.envelope || !message.envelope.room) {
			message.reply('I don\'t know which room we\'re in!');
			return;
		}

		console.log(message.envelope);

		if (message.envelope.user && message.envelope.user.name && message.envelope.user.room &&
		(message.envelope.user.name === message.envelope.user.room)) {
			message.reply(getString(type, 'self_room'));
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

var strings = {
	tea: {
		self_room: 'Perhaps you could make the tea yourself this time?',
		suggest_for_person: 'Why don\'t you get NAME a tea?',
		suggest_round: 'Perhaps it\'s time to get a tea round underway?'
	}
};

var types = [
	'tea', 'beer'
];

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
