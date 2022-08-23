import React from "react";
import { UserContext } from "../components/DataProvider";
import axios from "axios";

const useUser = () => {
  const { setUser } = React.useContext(UserContext);
  const getUsersCredits = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/users/${id}`
      );
      setUser(response.data.user);
      return response.data.user.balance;
    } catch (error) {
      throw new Error("There were an error getting the user credits");
    }
  };
  const updateUserBalance = async (id, newBalance) => {
    try {
      const response = await axios({
        method: "put",
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/balance/${id}`,
        data: { balance: newBalance },
      });
      setUser(response.data.user);
      return true;
    } catch (error) {
      throw new Error("There were an error getting the user credits");
    }
  };
  return { getUsersCredits, updateUserBalance };
};

export default useUser;
