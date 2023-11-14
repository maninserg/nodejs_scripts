const fs = require('fs');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

// Source format of files mp4, mkv, m4v and etc
const sourceFormat = 'mp4';
// compression ratio = 1(original compression)...10(max compression)
const compressRatio = 10;
// 38040:2160(4k), 2560:1440(2k),
// 1920:1080(1080p HD), 1280:720(720p HD),
// 854:480(480p SD), 640:360(360p SD), 426:240(240p SD)
const resolutionNewVideo = '1280:720';

function printStartText(fileName, i, maxNumberArray) {
  console.log('');
  console.log('');
  console.log(`Current converting file #${i} of ${maxNumberArray} files:`);
  console.log(fileName);
}

function printFinishText(fileName, time1, time2) {
  const timeConverting = (time2 - time1) / 3600000;
  console.log('');
  console.log(`!!! Finished !!!`);
  console.log(`Converting time = ${timeConverting.toFixed(2)} hour(s)`);
  console.log('');
  console.log('+++++++++');
  console.log('+++++++++');
  console.log('+++++++++');
}

async function compressionFile(file, i, maxNumberArray) {
  if (file.name.endsWith(sourceFormat)) {
    const oldFileName = file.name.replaceAll(' ', '\\ ');
    const newFileName = file.name.replaceAll(' ', '_');
    try {
      const startDateStamp = Date.now();
      printStartText(file.name, i, maxNumberArray);
      const { stdout, stderr } = await exec(
        `ffmpeg -i ${oldFileName} -q:v ${compressRatio} -vf scale=${resolutionNewVideo} ./converted/${newFileName}`
      );
      const finishDateStamp = Date.now();
      // console.log('stdout:', stdout);
      // console.log('stderr:', stderr);
      printFinishText(file.name, startDateStamp, finishDateStamp);
    } catch (e) {
      console.error(e); // should contain code (exit code) and signal (that caused the termination).
    }
  }
}

function getRightFiles(files) {
  const rightFilesArray = [];
  for (const file of files) {
    if (file.name.endsWith(`${sourceFormat}`)) {
      rightFilesArray.push(file.name);
    }
  }
  return rightFilesArray;
}

async function compressionAllFiles(files) {
  const arrayRightFiles = getRightFiles(files);
  let i = 0;
  for (const file of files) {
    await exec('mkdir -p converted');
    await compressionFile(file, i, arrayRightFiles.length);
    i++;
  }
  await exec('mpg123 ~/Desktop/Music/11._Wavves_-_Leave.mp3 ');
}

fs.readdir('.', { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    // exec('mkdir converted');
    compressionAllFiles(files);
  }
});
