const bcrypt = require("bcrypt");
const User = require("../models/User");
const { createAccessToken } = require("../auth");

module.exports.register = async (req, res) => {
	try {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) return res.status(400).json({ message: "Email already exists" });

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await User.create({ email, password: hashedPassword });

		res.status(201).json({ message: "User registered successfully" });
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

module.exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ message: "Invalid credentials" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

		const token = createAccessToken(user);
		res.status(200).json({ token });
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};

module.exports.getUserDetails = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		if (!user) return res.status(404).json({ message: "User not found" });

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
};
