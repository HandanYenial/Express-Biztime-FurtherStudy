
const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");


//adding an industry
router.post("/" , async function(req,res,next){
    try{
        const { industry_code , industry } = req.body;
        const results = await db.query("INSERT INTO industries(industry_code , industry) VALUES ($1,$2) RETURNING *" , [industry_code, industry]);
        return res.status(201).json({industries : results.rows[0]});
    } catch(e){
        return next(e);
    }
});

//listing all industries, which should show the company code(s) for that industry



//associating an industry to a company