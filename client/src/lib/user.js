import Cookies from "js-cookie";
import { toast } from "sonner";

export function setUserData(name, username, userid) {
  Cookies.set("name", name, {
    expires: new Date(Date.now() + 1000000 * 60 * 60 * 24 * 365),
  });
  Cookies.set("username", username, {
    expires: new Date(Date.now() + 1000000 * 60 * 60 * 24 * 365),
  });
  Cookies.set("userid", userid, {
    expires: new Date(Date.now() + 1000000 * 60 * 60 * 24 * 365),
  });
}

export function getUserData() {
  const name = Cookies.get("name");
  const email = Cookies.get("username");
  const userid = Cookies.get("userid");

  return {
    name,
    email,
    userid,
  };
}

export function logout() {
  Cookies.remove("name");
  Cookies.remove("username");
  Cookies.remove("userid");
  toast.success("Successfully logged out");
  window.location.reload(false);
}
