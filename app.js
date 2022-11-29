const express = require("express");
const morgan = require("morgan");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
const cors = require("cors");
require("./models/database");
require("dotenv").config();
const routes = require("./routes/routes");
// const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 3300;

//Middlewares
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5174",
  })
);
app.use(morgan("dev"));
app.use(express.json())
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use("/api", routes);

// start server
app.listen(port, () => {
  console.log(`server runnning at http://localhost:${port}`);
});
