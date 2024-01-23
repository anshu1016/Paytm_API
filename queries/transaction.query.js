const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware/auth.middleware.js");
const {PaytmUser,Account} = require("../model/user.model.js");

const getBalance = async (req, res) => {
  try {
    const account = await Account.findOne({
      userId: req.userId,
    });

    if (!account) {
      return res
        .status(404)
        .json({ message: "Account not found", status: false });
    }

    res.json({
      balance: account.balance,
    });
  } catch (err) {
    console.error("Error in getBalance", err);
    res.status(500).json({ message: "Error in fetching balance", error: err });
  }
};
const transferMoney = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(
      session,
    );

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
        status: false,
      });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid account",
        status: false,
      });
    }

    // Perform the transfer
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } },
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } },
    ).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.json({
      message: "Transfer successful",
      status: true,
    });
  } catch (err) {
    console.error("Error in transferMoney", err);
    await session.abortTransaction();
    res.status(500).json({
      message: "Error in money transfer",
      error: err,
      status: false,
    });
  } finally {
    session.endSession();
  }
};

module.exports = { getBalance, transferMoney };
