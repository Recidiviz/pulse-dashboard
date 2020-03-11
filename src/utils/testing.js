const fs = require('fs');


export const readJsonLinesFile = (path) => {
  return fs.readFileSync(path, 'utf8')
      .trim()
      .split('\n')
      .map(line => JSON.parse(line));
};
