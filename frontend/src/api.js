import axios from "axios";

export const getTransactionsByMonth = async () => {
  const res = await axios.get("http://localhost:5000/api/transactions");
  return res.data;
};
