import express from "express";
import bcrypt from "bcrypt";
import { sequelize } from "../db/db.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Room } from "../models/Room.js";
import { signJWT as signJwt } from "../utils/signJwt.js";
const router = express.Router();
const saltRounds = 10;

// Signin Or Signup
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    // Check Password and login if there is a user
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.hashPassword);
      if (!passwordMatch)
        return res.status(403).json({ msg: `Wrong password!` });

      signJwt(user, res);
      return res.status(200).json(user);
    }
    //

    // Create New User
    const hashPassword = await bcrypt.hash(password, saltRounds);
    let newUser = await User.create({ username, hashPassword });
    signJwt(newUser, res);
    return res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
  }
});

// Create new room
router.post("/newroom", async (req, res) => {
  try {
    const { name } = req.body;
    const { username } = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
    let findRoom = await Room.findOne({ where: { name } });
    let findUser = await User.findOne({ where: { username } });

    // if there is a room with same name return taken
    if (findRoom)
      return res
        .status(409)
        .json({ msg: `There is already a room called ${name}` });

    // Create new room
    const newRoom = await Room.create({ name });

    // Join room
    findUser.addRoom(newRoom);

    return res.status(201).json(newRoom);
  } catch (err) {
    console.log(err);
  }
});

// Join room
router.post("/joinroom", async (req, res) => {
  try {
    const { name } = req.body;
    const { username } = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
    let findRoom = await Room.findOne({ where: { name } });
    let findUser = await User.findOne({ where: { username } });

    // If there is no room with that name return msg
    if (!findRoom)
      return res.status(404).json({
        msg: `The room you want to join doesn't exist`,
      });

    // Join room
    findUser.addRoom(findRoom);
    return res.status(200).json(sequelize.models.user_room);
  } catch (err) {
    console.log(err);
  }
});

// Find rooms you joined
router.get("/rooms", async (req, res) => {
  try {
    const { username } = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
    let findUser = await User.findOne({ where: { username } });

    let allRooms = await sequelize.models.user_room.findAll({
      where: { userId: findUser.userId },
    });
    let roomNames = [];

    for (let room of allRooms) {
      let res = await Room.findOne({ where: { roomId: room.roomId } });
      roomNames.push(res.name);
    }

    return res.status(201).json(roomNames);
  } catch (err) {
    console.log(err);
  }
});

// Get username
router.get("/username", async (req, res) => {
  try {
    const { username } = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
    return res.status(200).json(username);
  } catch (err) {
    console.log(err);
  }
});

// Get all rooms
router.get("/allrooms", async (req, res) => {
  const allRooms = await Room.findAll();
  let roomNames = [];
  for (let room of allRooms) {
    roomNames.push(room.name);
  }
  res.status(200).json(roomNames);
});

// Signout
router.get("/signout", async (req, res) => {
  try {
    res.clearCookie("token");
    return res.redirect("http://localhost:3000/frontend/html/index.html");
  } catch (error) {
    res.json({ msg: error });
  }
});

export { router };
