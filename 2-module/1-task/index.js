const LimitedSizeStream = require('./LimitSizeStream');
const fs = require('fs');

const limitedStream = new LimitedSizeStream({ limit: 8 });
const outStream = fs.createWriteStream('out.txt');

limitedStream.pipe(outStream);

limitedStream.write('hello');
