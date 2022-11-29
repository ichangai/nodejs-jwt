const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.DB_URI;
// database connection
mongoose
  .connect(url, {
    useNewUrlParser: true,
  })
  .then(() => console.log("connected to the database"))
  .catch((err) => console.log(err));
