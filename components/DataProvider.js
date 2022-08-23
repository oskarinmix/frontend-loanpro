import Cookies from "js-cookie";
import React from "react";
import jwt from "jsonwebtoken";

export const UserContext = React.createContext();
const DataProvider = (props) => {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const token = Cookies.get("auth_token");
    if (!user && token) {
      const payload = jwt.decode(token, process.env.JWT_SECRET);
      setUser(payload?.user || null);
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};
export default DataProvider;
export const useUserContext = () => {
  return React.useContext(UserContext);
};
