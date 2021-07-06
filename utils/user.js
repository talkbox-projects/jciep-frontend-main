import { useRouter } from "next/router";
import { useCallback } from "react";
import { useAppContext } from "../store/AppStore";
import { setCookie, destroyCookie } from "nookies";

export const useCredential = () => {
  const { setUser, setIdentityId } = useAppContext();
  const router = useRouter();

  const setCredential = useCallback(
    ({ token, user }) => {
      setCookie(null, "jciep-token", token, { path: "/" });
      const identities = user?.identities;
      setUser(user);
      setIdentityId((id) => id ?? identities?.[0]?.id ?? null);
    },
    [router]
  );

  const removeCredential = useCallback(() => {
    destroyCookie(null, "jciep-token", { path: "/" });
    setIdentityId(null);
    setUser(null);
  }, [router]);

  return [setCredential, removeCredential];
};
