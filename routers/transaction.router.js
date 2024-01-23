const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const { getBalance, transferMoney } = require("../queries/transaction.query.js");

router.get("/getBalance", authMiddleware, getBalance);

router.post("/transferMoney", authMiddleware, transferMoney);

module.exports = router ;
