const router = require('express').Router();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

// resgiter post

router.post('/register', async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;

    if (!email || !password || !passwordCheck) {
      return res.status(400).json({ msg: 'Not all fields have been entered' });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: 'Password must be atleast 5 characters long' });
    }

    if (password != passwordCheck) {
      return res.status(400).json({ msg: "Password doesn't match" });
    }

    const existingUser = User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: 'User with this email already exists' });
    }

    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email,
      password: hashPassword,
      displayName: displayName,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: 'Not all fields are filled' });
    }

    const checkUser = await User.find({ email: email });

    if (!checkUser) {
      return res.status(400).json({ msg: "This user doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, checkUser.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: checkUser._id }, process.env.SECRET);

    res.json({
      toke,
      user: {
        id: checkUser._id,
        displayName: checkUser.displayName,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// delete

module.exports = router;
