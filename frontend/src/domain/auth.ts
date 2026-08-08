import type { UserSchema } from "@/schemas/user-schemas"

type LoginResponse = {
    anonymous: boolean,
    user: UserSchema
}
