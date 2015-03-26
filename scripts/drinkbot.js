var drink = {};

drink.needADrink = function iNeedADrink(type) {
  return function needADrink(message) {
    message.reply('Perhaps it\'s time to get a ' + type + ' round underway?');
  };
};

var commands = {
  'i need a DRINK': 'iNeedADrink',
  '([a-z ,.\'-]+) needs a DRINK': 'theyNeedADrink'
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
