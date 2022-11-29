const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { envs, Client } = require("stytch");


const client = new Client({
  project_id: process.env.PROJECT_ID,
  secret: process.env.SECRET,
  env: envs.test,
});

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    const result = await user.save();
    const newUser = await result.toJSON();
    // console.log(newUser.email, newUser.password);
        const email = newUser.email;
        const password = newUser.password;
    
    const userData = await client.passwords.create({
      email,
      password,
      session_duration_minutes: 60,
    });


    //   return status 201 and the user object
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      token: userData.session_token
    });
      
  } catch (error) {
      console.log(error);
    //   return status 500 and the error object
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
});

router.post("/login", async (req, res) => {
     const user = await User.findOne({ email: req.body.email });

     if (!user) {
       return res.status(404).send({
         message: "user not found",
       });
     }

     if (!(await bcrypt.compare(req.body.password, user.password))) {
       return res.status(400).send({
         message: "invalid credentials",
       });
     }

     const token = jwt.sign({ _id: user._id }, "secret");

     res.cookie("jwt", token, {
       httpOnly: true,
       maxAge: 24 * 60 * 60 * 1000, // 1 day
     });

     res.send({
       message: "success",
     });

//   res.send(token)
});

router.get("/user", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];

    const claims = jwt.verify(cookie, "secret");

    if (!claims) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    }

    const user = await User.findOne({ _id: claims._id });

    const { password, ...data } = await user.toJSON();

    res.send(data);
  } catch (e) {
    return res.status(401).send({
      message: "unauthenticated",
    });
  }
});

// router to logout
router.post("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });

  res.send({
    message: "success",
  });
});

module.exports = router;
