const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server connected on PORT ${PORT}`));

mongoose.connect(
  process.env.MONGOOSE_CONNECTION_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      return console.error(err);
    }
    console.log('MONGODB CONNECTION ESTABILSHED');
  }
);

app.use('/users', require('./routes/user'));
