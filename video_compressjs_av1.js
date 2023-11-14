const fs = require('fs');
const { exec } = require('child_process');

const sourceFormat = 'mp4';
const compressRatio = 10;

async function compressionFile(file) {
  if (file.name.endsWith(sourceFormat)) {
    const oldFileName = file.name.replaceAll(' ', '\\ ');
    console.log(oldFileName);
    const newFileName = file.name.replaceAll(' ', '_');

    try {
      const { stdout, stderr } = await exec(
        `ffmpeg -i ${oldFileName} -c:v libaom-av1 -crf 30 ./converted/${newFileName}`
      );
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
    } catch (e) {
      console.error(e); // should contain code (exit code) and signal (that caused the termination).
    }
  }
}

async function compressionAllFiles(files) {
  for (const file of files) {
    await compressionFile(file);
  }
}

fs.readdir('.', { withFileTypes: true }, (err, files) => {
  console.log('\nCurrent directory files:');
  if (err) console.log(err);
  else {
    exec(`mkdir converted`);
    compressionAllFiles(files);
  }
});
