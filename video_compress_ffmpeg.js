const fs = require('fs');
const {exec} = require('child_process')

fs.readdir(".",
	{withFileTypes: true},
	(err, files) => {
	console.log("\nCurrent directory files:");
	if (err)
		console.log(err);
	else {
		files.forEach(file => {
			old_filename = file.name.replaceAll(' ', '\\ ')
			console.log(old_filename)	
			exec(`ffmpeg -i  ${old_filename} -q:v 10 ${file.name.replaceAll(' ', '_')}`)	
})
}
})
