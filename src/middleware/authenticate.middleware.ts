import {getAuth} from "@hono/oidc-auth";
import type {ApiResponse} from "auth0/dist/cjs/lib/runtime";
import type {Context, Next} from "hono";
import {User} from "../entities/User.ts";
import {AppDataSource} from "../data-source.ts";
import type {UserData, UserInterface} from './../types/user';

var usersCached: Record<string, {user: UserInterface, expiredAt: Date}> = {}

const userRepository = AppDataSource.getRepository(User);

export const AuthenticateMiddleware = async (c: Context, next: Next) => {
    const auth0 = c.get('auth0')
    const auth = await getAuth(c)
    let userId = auth?.sub
    let user: ApiResponse<UserData> | null = null;

    if(userId){
        let userCached = usersCached[String(userId)]
        if(userCached){
            if(userCached.expiredAt > new Date()){
                user = userCached.user
            }
        }

        if(!user){
            user = await auth0.users.get({ id: String(userId)})

            let userProperties = await userRepository.findOne({
                where: {
                    id: String(userId)
                }
            });

            if(!userProperties){
                userProperties = userRepository.create({
                    id: String(userId)
                })
            }

            user = <UserInterface>Object.assign({}, <UserData>user.data, {
                properties: userProperties
            })

            usersCached[String(userId)] = {
                expiredAt: new Date(Date.now() + (1000 * 60 * 60 * 24)),
                user
            }
        }
    }

    c.set('user', user)
    await next()
}