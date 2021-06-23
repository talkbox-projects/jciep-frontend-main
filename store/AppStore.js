import { useDisclosure } from "@chakra-ui/react";
import constate from "constate";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrevious } from "../utils/hooks/generic";
import { useWordingLists } from "../utils/wordings/useWordingLists";

const useDisclosureWithParams = () => {
  const disclosure = useDisclosure();
  const [params, setParams] = useState(null);

  const onOpen = useCallback(
    (params) => {
      setParams(params);
      disclosure.onOpen();
    },
    [disclosure.onOpen]
  );
  const onClose = useCallback(() => {
    setParams(null);
    disclosure.onClose();
  }, [disclosure.onClose]);

  return { ...disclosure, onOpen, onClose, params };
};

const [AppProvider, useAppContext] = constate((props) => {
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
    ],
    key: "wordings",
    initialValue: props?.wordings?.value,
  });

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

  const loginModalDisclosure = useDisclosureWithParams();
  const registerModalDisclosure = useDisclosureWithParams();
  const otpVerifyModalDisclosure = useDisclosureWithParams();
  const emailVerifySentModalDisclosure = useDisclosureWithParams();
  const [user, setUser] = useState(null);
  const [identityId, setIdentityId] = useState(null);
  const isLoggedIn = useMemo(() => !!user, [user]);
  const _user = usePrevious(user);

  const missingProfile = useMemo(
    () => user && user?.identities?.length === 0,
    [user]
  );

  return {
    wordings,
    loginModalDisclosure,
    registerModalDisclosure,
    otpVerifyModalDisclosure,
    emailVerifySentModalDisclosure,
    user,
    setUser,
    isLoggedIn,
    identityId,
    setIdentityId,
  };
});

export { AppProvider, useAppContext };
