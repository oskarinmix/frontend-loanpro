import React, { useEffect } from "react";

import Cookies from "js-cookie";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useUserContext } from "../components/DataProvider.js";

const LoginForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();
  const onSubmit = async ({ email, password }, e) => {
    const body = { email, password };
    try {
      const resp = await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/register`,
        data: body,
      });

      if (resp.data.ok) {
        toast("Succesfully Registered", {
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
        router.push("/login");
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
  return (
    <div className="flex items-center justify-center max-w-[80%] mx-auto flex-col p-12">
      <h1 className="text-2xl font-bold mb-8">REGISTER AN ACCOUNT</h1>
      <form
        className="flex flex-col w-1/3 md:w-1/2 sm:w-full  items-center"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <input
          type="email"
          placeholder="Email"
          // value={email}
          onChange={() => {
            clearErrors("email");
          }}
          className="bg-gray-200 p-2 mb-4 text-sm w-full"
          {...register("email", {
            required: `Must enter an email`,

            pattern: {
              value:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Please provide valid email address",
            },
          })}
        />
        {errors.email?.message && (
          <p className="text-sm text-red-500 text-left self-start p-0 my-[-12px] font-medium mb-4">
            {errors.email?.message}
          </p>
        )}
        <input
          type="password"
          placeholder="Password"
          // value={password}
          // onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-200 p-2 text-sm w-full mb-4"
          {...register("password", {
            required: `Password is required`,
          })}
        />
        {errors.password?.message && (
          <p className="text-sm text-red-500 text-left self-start p-0 my-[-12px] font-medium mb-4">
            {errors.password?.message}
          </p>
        )}
        <button
          type="submit"
          className="bg-[#528EC1] px-12 py-3 font-semibold text-white text-sm mb-4"
        >
          REGISTER
        </button>
        <Link href="/login">
          <a className="text-sm text-center text-[#528EC1] font-semibold mb-4">
            Login here if you have an account
          </a>
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
