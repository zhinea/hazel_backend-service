import type {Context} from 'hono';
import { UserService } from '../services/UserService';

export class UserController {
    private userService = new UserService();

    async getAllUsers(context: Context) {
        try {
            const users = await this.userService.getAllUsers();
            return context.json(users);
        } catch (error) {
            return context.json({ error: error.message }, 500);
        }
    }

    async createUser(context: Context) {
        try {
            const body = await context.req.json();
            const user = await this.userService.createUser(body);
            return context.json(user, 201);
        } catch (error) {
            return context.json({ error: error.message }, 400);
        }
    }

    async getUser(context: Context) {
        try {
            const id = context.req.param('id');
            const user = await this.userService.getUserById(id);
            return user
                ? context.json(user)
                : context.json({ error: 'User not found' }, 404);
        } catch (error) {
            return context.json({ error: error.message }, 500);
        }
    }

    async updateUser(context: Context) {
        try {
            const id = context.req.param('id');
            const body = await context.req.json();
            const user = await this.userService.updateUser(id, body);
            return user
                ? context.json(user)
                : context.json({ error: 'User not found' }, 404);
        } catch (error) {
            return context.json({ error: error.message }, 400);
        }
    }

    async deleteUser(context: Context) {
        try {
            const id = context.req.param('id');
            await this.userService.deleteUser(id);
            return context.body(null, 204);
        } catch (error) {
            return context.json({ error: error.message }, 500);
        }
    }
}