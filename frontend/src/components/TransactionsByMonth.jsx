import { useEffect, useState } from "react";
import { getTransactionsByMonth } from "../api";

export default function TransactionsByMonth() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactionsByMonth().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>📅 Transactions by Month</h1>
      {Object.entries(data).map(([month, txns]) => (
        <div key={month} style={{ marginBottom: "30px" }}>
          <h2>{month}</h2>
          <table border="1" cellPadding="8" width="100%">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Merchant</th>
                <th>Category</th>
                <th>Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t) => (
                <tr key={t.txn_id}>
                  <td>{t.date}</td>
                  <td>{t.description}</td>
                  <td>{t.merchant || "-"}</td>
                  <td>{t.category}</td>
                  <td
                    style={{
                      color: t.amount < 0 ? "red" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {t.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
