import axios from "axios";

export const getTransactionsByMonth = async (userEmail) => {
  const res = await axios.get("http://localhost:5000/api/transactions", {
    params: { email: userEmail }
  });
  return res.data;
};

export const checkEmailExists = async (email) => {
  const res = await axios.get("http://localhost:5000/api/auth/check-email", {
    params: { email }
  });
  return res.data;
};

export const getCategoryBudgets = async (userEmail) => {
  const res = await axios.get("http://localhost:5000/api/category-budgets", {
    params: { email: userEmail }
  });
  return res.data;
};

export const saveCategoryBudgets = async (userEmail, budgets) => {
  const res = await axios.post("http://localhost:5000/api/category-budgets", {
    email: userEmail,
    budgets
  });
  return res.data;
};
