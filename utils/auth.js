/**
 * 
 * This file implements the user permission helpers and graphql-related authentication logic
 * 
 */

import nookies from "nookies";
import getConfig from "next/config";
import jwt from "jsonwebtoken";
import { User } from "../pages/api/graphql/user.model";
import { Organization } from "../pages/api/graphql/organization.model";


const { serverRuntimeConfig } = getConfig();

export const getIdentityOrganizationRole = async (identityId) => {

    if (!identityId) return [];

    const organizations = await Organization.find({
        member: { $elemMatch: { identityId } },
    });

    const organizationRole = (organizations ?? []).map(
        (organization) => {
            const member = organization.member.find(
                ({ identityId: _identityId }) => String(_identityId) === String(identityId)
            );
            return {
                organization,
                status: member.status,
                role: member.role,
            };

        }
    );
    return organizationRole;
}

export const getCurrentUser = async (context) => {

    try {
        const token = nookies.get(context)?.["jciep-token"];
        const currentIdentityId = nookies.get(context)?.["jciep-identityId"];


        if (token) {
            const jwtUser = jwt.decode(token, serverRuntimeConfig.JWT_SALT);
            if (jwtUser) {
                const user = await User.findById(jwtUser._id).populate("identities");
                const identity = (user?.identities ?? []).find(({ id }) => String(id) === String(currentIdentityId));
                identity.organizationRole = await getIdentityOrganizationRole(currentIdentityId);
                return { user, identity };
            }
        }
        return null;
    } catch (error) {
        // console.log("getCurrentUser", error);
        return null;
    }
}

export const checkIfAdmin = (identity = null) => {
    return identity?.type === "admin";
}


export const isJoinedOrganizationStaff = (identity, organizationId) =>
    identity.organizationRole.find(
        ({ organization: { _id }, role, status }) => {
            return String(_id) === String(organizationId) &&
                role === "staff" &&
                status === "joined";

        });



export const canViewIdentity = (currentIdentity, identity) =>
    currentIdentity.organizationRole[0].organization.id === identity;


export const isIdentityUnderUser = (identityId, user) => {
    return !!(user?.identities ?? []).find(({ id }) => id === identityId);
}