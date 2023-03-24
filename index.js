// Import required libraries
const express = require('express');
const appRoute = require("./routers/appRoute");

// Create express app
// Definition of middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.set('views', (__dirname + "/views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Define Route
app.use("/", appRoute);



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));