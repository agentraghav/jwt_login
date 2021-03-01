const router = require('express').Router();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const auth = require('../middleware/auth');
const notAuth = require('../middleware/notAuth');
// resgiter post

router.post('/register', async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;

    if (!email || !password || !passwordCheck) {
      res.status(400).json({ msg: 'Not all fields have been entered' });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: 'Password must be atleast 5 characters long' });
    }

    if (password != passwordCheck) {
      return res.status(400).json({ msg: "Password doesn't match" });
    }

    const existingUser = await User.findOne({ email: email });
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

    const checkUser = await User.findOne({ email: email });

    if (!checkUser) {
      return res.status(400).json({ msg: "This user doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, checkUser.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: checkUser._id }, process.env.SECRET);

    res.json({
      token,
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

router.delete('/delete', auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// token validity

router.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.json(false);
    }

    const verified = jwt.verify(token, process.env.SECRET);

    if (!verified) {
      return res.json(false);
    }

    const user = await User.findById(verified.id);

    if (!user) {
      return res.json(false);
    }

    return res.json(true);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  const user = User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
  });
});

module.exports = router;
