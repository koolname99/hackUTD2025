import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// login API
export const login = async (email, password) => {
  const res = await API.post("/api/login", { email, password });
  return res.data;
};

// get transactions
export const getTransactionsByMonth = async () => {
  const res = await API.get("/api/transactions");
  return res.data;
};
