const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const chalk = require("chalk");

const { getDistricts,getFeatures,getSpatialTables,createRecords } = require('./db/query.js');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.get("/getDistricts",getDistricts);
app.get("/getFeatures",getFeatures)
app.get("/getSpatialTables",getSpatialTables)
app.post("/createRecords",createRecords)
app.listen(process.env.PORT, () => {
    console.log(chalk.whiteBright("SERVER IS RUNNING PORT: ") + chalk.magenta(process.env.PORT))
    console.log(chalk.whiteBright("HOST: ") + chalk.magenta(process.env.PGHOST))
    console.log(chalk.whiteBright("USER: ") + chalk.magenta(process.env.PGUSER))
    console.log(chalk.whiteBright("DATABASE: ") + chalk.magenta(process.env.PGDATABASE))
});

