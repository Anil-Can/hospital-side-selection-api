const chalk = require("chalk");
const db = require('./db.js');
const getDistricts = async(req,res)=>{
    const query = "SELECT id,name FROM districts ORDER BY name;"
    console.log(chalk.green('HOSPITAL SQL :') + chalk.blueBright(query));
    let result =await db.query(query);
    res.send(result.rows);
}
const getCategories = async(req,res) => {
    const {name,tableName} = req.query
    const query = `SELECT DISTINCT ${name} FROM public.${tableName};`
    console.log(chalk.green('HOSPITAL SQL :') + chalk.blueBright(query));
    let result =await db.query(query);
    res.send(result.rows);
}
const getFeatures = async(req,res) => {
    const {tableName,where,joinAtt} = req.query;
    let resultInfo = await db.query(`SELECT attributes, geom_type
	FROM public.hospital_tables_info WHERE name = '${tableName}';`)
    let attributes = resultInfo.rows[0].attributes.split("|");
    let geom_type = resultInfo.rows[0].geom_type;
    if(where)
    {
        let json_build;
        
        let join = attributes.reduce((acuumalator,current)=>{
            acuumalator += `a.${current},`
            return acuumalator
          },"");
        join += 'a.geom,';
        if(where.includes('district_id')){
            json_build = attributes.reduce((acuumalator,current)=>{
                acuumalator += `'${current}',${current},`
                return acuumalator
            },"");
            if(geom_type !== 'Point')
            {
                json_build += "'district_id',district_id";
                join += "district_id";
            }
            else
            {
                json_build = json_build.slice(0,-1);
            }
        }
        const from = geom_type === 'Point' || !where.includes('district_id') ?  `${tableName}`:
        `(SELECT ${join} FROM ${tableName} a INNER JOIN districts_${tableName} b ON a.id = b.${joinAtt} WHERE ${where})`
        const query = `SELECT row_to_json(fc)
        FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
        FROM (SELECT 'Feature' As type
           , ST_AsGeoJSON(lg.geom)::json As geometry
           , json_build_object(${json_build}) As properties
          FROM ${from} As lg ${geom_type === 'Point' ? "WHERE " + where:""}  ) As f )  As fc;`
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
    
}
const getSpatialTables = async(req,res)=>{
    const {type} = req.query
    const query = `SELECT name,geom_type,related FROM hospital_tables_info WHERE type = '${type}';`
    console.log(chalk.green('HOSPITAL SQL :') + chalk.blueBright(query))
    let result =await db.query(query)
    res.send(result.rows)
}
const createRecords = async (req,res)=>{
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
}
module.exports = {
    getDistricts,getCategories,getFeatures,getSpatialTables,createRecords
}