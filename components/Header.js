import Cookies from "js-cookie";
import Link from "next/link";
import React from "react";
import { UserContext } from "./DataProvider";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const { user, setUser } = React.useContext(UserContext);
  const [updated, setUpdated] = React.useState(false);
  React.useEffect(() => {
    const getUser = async (_id) => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/users/${_id}`
      );
      if (data.ok === true) {
        return data.user;
      }
      return null;
    };
    if (user && !updated) {
      getUser(user._id).then((user) => {
        setUser(user);
        setUpdated(true);
      });
    }
  }, [user]);
  const handleLogout = () => {
    Cookies.remove("auth_token");
    setUser(null);
    router.push("/");
  };
  if (user) {
    return (
      <div className="bg-slate-900 text-white h-24 w-screen flex flex-col items-center justify-around">
        <div className="flex justify-between items-center w-full max-w-[75%] mx-auto">
          <span className="text-2xl">{user.email}</span>
          <div className="flex w-1/4 items-baseline justify-end">
            <span className="text-md text-green-700 font-bold">
              {user.status}
            </span>
            <span className="px-2 text-2xl"> {user.balance} credits</span>
          </div>
        </div>
        <ul className="flex w-full list-none items-center justify-around">
          <Link href="/operations">
            <a>
              <li>Operations</li>
            </a>
          </Link>
          <Link href="/records">
            <a>
              <li>Records</li>
            </a>
          </Link>
          <Link href="/reload">
            <a>
              <li>Reload Balance</li>
            </a>
          </Link>
          <Link href="/operations/create">
            <a>
              <li>New Operation</li>
            </a>
          </Link>

          <a
            onClick={() => handleLogout()}
            className="cursor-pointer bg-red-500 text-white text-sm font-bold p-2 rounded-md"
          >
            <li>Logout</li>
          </a>
        </ul>
      </div>
    );
  }
  return <h1>loading</h1>;
};

export default Header;
