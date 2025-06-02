const User = require("../models/User");
const jwt = require("jsonwebtoken");
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || user.password !== password)
    return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: user._id }, "secretkey");
  res.json({ token });
};
