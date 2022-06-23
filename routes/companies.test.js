const request = require("supertest");

const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");

//run before each test to clear the data
beforeEach(createData); //which we imported from test-common.js

//runs after all tests in this file completed to end up with the database
//Here afterAll ensures that db.end() is called after all tests run.

afterAll(async() => {
    await db.end(); //with db.end() we'll close the connection

});
// for get route to get all company names and information
describe("GET /" , function(){
    test("It should respond with an array of companies" , async function(){
        const response = await request(app).get("/compnaies");
        expect(response.body).toEqual({
            "companies" : [
                {code: "apple" , name:"Apple"},
                {code: "ibm" , name:"IBM"}
            ]
        });
    });
});
// for get request to get a company name and info with given name(code).
describe("GET /apple" , function(){
    test("It returns company information." , async function(){
        const response = await request(app).get("/companies/apple");
        expect(response.body).toEqual(
            {
                "company" :{
                    code: "apple",
                    name: "Apple",
                    description: "Maker of OSX.",
                    invoices: [1,2]
                }
            }
        );
    });
    //if there is no company with that code than gives a 404
    test("It should return 404 for no-such-company" , async function(){
        const response = await request(app).get("/companies/anycompany");
        expect(response.status).toEqual(404);
    });
});

//for post request to add a new company code, name, description
describe("POST /" ,function(){

    test("It should add company " , async function(){
        const response =await request(app)
        .post("/companies")
        .send({name:"Microsoft" , description:"adding new company"});

        expect(response.body).toEqual(
        {
            "company": {
                code:"microsoft",
                name:"Microsoft",
                description:"adding new company"
            }
        }
    );
    });
    //if there is another company with that code
    test("It should return 500 for conflict" , async function (){
        const response = await request(app)
              .post("/companies")
              .send({name:"Apple" , description:"Company policy"});

            expect(response.status).toEqual(500);
    });
});

//for put request to update a company
describe("PUT /" , function(){

    test("It should update company" , async function(){
        const response = await request(app)
              .put("companies/apple")
              .send({name:"AppleEdit", description:"Updated Description"});

        expect(response.body).toEqual(
            {
                "company" : {
                    code: "Apple",
                    name: "AppleEdit",
                    description:"Updated Description"
                }
            }
        );
    });
    //gives a 500 for missing data while updating the company
    test("It should return 500 for missing data" , async function(){
        const response = await request(app)
              .put("/companies/apple")
              .send({});

        expect(response.status).toEqual(500);
    });
});


//for deleting the company
describe("DELETE /" , function(){
    test("It should delete the company" , async function(){
        const response = await request(app)
             .delete("/companies/apple");

        expect(response.body).toEqual({"msg" : "DELETED"});
    });
    // if there isn't a compnay with the given code
    test("It should return 404 for no company in that name" , async function(){
        const response = await request(app)
            .delete("/comapnies/nocompany");

        expect(response.status).toEqual(404);
    });
});