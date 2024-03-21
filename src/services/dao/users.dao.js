import userModel from "../models/user.model.js";
class UserDao {
    async getUserById(userId) {
        try {
        const user = await userModel.findById(userId);
        return user;
        } catch (error) {
        throw new Error(`Error fetching user by ID: ${error.message}`);
        }
    }

    async getUserByEmail(email) {
        try {
        const user = await userModel.findOne({ email });
        return user;
        } catch (error) {
        throw new Error(`Error fetching user by email: ${error.message}`);
        }
    }

    async createUser(userData) {
        try {
        const newUser = await userModel.create(userData);
        return newUser;
        } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
        }
    }
}

export default new UserDao();
