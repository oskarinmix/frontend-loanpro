import axios from "axios";

const useRecord = () => {
  const createRecord = async (record) => {
    try {
      const response = await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/records`,
        data: record,
      });
      return response.data;
    } catch (error) {
      throw new Error("There were an error creating the record");
    }
  };
  return { createRecord };
};

export default useRecord;
