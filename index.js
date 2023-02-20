const express = require('express');
const app = express();
const mongoose = require("mongoose");
const indexrouter = require('./Main/indexrouter');

app.use(express.json ());
app.use("/student", indexrouter);

app.listen(3000, () => {
    console.log("server started on port 3000");
});