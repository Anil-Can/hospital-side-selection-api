const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const db = require('./db/db.js')
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.get("/getDistricts",async (req,res)=>{
    let result = await db.query(`SELECT row_to_json(fc)
    FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
    FROM (SELECT 'Feature' As type
       , ST_AsGeoJSON(lg.geom)::json As geometry
       , json_build_object('id',id, 'name',name,'area',area,'population',population) As properties
      FROM districts As lg   ) As f )  As fc;`)
    res.json(result.rows[0].row_to_json)
});
app.post("/createRecords",async (req,res)=>{
    const {key,values,table,id} = req.body;
    if(id)
    {
        let result = await db.query(`INSERT INTO ${table} (${key}) VALUES(${values}) RETURNING id`);
        res.send((result.rows[0].id).toString());
    }
    else
    {
        await db.query(`INSERT INTO ${table} (${key}) VALUES(${values})`);
        res.send("Başarılı");
    }
})
app.listen(process.env.PORT, () => {
    
});

