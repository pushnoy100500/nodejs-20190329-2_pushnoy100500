const LineSplitStream = require('./LineSplitStream');
const os = require('os');

const lines = new LineSplitStream({
  encoding: 'utf-8',
  highWaterMark: 5,
});

function onData(line) {
  console.log('data:', line);
}

lines.on('data', onData);

lines.write(`первая строка${os.EOL}вторая строка${os.EOL}третья строка`);
lines.write('a');
lines.write(`b${os.EOL}c`);
lines.end();