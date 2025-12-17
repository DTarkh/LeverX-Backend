const jwt = require("jsonwebtoken");
const { db } = require("../db");
const bcrypt = require("bcryptjs");

function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "you must include email and password",
    });
  }

  await db.read();
  const users = db.data.users;

  const user = users.find((user) => user.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "incorrect email or password",
    });
  }

  const token = createToken(user._id);

  res.status(200).json({ status: "success", token });
};

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "you must include email and password",
    });
  }

  await db.read();
  const users = db.data.users;

  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res
      .status(400)
      .json({ status: "fail", message: "user is already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = {
    _id: String(users.length + 1),
    email,
    user_avatar: "images/person.png",
    password: hashedPassword,
    role: "employee",
  };

  users.push(newUser);
  await db.write();

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
};

exports.users = async (req, res) => {
  await db.read();
  const users = db.data.users;
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
};

exports.patchUsers = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  await db.read();
  const user = db.data.users.find((user) => user._id === id);

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  Object.assign(user, updates);

  await db.write();
  res.status(200).json({ status: "success", data: { user } });
};

exports.authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await db.read();
    const user = db.data.users.find((user) => user._id === decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.getCurrentUser = (req, res) => {
  res.status(200).json({
    status: "success",
    user: req.user,
  });
};
