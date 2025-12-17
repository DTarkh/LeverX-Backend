const { initDb } = require("./db.js");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");


initDb();



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
