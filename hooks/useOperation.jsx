import axios from "axios";

const useOperation = () => {
  const runOperation = async (body, operation) => {
    const response = await axios({
      method: operation.method,
      url: `${process.env.NEXT_PUBLIC_LAMBDAS_SERVER}/${operation.path}`,
      data: body,
    });
    if (response.status === 200) {
      return response.data.result;
    } else return null;
  };
  return { runOperation };
};

export default useOperation;
