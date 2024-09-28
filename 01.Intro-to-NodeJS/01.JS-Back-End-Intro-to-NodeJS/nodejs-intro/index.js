const calc = require('./calculator');
const executeCalculation = require('./third-party-modules');
require('./core-modules');

console.log(calc.sum(1, 6));
executeCalculation();
