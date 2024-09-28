const fs = require('fs/promises');

async function main () {
    //Get names of files and directories
    const files = await fs.readdir('./files');

    console.log(files);

    //Create dir
    try {
        await fs.mkdir('./files/second-dir');
    } catch (err){
        console.log(err);
    }

    //Delete dir
    await fs.rmdir('./files/second-dir');

    //Rename file or directory
    await fs.rename('./files/a.txt', './files/aa.txt');

    //Write a file
    await fs.writeFile('./outup.txt', 'Hello from FS!', {encoding: 'utf8'});
}

main();


