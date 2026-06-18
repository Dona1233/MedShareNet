const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/test", testRoutes);
console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => res.send("MedShareNet API Running"));

app.listen(5000, () => console.log("Server running on port 5000"));
