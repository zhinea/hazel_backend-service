// src/controllers/auth/AuthController.ts
import type {Context} from "hono";
import {processOAuthCallback, revokeSession} from "@hono/oidc-auth";
import {deleteCookie} from "hono/cookie";

export class AuthController {
    async callback(c: Context){
        return processOAuthCallback(c)
    }

    async logout(c: Context){
        await revokeSession(c)
        deleteCookie(c, 'oidc-auth')
        return c.redirect('/good-bye')
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
            last_login: user?.last_login,
            created_at: user?.created_at,
        })
    }
}