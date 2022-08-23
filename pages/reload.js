import React, { useEffect } from "react";

import Cookies from "js-cookie";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useUserContext } from "../components/DataProvider.js";

const LoginForm = () => {
  React.useEffect(() => {
    const token = Cookies.get("auth_token");
    if (!token) {
      router.push("/login");
    }
  }, []);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();
  const { setUser, user } = useUserContext();
  const onSubmit = async ({ amount }, e) => {
    const body = { balance: amount };
    try {
      const resp = await axios({
        method: "put",
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/reload/${user._id}`,
        data: body,
      });

      if (resp.data.ok) {
        toast("Succesfully Reload", {
          type: "success",
          theme: "dark",
          progressClassName: "fancy-progress-bar",
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        router.push("/operations/create");
      }
    } catch (error) {
      toast(error.response.statusText, {
        type: "error",
        theme: "dark",
        progressClassName: "fancy-progress-bar",
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  if (user) {
    return (
      <div className="flex items-center justify-center max-w-[80%] mx-auto flex-col p-12">
        <h1 className="text-2xl font-bold mb-8">RELOAD YOUR BALANCE</h1>
        <form
          className="flex flex-col w-1/3 md:w-1/2 sm:w-full  items-center"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <input
            type="number"
            placeholder="Balance to Reload"
            // value={email}
            onChange={() => {
              clearErrors("email");
            }}
            className="bg-gray-200 p-2 mb-4 text-sm w-full"
            {...register("amount", {
              required: `Must enter an amount`,
              validate: (value) =>
                (value > 0 && value <= 100) ||
                "Must be greater than 0 and no more than 100",
            })}
          />
          {errors.amount?.message && (
            <p className="text-sm text-red-500 text-left self-start p-0 my-[-12px] font-medium mb-4">
              {errors.amount?.message}
            </p>
          )}

          <button
            type="submit"
            className="bg-[#528EC1] px-12 py-3 font-semibold text-white text-sm mb-4"
          >
            RELOAD
          </button>
          <Link href="/records">
            <a className="text-sm text-center text-[#528EC1] font-semibold mb-4">
              GO BACK
            </a>
          </Link>
        </form>
      </div>
    );
  }
};

export default LoginForm;
