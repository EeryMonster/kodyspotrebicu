const fs = require('fs');
const lines = fs.readFileSync('prisma/seed.ts', 'utf8').split('\n');

const getChunk = (start, end) => {
  console.log(`--- Lines ${start}-${end} ---`);
  console.log(lines.slice(start - 1, end).join('\n'));
};

getChunk(2215, 2230);
getChunk(1522, 1540);
getChunk(4054, 4070);
getChunk(4435, 4448);
getChunk(3560, 3576);
getChunk(2450, 2466);
