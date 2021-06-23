import { useRouter } from "next/router";
import { useCallback } from "react";
import { useAppContext } from "../store/AppStore";

export const useLoginHook = () => {
  const { setUser, setIdentityId } = useAppContext();
  const router = useRouter();
  return useCallback(
    (user) => {
      const identities = user?.identities;
      const identityId = identities?.[0] ?? null;
      setUser(user);
      setIdentityId(identityId ?? null);
      if (identities?.length === 0) {
        router.push("/profile");
      }
    },
    [router]
  );
};
