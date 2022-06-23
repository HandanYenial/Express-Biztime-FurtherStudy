//pg establishes a connection to a database.
//to install npm install pg
//To use pg
//1. Require pg
//2. Tell pg which database to use and how to conncet it
//3. Query our database and get some data back.

//Step1: require pg.We can also write it as:
//const { Client } = require("pg");
//let DB_URI;
//Step 2: Setting up 2 different databases that we will possibly use:
// one for testing and one for our main application

//if (process.env.NODE_ENV === "test") {
//  DB_URI = "postgresql://postgres:myPassword@localhost:5432/biztime_test"; //database for the testing
//} else {
//  DB_URI = "postgresql://postgres:myPassword@localhost:5432/biztime";//database for main application
//}
//Step 3: pass it in!
//let db = new Client({
//  connectionString: DB_URI
//});
//Step 4: start the connection
//db.connect();
// Step5: To import this database from some other file let's add module.exports
//module.exports = db;

const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql://postgres:myPassword@localhost:5432/biztime"
});

client.connect();


module.exports = client;