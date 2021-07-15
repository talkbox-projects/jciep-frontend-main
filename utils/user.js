import { useRouter } from "next/router";
import { useCallback } from "react";
import { useAppContext } from "../store/AppStore";
import { setCookie, destroyCookie, parseCookies } from "nookies";

export const useCredential = () => {
  const { setUser, setIdentityId } = useAppContext();

  const setCredential = useCallback(({ token, user }) => {
    setCookie(null, "jciep-token", token, { path: "/" });

    console.log("Identity", parseCookies());
    const defaultIdentityId = parseCookies()?.["jciep-identityId"] ?? null;
    console.log("defaultIdentityId", defaultIdentityId);
    const firstIdentityId = user?.identities?.[0]?.id;
    console.log("firstIdentityId", firstIdentityId);

    const defaultIdentity = user?.identities.find(
      ({ id }) => id === defaultIdentityId
    );
    console.log("defaultIdentity", defaultIdentity);

    if (!defaultIdentity) {
      setCookie(null, "jciep-identityId", firstIdentityId, { path: "/" });
    }

    setUser(user);
    setIdentityId(defaultIdentity?.id ?? firstIdentityId ?? null);
  }, []);

  const removeCredential = useCallback(() => {
    destroyCookie(null, "jciep-token", { path: "/" });
    setIdentityId(null);
    setUser(null);
  }, []);

  return [setCredential, removeCredential];
};
