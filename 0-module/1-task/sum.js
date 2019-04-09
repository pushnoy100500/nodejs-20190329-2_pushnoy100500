function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('both arguments should be numbers');
  }
  return a + b;
}

module.exports = sum;
