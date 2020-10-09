const concurrently = require('concurrently');
const { readdirSync } = require('fs');

const { argv } = process;
// eslint-disable-next-line no-unused-vars
const [node, path, ...packages] = argv;
const isDebug = process.env.NODE_ENV !== 'production';
const cmd = isDebug ? 'build:dev' : 'build';
const allPackages = readdirSync('./packages');
const firstToGo = ['core'];
const lastToGo = ['spiral-bridge', 'bundle'];

const execute = ((packages && packages.length) ? packages.filter((p) => (allPackages.indexOf(p) >= 0)) : allPackages).sort((a, b) => {
  if (firstToGo.indexOf(a) >= 0 || lastToGo.indexOf(b) >= 0) {
    return -1;
  }
  if (lastToGo.indexOf(a) >= 0 || firstToGo.indexOf(b) >= 0) {
    return 1;
  }
  return a.localeCompare(b);
});

// eslint-disable-next-line no-console
console.log(`\x1b[30m\x1b[47m Watching libs in following order \x1b[31m`, execute.join('->'), '\x1b[0m');

if (execute && execute.length) {
  const commands = execute.map(module=>({command: `npx lerna run watch --scope=@writeaway/${module} --stream`, name: module}));
  concurrently(commands, {prefix: '{name}:{time}'});
} else {
  // eslint-disable-next-line no-console
  console.log('No package names specified or specified only invalid names');
}
