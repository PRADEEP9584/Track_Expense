import User from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
const TOKEN_EXPIRES = '24h';

const createToken = (userId) => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

// Register a user
export async function registerUser(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email address."
        });
    }
    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long."
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email."
            });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed });
        const token = createToken(user._id);
        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error during registration."
        });
    }
}

// Login user
export async function loginUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Both email and password are required."
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = createToken(user._id);
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error during login."
        });
    }
}

// Get logged-in user details
export async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user._id || req.user.id).select("name email");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        res.json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error fetching user profile."
        });
    }
}

// Update user profile (name, email)
export async function updateProfile(req, res) {
    const { name, email } = req.body;
    if (!name || !email || !validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Valid name and email are required."
        });
    }
    try {
        const userId = req.user._id || req.user.id;
        const exists = await User.findOne({ email, _id: { $ne: userId } });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Email is already in use by another account."
            });
        }
        const user = await User.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true, runValidators: true, select: "name email" }
        );
        res.json({
            success: true,
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error updating profile."
        });
    }
}

// Change user password
export async function updatePassword(req, res) {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long."
        });
    }

    try {
        const userId = req.user._id || req.user.id;
        const user = await User.findById(userId).select("password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Current Password is incorrect."
            });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error changing password."
        });
    }
}