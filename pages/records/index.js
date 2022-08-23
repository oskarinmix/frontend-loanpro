import Header from "../../components/Header";
import Link from "next/link";
import React from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { useUserContext } from "../../components/DataProvider";

const Index = ({ records, pages }) => {
  const { user } = useUserContext();
  const router = useRouter();
  const handleRemove = async (record) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/records/${record._id}`)
      .then((resp) => {
        router.reload();
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
          {records.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th className="border px-4 py-2 w-1/5">OperationID</th>
                  <th className="border px-4 py-2 w-1/5">Type</th>
                  <th className="border px-4 py-2">Cost</th>
                  <th className="border px-4 py-2">Result</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record._id}>
                    <td className="border px-4 py-2">{record._id}</td>
                    <td className="border px-4 py-2">
                      {record.operationId.type}
                    </td>
                    <td className="border px-4 py-2">{record.amount}</td>
                    <td className="border px-4 py-2">
                      {record.operationResponse}
                    </td>
                    <td className="border px-4 py-2">
                      {record.createdAt.toLocaleString()}
                    </td>

                    <td className="border px-4 py-2">
                      <a
                        className="flex bg-slate-900 text-white text-bold text-sm px-8 py-4 cursor-pointer"
                        onClick={() => handleRemove(record)}
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h1 className="text-2xl my-4"> No records found</h1>
          )}
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
