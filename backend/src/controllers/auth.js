import User from "../model/user.js";

import bcrypt from 'bcryptjs';

import { generateToken } from "../utils/generateToken.js";

const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json({
                succses: false,
                message: "somthing is missing in required field"
            })
        }
        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(409).json({
                succses: false,
                message: "email already exist"
            });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({
                succses: false,
                message: "email already exist"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const createdUser = await User.create({
            name,
            username,
            email,
            password: hashPassword
        });

        const token = generateToken(createdUser._id, createdUser.email);

        if (!token) {
            return res.status(500).json({
                succses: false,
                message: "server can not prosses this req right now"
            });
        }

        return res.status(201).json({

            email: createdUser.email,
            username: createdUser.username,
            token: token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            succses: false,
            message: error.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { username = null, email = null, password } = req.body;
        if (!username && !email) {
            return res.status(400).json({
                succses: false,
                message: "provide email or username"
            });
        }
        if (!password) {
            return res.status(400).json({
                succses: false,
                message: "provide password"
            });
        }
        let isemail = email !== null ? true : false;
        let isusername = username !== null ? true : false;

        let user;

        if (isemail) {
            user = await User.findOne({ email });
        }
        else if (isusername) {
            user = await User.findOne({ username });
        }
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const ismatch = await bcrypt.compare(password, user.password);

        if (!ismatch) {
            return res.status(400).json({
                succses: false,
                message: "password did not match"
            });
        }

        const token = generateToken(user._id, user.email);

        if (!token) {
            return res.status(500).json({
                succses: false,
                message: "server can not prosses this req right now"
            });
        }

        return res.status(201).json({

            email: user.email,
            username: user.username,
            token: token
        })



    } catch (error) {
        console.log(error);
        res.status(500).json({
            succses: false,
            message: error.message
        })
    }
}

export { registerUser, loginUser };