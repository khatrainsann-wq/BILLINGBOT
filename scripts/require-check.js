const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src');
const folders = ['models', 'utils', 'commands', 'events', 'database'];

let failed = false;
for (const f of folders) {
  const dir = path.join(root, f);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(x => x.endsWith('.js'));
  for (const file of files) {
    const full = path.join(dir, file);
    try {
      require(full);
      console.log(`OK   ${path.relative(process.cwd(), full)}`);
    } catch (err) {
      failed = true;
      console.error(`ERR  ${path.relative(process.cwd(), full)} -> ${err && err.message}`);
    }
  }
}

if (failed) process.exit(1);
console.log('Require-check completed. No immediate syntax/runtime errors during require.');
