import { useDisclosure } from "@chakra-ui/react";
import constate from "constate";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWordingLists } from "../utils/wordings/useWordingLists";

const [AppProvider, useAppContext] = constate((props) => {
  const _wordings = useWordingLists({
    lists: [
      {
        name: "login",
        label: "Login 登入 (login)",
        Description: "Login-related words",
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

  const loginModalDisclosure = useDisclosure();
  const [user, setUser] = useState(null);
  const isLoggedIn = useMemo(() => !!user, [user]);

  const onLogin = useCallback(() => {}, []);
  useEffect(() => {
    onLogin();
  }, []);

  return {
    wordings,
    loginModalDisclosure,
    user,
    setUser,
    isLoggedIn,
  };
});

export { AppProvider, useAppContext };
