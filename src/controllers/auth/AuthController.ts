// src/controllers/auth/AuthController.ts
import type {Context} from "hono";
import {processOAuthCallback, revokeSession} from "@hono/oidc-auth";

export class AuthController {
    async callback(c: Context){
        return processOAuthCallback(c)
    }

    async logout(c: Context){
        await revokeSession(c)
        return c.redirect('/')
    }

    async me(c: Context){
        const user = c.get('user')

        if(!user){
            return c.json({
                error: 'Not logged in'
            })
        }

        return c.json({
            id: user.user_id,
            email: user.email,
            name: user.name,
            nickname: user.nickname,
            avatar: user.picture,
            last_login: user.last_login,
            created_at: user.created_at,
        })
    }
}