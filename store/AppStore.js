import { useDisclosure } from "@chakra-ui/react";
import constate from "constate";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWordingLists } from "../utils/wordings/useWordingLists";
import { useCMS } from "tinacms";
import { updateIf } from "../utils/general";
import { useRouter } from "next/router";

export const useDisclosureWithParams = (props) => {
  const disclosure = useDisclosure(props);
  const [params, setParams] = useState({});

  const onOpen = useCallback(
    (params) => {
      setParams(params);
      disclosure.onOpen();
    },
    [disclosure]
  );
  const onClose = useCallback(() => {
    setParams({});
    disclosure.onClose();
  }, [disclosure]);

  return { ...disclosure, onOpen, onClose, params };
};

const [AppProvider, useAppContext] = constate((props) => {
  const router = useRouter();
  const _wordings = useWordingLists({
    lists: [
      {
        name: "header",
        label: "Header (header)",
      },
      {
        name: "login",
        label: "Login (login)",
      },
      {
        name: "register",
        label: "Register (register)",
      },
      {
        name: "otpVerify",
        label: "OTP Verify (otpVerify)",
      },
      {
        name: "emailVerify",
        label: "Email Verify (emailVerify)",
      },
      {
        name: "emailVerifySent",
        label: "Email Verify Sent Modal (emailVerifySent)",
      },
      {
        name: "resentPassword",
        label: "Reset Password Modal (resentPassword)",
      },
    ],
    key: "wordings",
    initialValue: props?.wordings?.value,
  });

  const [environmentSetting, setEnvironmentSetting] = useState(
    props.environmentSetting
  );
  const wordings = useMemo(() => {
    return Object.entries(_wordings).reduce(
      (o, [cat, arr]) => ({
        ...o,
        [cat]: arr.reduce(
          (p, { key, value }) => ({
            ...p,
            [key]: value,
          }),
          {}
        ),
      }),
      {}
    );
  }, [_wordings]);

  const loginModalDisclosure = useDisclosureWithParams({
    defaultIsOpen: !!router?.query?.login,
  });
  const registerModalDisclosure = useDisclosureWithParams({
    defaultIsOpen: !!router?.query?.register,
  });
  const otpVerifyModalDisclosure = useDisclosureWithParams();
  const emailVerifySentModalDisclosure = useDisclosureWithParams();
  const resetPasswordModalDisclosure = useDisclosureWithParams();
  const [user, setUser] = useState(null);
  const [identityId, setIdentityId] = useState(null);
  const isLoggedIn = useMemo(() => !!user, [user]);
  const [email, setEmail] = useState(null);

  const identity = useMemo(
    () => (user?.identities ?? []).find(({ id }) => id === identityId),
    [user, identityId]
  );

  const cms = useCMS();

  useEffect(() => {
    if (identity?.type === "admin") {
      cms.enable();
    } else {
      cms.enable();
      // cms.disable();
    }
  }, [cms, identity]);

  const updateIdentity = useCallback((id, updater) => {
    setUser((user) => {
      return {
        ...user,
        identities: updateIf(
          user?.identities ?? [],
          (identity) => identity.id === id,
          (identity) => {
            return typeof updater === "function"
              ? updater(identity)
              : { ...identity, ...updater };
          }
        ),
      };
    });
  }, []);

  return {
    wordings,
    loginModalDisclosure,
    registerModalDisclosure,
    otpVerifyModalDisclosure,
    emailVerifySentModalDisclosure,
    resetPasswordModalDisclosure,
    user,
    setUser,
    isLoggedIn,
    email,
    setEmail,
    identity,
    identityId,
    setIdentityId,
    updateIdentity,

    environmentSetting,
    setEnvironmentSetting,
  };
});

export { AppProvider, useAppContext };
