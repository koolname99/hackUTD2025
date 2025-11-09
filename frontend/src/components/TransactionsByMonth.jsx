import './TransactionsByMonth.css'

export default function TransactionsByMonth({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="no-transactions">
        <p>No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="transactions-by-month">
      {Object.entries(data)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([month, txns]) => (
          <div key={month} className="month-section">
            <h3 className="month-header">{formatMonth(month)}</h3>
            <div className="transactions-table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Merchant</th>
                    <th>Category</th>
                    <th className="amount-header">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {txns.map((t) => (
                    <tr key={t.txn_id} className="transaction-row">
                      <td className="date-cell">{formatDate(t.date)}</td>
                      <td className="description-cell">{t.description}</td>
                      <td className="merchant-cell">{t.merchant || "-"}</td>
                      <td>
                        <span className="category-badge">{t.category}</span>
                      </td>
                      <td className={`amount-cell ${t.amount >= 0 ? 'positive' : 'negative'}`}>
                        {t.amount >= 0 ? '+' : ''}${t.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  );
}

function formatMonth(month) {
  const [year, monthNum] = month.split('-');
  const date = new Date(year, parseInt(monthNum) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
