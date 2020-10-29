import { useEffect } from "react";
import { getUserStateCode } from "../utils/authentication/user";
import { useAuth0 } from "../react-auth0-spa";

const useIntercom = () => {
  const { user } = useAuth0();
  const userStateCode = getUserStateCode(user);

  useEffect(() => {
    window.Intercom("update", {
      state_code: userStateCode,
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      user_id: user.sub,
      hide_default_launcher: false,
    });
  }, [userStateCode, user.name, user.nickname, user.email, user.sub]);

  useEffect(() => {
    return () => {
      window.Intercom("update", { hide_default_launcher: true });
    };
  }, []);
};

export default useIntercom;
