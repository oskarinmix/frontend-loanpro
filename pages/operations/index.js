import Cookies from "js-cookie";
import Header from "../../components/Header";
import Link from "next/link";
import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useUserContext } from "../../components/DataProvider";
const Index = ({ operations }) => {
  const router = useRouter();
  const { user } = useUserContext();
  React.useEffect(() => {
    const token = Cookies.get("auth_token");
    if (!token) {
      router.push("/login");
    }
  }, []);
  return (
    <>
      <Header />

      <div className="flex h-min-screen w-screen max-w-[75%] mx-auto flex-col ">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl my-8">Operations for {user?.email || ""}</h1>
          <Link href="/operations/create">
            <a className="flex bg-slate-900 text-white text-bold text-sm px-8 py-4">
              New Operation
            </a>
          </Link>
        </div>
        <ul className="flex flex-col w-full">
          {operations.map((operation) => (
            <li
              key={operation._id}
              className="flex justify-between items-center w-full border border-gray-300 rounded-md p-4 my-2"
            >
              <h2 className="text-xl">{operation.name}</h2>
              <h2 className="text-md text-red-500">Cost: {operation.cost}</h2>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Index;

export async function getServerSideProps(context) {
  // const { auth_token } = context.req.cookies;
  // const payload = jwt.decode(auth_token, process.env.JWT_SECRET);

  // const { data: user } = await axios.get(
  //   `${process.env.SERVER_URL}/auth/users/${payload.user._id}`
  // );
  const { data } = await axios.get(`${process.env.SERVER_URL}/operations`);
  const operations = data.operations;
  const nameOperations = {
    ADDITION: "Sum",
    SUBTRACTION: "Rest",
    MULTIPLICATION: "Multiplication",
    DIVISION: "Division",
    SQUARE_ROOT: "Square Root",
    RANDOM_STRING: "Ramdom String",
  };
  const operationPaths = {
    ADDITION: "sum",
    SUBTRACTION: "rest",
    MULTIPLICATION: "multiply",
    DIVISION: "divide",
    SQUARE_ROOT: "square-root",
    RANDOM_STRING: "random-string",
  };
  const options = operations.map((operation) => ({
    ...operation,
    name: nameOperations[operation.type],
    path: operationPaths[operation.type],
    method: operation.type !== "RANDOM_STRING" ? "post" : "get",
  }));
  return {
    props: { operations: options },
  };
}
