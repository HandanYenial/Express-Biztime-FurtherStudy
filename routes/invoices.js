const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

//Add routes/invoices.js. All routes in this file should be prefixed by /invoices.
//GET /invoices
//Return info on invoices: like {invoices: [{id, comp_code}, ...]}

router.get("/" ,async function(req,res,next){
    try{
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({ invoices : results.rows});
    } catch(e){
        return next(e);
    }
});

//GET /invoices/[id]
//Returns obj on given invoice.If invoice cannot be found, returns 404.
//Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}}

router.get("/:id" , async function(req,res,next){
    try{
        const { id } = req.params;
        const result = await db.query("SELECT * FROM invoices WHERE id=$1" , [id]);
        if (result.rows.length === 0){
            throw new ExpressError("Can't find the invoice");
        }
        return res.json({ invoice : result.rows});
    }catch(e){
        return next(e);
    }
});

//POST /invoices. Adds an invoice. Needs to be passed in JSON body of: {comp_code, amt}
//Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}

router.post("/" , async function(req,res,next){
    try{
        const {comp_code , amt} = req.body;
        const results = await db.query("INSERT INTO invoices(comp_code , amt) VALUES ($1,$2) RETURNING *" , [comp_code, amt]);
        return res.status(201).json({invoices : results.rows[0]});
    } catch(e){
        return next(e);
    }
});

//PUT /invoices/[id]. Updates an invoice.If invoice cannot be found, returns a 404.
//Needs to be passed in a JSON body of {amt}
//Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}

router.put("/:id" , async function(req,res,next){
    try{
        let id  = req.params.id;
        let { amt, paid } = req.body;
        let paidDate = null;

        const currResult = await db.query(`SELECT paid FROM invoices WHERE id=$1` , [id]);
        if(currentResult.rows.length === 0){
            throw new ExpressError(`Can't find the invoice:${id}` , 404);
        }
        const currPaid = currResult.rows[0].paid_date;

        if(!currpaidDate && paid){
            paidDate = new Date();
        } else if(!paid){
            paidDate = null;
        } else {
            paidDate = currPaidDate;
        }

        const results = await db.query(`UPDATE invoices SET amt=$1, paid=$2, paid_date=$3 WHERE id=$4 RETURNING id,comp_code,amt,paid,add_date,paid_date` , [amt, paid, paidDate, id]);

        return res.json({"invoice": result.rows[0]});
       
    } catch(e){
        return next(e);
    }

});

//DELETE /invoices/[id]. Deletes an invoice.If invoice cannot be found, returns a 404.
//Returns: {status: "deleted"}
//Also, one route from the previous part should be updated:

router.delete("/:id", async function (req, res, next) {
    try {
      let id = req.params.id;
  
      const result = await db.query(`DELETE FROM invoices WHERE id = $1RETURNING id` , [id]);
  
      if (result.rows.length === 0) {
        throw new ExpressError(`No such invoice: ${id}`, 404);
      }
  
      return res.json({"status": "deleted"});
    }
  
    catch (e) {
      return next(e);
    }
  });


module.exports = router;