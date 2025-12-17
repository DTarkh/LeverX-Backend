const { initDb } = require("./db.js");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");


initDb();



const port = 3000;
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
