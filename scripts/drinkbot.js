var drink = {};

drink.needADrink = function needADrink(type) {
  return function needADrink(message) {
    message.reply('Perhaps it\'s time to get a ' + type + ' round underway?');
  };
};

var commands = {
  tea: {
    'i need a tea': 'needADrink'
  },
  beer: {
    'i need a beer': 'needADrink'
  }
};

module.exports = function drinkBot(robot) {
  /**
   * For each type of command.
   */
  for (var type in commands) {
    if (commands.hasOwnProperty(type)) {
      /**
       * For each command
       */
      for (command in commands[type]) {
        if (commands[type].hasOwnProperty(command)) {
          /**
           * If that command references a valid function.
           */
          if (drink.hasOwnProperty(commands[type][command]) && (typeof drink[commands[type][command]] === "function")) {
            robot.respond(new RegExp(command, 'i'), drink[commands[type][command]]([type]));
          }
          else {
            console.error("Invalid drink command:", commands[type][command]);
          }
        }
      }
    }
  }
};
