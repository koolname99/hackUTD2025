import { useEffect, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { getTransactionsByMonth } from "../../api";
import TransactionsByMonth from "../TransactionsByMonth";
import FinancialDashboard from "./FinancialDashboard";
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth0();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netAmount: 0,
    transactionCount: 0
  });

  useEffect(() => {
    if (!user?.email) return;
    
    getTransactionsByMonth(user.email).then((res) => {
      setData(res);
      
      // Calculate summary
      let income = 0;
      let expenses = 0;
      let count = 0;
      
      Object.values(res).forEach(txns => {
        txns.forEach(txn => {
          count++;
          if (txn.amount > 0) {
            income += txn.amount;
          } else {
            expenses += Math.abs(txn.amount);
          }
        });
      });
      
      setSummary({
        totalIncome: income,
        totalExpenses: expenses,
        netAmount: income - expenses,
        transactionCount: count
      });
      
      setLoading(false);
    });
  }, [user?.email]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your financial data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <FinancialDashboard />
    </div>
  );
}

