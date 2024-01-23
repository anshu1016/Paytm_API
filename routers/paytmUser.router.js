const express = require("express");
const router = express.Router();
const { signup, signin, updateUser, getBulkUser } = require("../queries/paytmUser.query.js");
const { authMiddleware } = require("../middleware/auth.middleware.js");

router.post("/signup", signup);

router.post("/signin", signin);

router.put("/updateUser", authMiddleware, updateUser);

router.get("/getBulkUser", getBulkUser);

module.exports =  router ;
