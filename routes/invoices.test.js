//tests for invoices routes

const request = require("supertest");
const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");

// start with beforeEach and afterAll, so clean out the data before each test and end the data
//base afterall tests

beforeEach(createData);

afterAll(async() =>{
    await db.end()
});

//router.get("/" ,async function(req,res,next){
//    try{
//        const results = await db.query(`SELECT * FROM invoices`);
//        return res.json({ invoices : results.rows});
//    } catch(e){
//        return next(e);
//    }
//});  //Return info on invoices: like {invoices: [{id, comp_code}, ...]}

describe("GET /" , function(){
    test("It should respond with array of invoices" , async function(){
        const response = await request(app).get("/invoices");
        expect(response.body).toEqual({
            "invoices":[
                {id:1, comp_code:"apple"},
                {id:2, comp_code:"apple"},
                {id:3, comp_code:"ibm"},
            ]
        });
    });
});

//GET /invoices/[id]
//Returns obj on given invoice.If invoice cannot be found, returns 404.
//Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}}
//router.get("/:id" , async function(req,res,next){
//    try{
//        const { id } = req.params;
//        const result = await db.query("SELECT * FROM invoices WHERE id=$1" , [id]);
//        if (result.rows.length === 0){
//            throw new ExpressError("Can't find the invoice");
//        }
//        return res.json({ invoice : result.rows});
//    }catch(e){
//        return next(e);
//    }
//});

describe("GET/1" , function(){
    test("It return invoice info" , async function(){
        const response = await request(app).get("/invoices/1");
        expect(response.body).toEqual(
            {
                "invoice" : {
                    id:1,
                    amt:100,
                    add_date: '2018-01-01T08:00:00.000Z',
                    paid: false,
                    paid_date: null,
                    company: {
                      code: 'apple',
                      name: 'Apple',
                      description: 'Maker of OSX.',
                    }
                }
            }
        );
    });

    test("It should return 404 for no-invoice" , async function(){
        const response = await request(app).get("/invoices/111");
        expect(response.status).toEqual(404);
    });
});

//POST /invoices. Adds an invoice. Needs to be passed in JSON body of: {comp_code, amt}
//Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
//router.post("/" , async function(req,res,next){
//    try{
//        const {comp_code , amt} = req.body;
//        const results = await db.query("INSERT INTO invoices(comp_code , amt) VALUES ($1,$2) RETURNING *" , [comp_code, amt]);
//        return res.status(201).json({invoices : results.rows[0]});
//    } catch(e){
//        return next(e);
//    }
//});

describe("POST /" , function(){

    test("Adding new invoice" , async function(){
        const response = await request(app)
            .post("/invoices")
            .send({amt:400, comp_code:"ibm"});

        expect(response.body).toEqual(
            {
                "invoice": {
                    id: 4,
                    comp_code: "ibm",
                    amt: 400,
                    add_date: expect.any(String),
                    paid: false,
                    paid_date: null,
                }
            }
        );
    });
});

//PUT /invoices/[id]. Updates an invoice.If invoice cannot be found, returns a 404.
//Needs to be passed in a JSON body of {amt}
//Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
//router.put("/:id" , async function(req,res,next){
//    try{
//        const id  = req.params.id;
//        const { amt, paid } = req.body;
//        let paidDate = null;
//      const result = await db.query(`UPDATE invoices SET amt=$1, paid=$2, paidDate=$3 WHERE id=$4 RETURNING id, comp_code, amt, add_date,paid_date` , [amt , paid , paidDate , id]);
//    return res.json({"invoice": result.rows[0]});       
//    } catch(e){
//        return next(e);
//    }
//});

describe("PUT /" , function(){

    test("Updating the invoice" , async function(){
        const response = await request(app)
            .put("/invoices/1")
            .send({amt:1000, paid:false});

        expect(response.body).toEqual(
            {
                "invoice": {
                    id: 1,
                    comp_code: 'apple',
                    paid: false,
                    amt: 1000,
                    add_date: expect.any(String),
                    paid_date: null,
                } 
            }
        );
    });

    test("It should return 404 for no-such-invoice", async function () {
        const response = await request(app)
            .put("/invoices/111")
            .send({amt: 1000});
    
        expect(response.status).toEqual(500);
      });
    test("It should return 500 for missing data", async function () {
        const response = await request(app)
            .put("/invoices/1")
            .send({});
    
        expect(response.status).toEqual(500);
    });
});

//DELETE /invoices/[id]. Deletes an invoice.If invoice cannot be found, returns a 404.
//Returns: {status: "deleted"}
//Also, one route from the previous part should be updated:
//router.delete("/:id", async function (req, res, next) {
//    try {
//      let id = req.params.id;
//        const result = await db.query(`DELETE FROM invoices WHERE id = $1RETURNING id` , [id]);
//      if (result.rows.length === 0) {
//        throw new ExpressError(`No such invoice: ${id}`, 404);
//      }  
//      return res.json({"status": "deleted"});
//}  
//    catch (e) {
//      return next(e);
//    }
//  });

describe("DELETE /", function () {

    test("It should delete invoice", async function () {
      const response = await request(app)
          .delete("/invoices/1");
  
      expect(response.body).toEqual({"status": "deleted"});
    });
  
    test("It should return 404 for no-such-invoices", async function () {
      const response = await request(app)
          .delete("/invoices/999");
  
      expect(response.status).toEqual(404);
    });
});
  




