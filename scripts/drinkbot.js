var drink = {};

drink.needADrink = function needADrink(type) {
  return function needADrink(message) {
    message.reply('Perhaps it\'s time to get a ' + type + ' round underway?');
  };
};

module.exports = function drinkBot(robot) {
  robot.respond(/need a tea/i, drink.needADrink('tea'));
  robot.respond(/need a beer/i, drink.needADrink('beer'));
};
