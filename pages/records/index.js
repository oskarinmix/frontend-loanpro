import Header from "../../components/Header";
import Link from "next/link";
import React from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useUserContext } from "../../components/DataProvider";

const Index = ({ records, pages }) => {
  const { user } = useUserContext();
  const handleRemove = async (record) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/records/${record._id}`)
      .then((resp) => {
        console.log("DELETED");
      });
  };
  if (user) {
    return (
      <>
        <Header />

        <div className="flex h-min-screen w-screen max-w-[75%] mx-auto flex-col ">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl my-8">Records for {user.email}</h1>
            <h1>Max Pages: {pages}</h1>
            <Link href="/operations/create">
              <a className="flex bg-slate-900 text-white text-bold text-sm px-8 py-4">
                New Operation
              </a>
            </Link>
          </div>
          <ul className="flex flex-col w-full">
            {records.map((record) => (
              <li
                key={record._id}
                className="flex justify-between items-center w-full border border-gray-300 rounded-md p-4 my-2"
              >
                <h2 className="text-sm text-blue-500 font-bold">
                  {record._id}
                </h2>
                <h2 className="text-sm text-blue-500 font-bold">
                  {record.operationId.type}
                </h2>
                <h2 className="text-sm text-blue-500 font-bold">
                  {record.operationResponse}
                </h2>
                <h2 className="text-md text-red-500">Cost: {record.amount}</h2>
                <a
                  onClick={() => handleRemove(record)}
                  className="text-sm bg-black text-white font-bold p-2 cursor-pointer"
                >
                  Delete
                </a>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }
  return <h1>Not authorized</h1>;
};

export default Index;

export async function getServerSideProps(ctx) {
  const token = ctx?.req?.cookies?.auth_token || null;
  let page = ctx?.query.page;
  let userId;
  if (token) {
    const payload = jwt.decode(token, process.env.JWT_SECRET);
    if (payload.user) {
      userId = payload.user._id;
    }
  } else {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const { data } = await axios.get(
    `${process.env.SERVER_URL}/records/${userId}?page=${page}`
  );
  const records = data.records;

  if (page > data.pages) {
    return {
      redirect: {
        permanent: false,
        destination: "/records?page=" + Math.ceil(data.pages),
      },
    };
  }

  return {
    props: { records: records, pages: data.pages },
  };
}
