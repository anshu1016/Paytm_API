const {PaytmUser,Account} = require("../model/user.model.js");

const jwt = require("jsonwebtoken");
const zod = require("zod");
const bcrypt = require("bcrypt");
const JWT_SECRET = "SHUKLA HI SECRET HAI"
const {authMiddleware} = require("../middleware/auth.middleware.js");
const validateSchema = zod.object({
  username: zod.string().email().max(30),
  password: zod.string().min(6),
  firstName: zod.string().max(50).trim(true),
  lastName: zod.string().max(50).trim(true),
});

const signup = async (req, res) => {
  try {
    const { username, firstName, lastName, password } = req.body;
    const { success } = validateSchema.safeParse(req.body);

    if (!success) {
      return res.status(411).json({ message: "Enter all Details Correctly" });
    }

    if (username && firstName && lastName && password) {
      const isUsernameExisted = await PaytmUser.findOne({ username: username });

      if (isUsernameExisted) {
        return res.status(400).json({
          message: "UserName already Exists, Try With Another One",
          status: false,
        });
      }

      const user = await PaytmUser.create({
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });

      const userId = user._id;

      await Account.create({
          userId,
          balance: 1 + Math.random() * 10000
      })

      
      const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });

      return res.json({
        message: "User created successfully",
        token: token,
      });
    }
  } catch (err) {
    console.log("Error in signup", err);
    res.status(500).json({ message: "Error in SignUp", error: err });
  }
};

const signinValidation = zod.object({
  username:zod.string().email(),
  password:zod.string().min(6)
})


const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { success } = signinValidation.safeParse(req.body);

    if (!success) {
      return res.status(401).json({ message: "Enter email and password at least 6 characters", status: false });
    }

    const user = await PaytmUser.findOne({
      username: username
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password", status: false });
    }

    // Compare the entered password with the stored password (without bcrypt)
    if (password === user.password) {
      const token = jwt.sign({
        userId: user._id,
      }, JWT_SECRET);

      return res.status(201).json({ message: "SignedIn Successfully", token: token });
    } else {
      return res.status(401).json({ message: "Invalid username or password", status: false });
    }
  } catch (err) {
    console.error("Error in signin", err);
    return res.status(500).json({ message: "Error in Signin", error: err });
  }
};

const updateBodyValidation = zod.object({
  firstName: zod.string().max(50).trim(true),
  lastName: zod.string().max(50).trim(true),
  password: zod.string().min(6),
});

const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    const { success } = updateBodyValidation.safeParse(req.body);

    if (!success) {
      return res.status(400).json({ message: "Enter all details correctly", status: false });
    }

    // Use user ID (_id) as the filter for update
    await PaytmUser.updateOne({ _id: req.userId }, {
      $set: {
        firstName: firstName,
        lastName: lastName,
        password: password, // Note: This updates the password directly, consider hashing it if needed
      }
    });

    res.json({
      message: "Updated successfully"
    });
  } catch (err) {
    console.error("Error in updating", err);
    return res.status(500).json({ message: "Error in updating", error: err });
  }
};

const getBulkUser = async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const users = await PaytmUser.find({
      $or: [
        {
          firstName: {
            "$regex": filter,
            "$options": "i" // Case-insensitive search
          }
        },
        {
          lastName: {
            "$regex": filter,
            "$options": "i"
          }
        }
      ]
    });

    res.json({
      users: users.map(user => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id
      }))
    });
  } catch (err) {
    console.error("Error in getBulkUser", err);
    res.status(500).json({ message: "Error in fetching bulk users", error: err });
  }
};



module.exports = {
  signup,
  signin,
  updateUser,
  getBulkUser};