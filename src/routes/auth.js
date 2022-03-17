const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { Student, Instructor } = require("../models/user");

const router = express.Router();

router.use(cors({
    credentials: true,
    origin: "http://localhost:8081"
}));

router.post("/signup", async (req, res) => {
    const { name, email, password, type } = req.body;
    const passHash = bcrypt.hashSync(password, 12);

    const SelectedType = type === "student" ? Student : Instructor;

    const user = await SelectedType.findOne({ email: email });

    if (user) {
        return res.status(400).send({ error: "User already exists" });
    }

    await SelectedType.create({ name, email, passHash });

    res.send({ message: "User created", redirect: "/" });
});

router.post("/login", async (req, res) => {
    const { email, password, type } = req.body;

    const SelectedType = type === "student" ? Student : Instructor;

    const user = await SelectedType.findOne({ email: email });

    if (!user) {
        return res.status(400).send({ error: "User not found" });
    }

    const passMatch = bcrypt.compareSync(password, user.passHash);

    if (!passMatch) {
        return res.json({ error: "Password incorrect" });
    }

    const token = jwt.sign({ id: user._id, role: type === "student" ? "student" : "instructor" }, process.env.SECRET, {
        expiresIn: "1h"
    });

    res.cookie("token", token).send({ message: "Logged in", redirect: "/" });
});

module.exports = router;