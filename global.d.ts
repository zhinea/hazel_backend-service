import type {ManagementClient} from "auth0";
import type {UserInterface} from "./src/types/user.ts";

declare module 'hono' {
    interface ContextVariableMap {
        user: UserInterface
        auth0: ManagementClient;
    }
}