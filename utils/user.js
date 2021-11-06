import { useCallback } from "react";
import { useAppContext } from "../store/AppStore";
import { setCookie, destroyCookie, parseCookies } from "nookies";

export const useCredential = () => {
  const { setUser, setIdentityId } = useAppContext();

  const setCredential = useCallback(({ token, user }) => {
    setCookie(null, "jciep-token", token, { path: "/" });

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

  const removeCredential = useCallback(() => {
    destroyCookie(null, "jciep-token", { path: "/" });
    setIdentityId(null);
    setUser(null);
  }, [setIdentityId, setUser]);

  return [setCredential, removeCredential];
};
