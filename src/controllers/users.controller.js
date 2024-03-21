import userService from "../services/users.services.js";

class UserController {
    async register(req, res) {
        try {
        const userData = req.body;
        const newUser = await userService.registerUser(userData);
        res
            .status(201)
            .json({ message: "User registered successfully", user: newUser });
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
        const { email, password } = req.body;
        const token = await userService.authenticateUser(email, password);
        res.status(200).json({ token });
        } catch (error) {
        res.status(401).json({ error: error.message });
        }
    }

    async getUserById(req, res) {
        try {
        const userId = req.params.userId;
        const user = await userService.getUserById(userId);
        if (!user) {
            res.status(404).json({ message: `User not found with ID: ${userId}` });
        } else {
            res.status(200).json({ user });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    }

    async getUserByEmail(req, res) {
        try {
        const email = req.params.email;
        const user = await userService.getUserByEmail(email);
        if (!user) {
            res
            .status(404)
            .json({ message: `User not found with email: ${email}` });
        } else {
            res.status(200).json({ user });
        }
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    }
}

export default new UserController();
