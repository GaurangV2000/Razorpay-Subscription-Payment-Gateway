const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const paymentRoutes = require("./routes/payment") 

const app = express();

dotenv.config();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use("/onboard/payment/" , paymentRoutes) ;

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`))