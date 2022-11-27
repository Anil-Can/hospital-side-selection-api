const express = require('express');
const morgan = require('morgan');
const chalk = require("chalk");
const cors = require('cors')
const db = require('./db/db.js')

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.get("/getDistricts",async(req,res)=>{
    const query = "SELECT id,name FROM districts;"
    console.log(chalk.green('HOSPITAL SQL :') + chalk.blueBright(query))
    let result =await db.query(query)
    res.send(result.rows)
})
app.get("/getFeatures",async(req,res) => {
    const {tableName,where,joinAtt} = req.query;
    let resultInfo = await db.query(`SELECT attributes
	FROM public.hospital_tables_info WHERE name = '${tableName}';`)
    let attributes = resultInfo.rows[0].attributes.split("|");
    if(where)
    {
        let json_build = attributes.reduce((acuumalator,current)=>{
            acuumalator += `'${current}',${current},`
            return acuumalator
          },"");
        let join = attributes.reduce((acuumalator,current)=>{
            acuumalator += `a.${current},`
            return acuumalator
          },"");
        join += 'a.geom,';
        if(where.includes('district_id')){
            json_build += "'district_id',district_id";
            join += "district_id";
        }
        const query = `SELECT row_to_json(fc)
        FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
        FROM (SELECT 'Feature' As type
           , ST_AsGeoJSON(lg.geom)::json As geometry
           , json_build_object(${json_build}) As properties
          FROM (SELECT ${join} FROM ${tableName} a INNER JOIN districts_${tableName} b ON a.id = b.${joinAtt} WHERE ${where}) As lg   ) As f )  As fc;`
        console.log(chalk.green('HOSPITAL SQL :') + chalk.blueBright(query))
        let result = await db.query(query)
        
        res.json({source:result.rows[0].row_to_json,attributes:attributes})
    }
    else
    {
        let json_build = attributes.reduce((acuumalator,current)=>{
            acuumalator += `'${current}',${current},`
            return acuumalator
          },"");
        const query = `SELECT row_to_json(fc)
        FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
        FROM (SELECT 'Feature' As type
           , ST_AsGeoJSON(lg.geom)::json As geometry
           , json_build_object(${json_build.slice(0,-1)}) As properties
          FROM ${tableName} As lg   ) As f )  As fc;`
        console.log(chalk.green('HOSPITAL SQL :') + chalk.blueBright(query))
        let result = await db.query(query)
        res.json({source:result.rows[0].row_to_json,attributes:attributes})
    }
    
})
app.get("/getSpatialTables", async(req,res)=>{
    const query = "SELECT name,geom_type FROM hospital_tables_info;"
    console.log(chalk.green('HOSPITAL SQL :') + chalk.blueBright(query))
    let result =await db.query(query)
    res.send(result.rows)
})
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

