//Routes for companies 

const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");
const { default: slugify } = require("slugify");


//GET/companies
//Returns list of companies, like {companies: [{code, name}, ...]}

router.get("/" , async(req,res,next) => {
    try{
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({ companies: results.rows});
    }catch(e){
        next(e);
    }
});
//GET /companies/[code]
//Return obj of company: {company: {code, name, description}}
//If the company given cannot be found, this should return a 404 status response.
//Change this route:
//when viewing details for a company, you can see the names of the industries for that company

router.get("/:code" , async(req,res,next) => {
    try{
        const { code } = req.params;
        const results = await db.query(`SELECT industries.id , industries.industry_code, industries.industry, industries.company_code
                                        FROM industries 
                                        JOIN companies 
                                        ON industries.company_code = companies.code 
                                        WHERE companies.code = $1` , [code]);
        if(results.rows.length === 0){
            throw new ExpressError("Company not found", 404);
        }
        const{ id , name } = results.rows[0];
        ///////didn't get this part
        const industries = results.rows.map(industry => industry.name);
        return res.send({ id, code, name , industries});
        ////////
    }catch(e){
        return next(e);
    }
});

//POST /companies
//Adds a company.
//Needs to be given JSON like: {code, name, description}
//Returns obj of new company: {company: {code, name, description}}
//It might be difficult for customers to make up a customer code themselves when making new companies 
//(preferably, they should have no spaces or weird punctuation, and should be all lower-case).
//Fortunately, there’s an NPM library that can help out, slugify. Read about this, and then change 
//the POST /companies route so that they don’t provide a code directly, but you make this by using slugify() 
//on the given name.

router.post("/" , async(req,res,next) => {
    try{
        let {name, description} = req.body;
        let code =slugify(name, {lower: true});

        const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name , description]);
        return res.status(201).json({ "company": result.rows[0]});
    }catch(e){
        next(e);
    }
});

//PUT /companies/[code]
//Edit existing company.
//Should return 404 if company cannot be found.
//Needs to be given JSON like: {name, description}
//Returns update company object: {company: {code, name, description}}

router.put("/:code" , async(req,res,next) =>{
    try{
       let {name , description } = req.body;
       let code  = req.params.code;
       const result = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code,name,description' , [name,description,code]);
     
       if (result.rows.length === 0){
        throw new ExpressError(`Can't update the company with code of ${code}` , 404 )
       }else{
       return res.json({ "company ": result.rows[0]});
    } }
    catch(e) {
      return next(e);
    }
  });
 
  
//DELETE /companies/[code]
//Deletes company.Should return 404 if company cannot be found.
//Returns {status: "deleted"}

router.delete("/:code" , async(req,res,next) =>{
    try{
        const { code } = req.params;
        const result = db.query("DELETE FROM companies WHERE code=$1" , [ code ]);
        return res.send({msg: "DELETED"});
    } catch(e){
        return next(e);
    }
  });

module.exports = router;