import {getAuth} from "@hono/oidc-auth";
import type {ApiResponse} from "auth0/dist/cjs/lib/runtime";
import type {GetUsers200ResponseOneOfInner} from "auth0/dist/cjs/management/__generated/models";
import type {Context, Next} from "hono";

var usersCached: Record<string, {data: GetUsers200ResponseOneOfInner, expiredAt: Date}> = {}

export const AuthenticateMiddleware = async (c: Context, next: Next) => {
    const auth0 = c.get('auth0')
    const auth = await getAuth(c)
    let userId = auth?.sub
    let user: ApiResponse<GetUsers200ResponseOneOfInner> | null = null;

    if(userId){
        let userCached = usersCached[String(userId)]
        if(userCached){
            if(userCached.expiredAt > new Date()){
                user = userCached.data
            }
        }

        if(!user){
            user = await auth0.users.get({ id: String(userId)})
            user = user?.data as GetUsers200ResponseOneOfInner

            usersCached[String(userId)] = {
                expiredAt: new Date(Date.now() + (1000 * 60 * 60 * 24)),
                data: user
            }
        }
    }

    c.set('user', user)
    await next()
}