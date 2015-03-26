// var SlackClient = require('slack-client');
// var slack = new SlackClient(process.env.HUBOT_SLACK_TOKEN, true, true);

var drink = {};

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
    console.log(message);
    message.reply('Be a lamb and get ' + message.match[1] + ' a ' + type + '?');
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
