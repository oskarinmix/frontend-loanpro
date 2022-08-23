import Header from "../../components/Header.js";
import OperationForm from "../../components/OperationForm.js";
import React from "react";
import axios from "axios";

const Create = ({ operations }) => {
  return (
    <>
      <Header />
      <div className="flex h-min-screen w-min-screen flex-col items-center justify-center">
        <OperationForm operations={operations} />
      </div>
    </>
  );
};

export default Create;

export async function getServerSideProps(context) {
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
