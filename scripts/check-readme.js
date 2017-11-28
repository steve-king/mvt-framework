const fs = require('fs');
const { resolve } = require('path');

const mvtFolder = resolve(process.cwd(), 'src/mvt');

fs.readdirSync(mvtFolder).forEach((item) => {
  const readmePath = resolve(mvtFolder, item, 'README.md');
  const readmeData = fs.readFileSync(readmePath, 'utf8');

  if (!readmeData) {
    // eslint-disable-next-line no-console
    console.error(`👎  ${item}/README.md is either empty does not exist! Please provide some documentation for future reference`);
    process.exit(1);
  }
});

process.exit();
