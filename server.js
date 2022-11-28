const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

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
    
});

