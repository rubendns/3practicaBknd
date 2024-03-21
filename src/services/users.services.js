import userModel from "../services/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PRIVATE_KEY } from "../utils.js";
class UserService {
    async registerUser(userData) {
        try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await userModel.create({
            email: userData.email,
            password: hashedPassword,

        });
        return newUser;
        } catch (error) {
        throw new Error("Error registering user: " + error.message);
        }
    }

    async authenticateUser(email, password) {
        try {
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const token = jwt.sign({ userId: user._id }, PRIVATE_KEY);
        return token;
        } catch (error) {
        throw new Error("Authentication failed: " + error.message);
        }
    }

    async getUserById(userId) {
        try {
        const user = await userModel.findById(userId);
        return user;
        } catch (error) {
        throw new Error("Error getting user by ID: " + error.message);
        }
    }

    async getUserByEmail(email) {
        try {
        const user = await userModel.findOne({ email });
        return user;
        } catch (error) {
        throw new Error("Error getting user by email: " + error.message);
        }
    }

    async updateUser(userId, userData) {
        try {
        const updatedUser = await userModel.findByIdAndUpdate(userId, userData, {
            new: true,
        });
        return updatedUser;
        } catch (error) {
        throw new Error("Error updating user: " + error.message);
        }
    }

    async deleteUser(userId) {
        try {
        const deletedUser = await userModel.findByIdAndDelete(userId);
        return deletedUser;
        } catch (error) {
        throw new Error("Error deleting user: " + error.message);
        }
    }
}

export default new UserService();
