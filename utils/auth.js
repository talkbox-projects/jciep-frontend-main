/**
 * 
 * This file implements the user permission helpers and graphql-related authentication logic
 * 
 */

import nookies from "nookies";
import getConfig from "next/config";
import jwt from "jsonwebtoken";
import { User } from "../pages/api/graphql/user.model";


const { serverRuntimeConfig } = getConfig();

export const getCurrentUser = async (context) => {

    try {
        const token = nookies.get(context)?.["jciep-token"];
        const currentIdentityId = nookies.get(context)?.["jciep-identityId"];

        if (token) {
            const jwtUser = jwt.decode(token, serverRuntimeConfig.JWT_SALT);
            if (jwtUser) {
                const user = await User.findById(jwtUser._id).populate("identities");
                const identity = (user?.identities ?? []).find(({ id }) => id === currentIdentityId);
                return { user, identity };
            }
        }
        return null;
    } catch (error) {
        console.log("getCurrentUser", error);
        return null;
    }
}
