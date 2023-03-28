const fs = require('fs').promises;
const path = require('path');
const os = require('os');

async function traverseDirectory(directory) {
  try {
    const folderStats = await fs.stat(directory);
    if (!folderStats.isDirectory()) {
      return;
    }

    const folderItems = await fs.readdir(directory);
    for (const item of folderItems) {
      const itemPath = path.join(directory, item);
      const itemStats = await fs.stat(itemPath);

      if (itemStats.isDirectory()) {
        await traverseDirectory(itemPath);
      } else if (itemStats.isFile()) {
        console.log(itemPath);
      }
    }
  } catch (err) {
    console.error(`Error while traversing directory ${directory}: ${err}`);
  }
}

async function logFileSystem() {
  try {
    const homeDir = os.homedir();
    await traverseDirectory(homeDir);
    console.log(`All files in home directory ${homeDir} logged.`);
  } catch (err) {
    console.error(`Error while logging files in home directory: ${err}`);
  }
}

module.exports = {
  logFileSystem,
};