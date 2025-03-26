import type {GetUsers200ResponseOneOfInner} from "auth0/dist/cjs/management/__generated/models";
import type {ManagementClient} from "auth0";

declare module 'hono' {
    interface ContextVariableMap {
        user: GetUsers200ResponseOneOfInner|null;
        auth0: ManagementClient;
    }
}