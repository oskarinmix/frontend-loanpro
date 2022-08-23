import Cookies from "js-cookie";
import React from "react";
import { UserContext } from "./DataProvider";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import useOperation from "../hooks/useOperation";
import useRecord from "../hooks/useRecord";
import { useRouter } from "next/router";
import useUser from "../hooks/useUser";

const OperationForm = ({ operations }) => {
  const router = useRouter();
  const [operationResult, setOperationResult] = React.useState(null);
  const { register, handleSubmit, watch, reset } = useForm();
  const operation = JSON.parse(watch("operation") || null) || null;
  const { getUsersCredits, updateUserBalance } = useUser();
  const { createRecord } = useRecord();
  const { runOperation } = useOperation();
  const { user, setUser } = React.useContext(UserContext);
  React.useEffect(() => {
    const token = Cookies.get("auth_token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const onSubmit = async (data) => {
    const operation = JSON.parse(data.operation);
    const body = { a: Number(data.number1), b: Number(data.number2) };
    const userCredits = await getUsersCredits(user._id);
    if (userCredits - operation.cost >= 0) {
      const result = await runOperation(body, operation);
      if (result) {
        await updateUserBalance(user._id, userCredits - operation.cost);
        const record = {
          userId: user._id,
          operationId: operation._id,
          operationResponse: result,
          amount: operation.cost,
          userBalance: userCredits - operation.cost,
        };
        await createRecord(record);
        setOperationResult(result);
        toast(`New User Balance ${userCredits - operation.cost} credits`, {
          type: "success",
          theme: "dark",
          progressClassName: "fancy-progress-bar",
          position: "top-right",
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      toast(`Balance too low. Not Enough credits `, {
        type: "error",
        theme: "dark",
        progressClassName: "fancy-progress-bar",
        position: "top-right",
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      reset();
    }
  };
  return (
    <div className="flex flex-col min-h-screen w-screen max-w-[70%] mx-auto justify-center items-center bg-slate-400">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-1/2">
        <label htmlFor="operation">Select an Operation type: </label>
        <select
          className="p-2 my-2"
          placeholder="Select an Operation"
          {...register("operation", {
            required: true,
            validate: (value) => value !== null,
          })}
        >
          <option value="">Select an Operation</option>
          {operations.map((operation, idx) => (
            <option value={JSON.stringify(operation)} key={idx}>
              {operation.name}
            </option>
          ))}
        </select>
        {operation && operation.type !== "RANDOM_STRING" && (
          <input
            type="number"
            className="p-2 my-2"
            placeholder="Number 1"
            {...register("number1", {
              required: true,
            })}
          />
        )}
        {operation &&
          operation.type !== "SQUARE_ROOT" &&
          operation.type !== "RANDOM_STRING" && (
            <input
              type="number"
              className="p-2 my-2"
              placeholder="Number 2"
              {...register("number2", {
                required: true,
              })}
              style={{ WebkitAppearance: "none", margin: 0 }}
            />
          )}
        {operation && operation.cost && (
          <span className="text-sm text-red-500 my-4 p-2 bg-slate-300">{`The cost of this operation is ${operation.cost}`}</span>
        )}
        <button
          type="submit"
          className="w-full my-2 p-2 bg-cyan-800 text-white font-bold"
        >
          RESULT
        </button>
      </form>

      {operation && operationResult && (
        <span className="text-sm text-red-500 my-4 p-2 bg-slate-300">
          {`The Result of the ${operation.name} is : `}
          <span className="text-4xl">{operationResult}</span>
        </span>
      )}
    </div>
  );
};

export default OperationForm;
