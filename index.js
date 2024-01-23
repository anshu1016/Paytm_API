
require("./db/db.js");

const express = require("express");
const app = express();
const PORT = 3000;
const cors = require("cors");
const jwt = require("jsonwebtoken");


const transactionRouter = require("./routers/transaction.router.js");
const userRouter = require("./routers/paytmUser.router.js");


app.use(cors());
app.use(express.json());

// Routers
app.get("/",(req,res)=>{
  res.send("Hello World!");
})
app.get("/test",(req,res)=>{
  res.send("Router Tested Successfully!");
})
app.use("/api/v1/user", userRouter);
app.use("/api/v1/transactions", transactionRouter);

// Server listening
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


//signup - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWFmNTEyYmRkYTdkZDMyNGUzYTE1YmIiLCJpYXQiOjE3MDU5ODgzOTUsImV4cCI6MTcwNjA3NDc5NX0.-KP5G44PA2aVMescJ_ztW_jYhBorUAoR8paAopZn8hg


//signin - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWFmNTEyYmRkYTdkZDMyNGUzYTE1YmIiLCJpYXQiOjE3MDU5ODg0NjZ9.3Krtm6HyKE9_66eH4LoUuLifUCHsrQGyEElB7bpO8UE
