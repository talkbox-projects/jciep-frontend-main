import { useCallback } from "react";
import { useAppContext } from "../store/AppStore";
import { setCookie, parseCookies } from "nookies";
import UserLogout from "./api/UserLogout";

export const useCredential = () => {
  const { setUser, setIdentityId } = useAppContext();

  const setCredential = useCallback((user) => {
    const defaultIdentityId = parseCookies()?.["jciep-identityId"] ?? null;
    const firstIdentityId = user?.identities?.[0]?.id;
    const defaultIdentity = user?.identities.find(
      ({ id }) => id === defaultIdentityId
    );
    if (!defaultIdentity) {
      setCookie(null, "jciep-identityId", firstIdentityId, { path: "/" });
    }
    setUser(user);
    setIdentityId(defaultIdentity?.id ?? firstIdentityId ?? null);
  }, [setIdentityId, setUser]);

  const removeCredential = useCallback(async () => {
    setIdentityId(null);
    setUser(null);
    await UserLogout();
  }, [setIdentityId, setUser]);

  return [setCredential, removeCredential];
};
