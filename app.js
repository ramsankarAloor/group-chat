const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./util/database");

const app = express();
app.use(cors());
app.use(express.json());
const loginSignupRoutes = require("./routes/login-signup")

app.checkout('/', (req, res)=>{
    console.log('checkout')
})

app.use(loginSignupRoutes);

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, `public/${req.url}`));
});

app.use((req, res)=>{
    res.status(404).send('404 - Not Found')
})

sequelize
  .sync()
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));
