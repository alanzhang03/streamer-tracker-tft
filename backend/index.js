const express = require("express");
const PORT = 3001;
const app = express();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions)); // Use this after the variable declaration


app.get("/", (req, res) => {
  res.send("Hello from server");
})
// app.get("/picks", async (req, res) => {
//   const postgres = require("postgres");
//   require("dotenv").config();

//   let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

//   const sql = postgres({
//     host: PGHOST,
//     database: PGDATABASE,
//     username: PGUSER,
//     password: PGPASSWORD,
//     port: 5432,
//     ssl: "require",
//     connection: {
//       options: `project=${ENDPOINT_ID}`,
//     },
//   });

//   var r = await sql`SELECT * FROM picks`;
//   res.send(r);
// });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});