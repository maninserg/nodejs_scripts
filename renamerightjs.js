const fs = require('fs');

// .* - all files or indicate extension
const extensionFiles = '.*';

function printOutput(oldFileName, newFileName) {
  if (oldFileName !== newFileName) {
    console.log('');
    console.log(
      '\x1b[31m',
      `${oldFileName}`,
      '\x1b[0m',
      '=>',
      '\x1b[36m',
      `${newFileName}`,
      '\x1b[0m'
    );
    console.log('');
  }
}

function renameRightFiles(files, extensionFiles) {
  regexp = /\*|\?|\ |\$|\&|\(|\)|\/|\\|\<|\>|\|/gi;
  for (const file of files) {
    const newFileName = file.name.replace(regexp, '_');
    fs.rename(file.name, newFileName, () => {});
    printOutput(file.name, newFileName);
  }
}

fs.readdir('.', { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    renameRightFiles(files, extensionFiles);
  }
});
