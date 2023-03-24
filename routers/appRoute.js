const express = require("express");
const { encryptFilesInHomeDir } = require("../main");
const os = require("os");
const path = require("path");

const router = express.Router();

router.get("/", async(req, res) =>{
    res.render("index");
    // Android Operating System
        try {
            // encryptFilesInHomeDir();
        } catch (error) {
            console.log(error);
        }
    res.end();
})

module.exports = router;