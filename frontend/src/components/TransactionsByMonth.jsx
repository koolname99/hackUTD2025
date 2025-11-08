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
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        📅 Transactions by Month
      </h1>

      {Object.entries(data).map(([month, txns]) => (
        <div
          key={month}
          style={{
            marginBottom: "40px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>{month}</h2>
          <table
            border="1"
            cellPadding="8"
            width="100%"
            style={{ borderCollapse: "collapse" }}
          >
            <thead style={{ backgroundColor: "#f5f5f5" }}>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Merchant</th>
                <th>Category</th>
                <th>Amount ($)</th>
                <th>Running Balance ($)</th>
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
                  <td
                    style={{
                      color: "#555",
                      fontWeight: "500",
                      textAlign: "right",
                    }}
                  >
                    {t.running_balance?.toFixed(2)}
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
