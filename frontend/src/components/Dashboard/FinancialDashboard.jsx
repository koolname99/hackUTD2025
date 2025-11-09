import { useEffect, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { getTransactionsByMonth, getCategoryBudgets, saveCategoryBudgets } from "../../api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './FinancialDashboard.css'

export default function FinancialDashboard() {
  const { user } = useAuth0();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Calculate totals and categories
  const [totalMoney, setTotalMoney] = useState(0);
  const [monthlySpending, setMonthlySpending] = useState([]);
  const [categories, setCategories] = useState({});
  const [categoryBankBreakdown, setCategoryBankBreakdown] = useState({});
  const [categoryBudgets, setCategoryBudgets] = useState({}); // { "2025-11": { "Food": 500, "Housing": 1200 } }
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({ category: '', month: '2025-11', budget: '' });
  
  // Transaction filters and sorting
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'category', 'amount'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  useEffect(() => {
    if (!user?.email) return;
    
    // Fetch transactions, cards, and category budgets
    Promise.all([
      getTransactionsByMonth(user.email),
      axios.get('http://localhost:5000/api/cards', { params: { email: user.email } }).catch(() => ({ data: [] })),
      getCategoryBudgets(user.email).catch(() => ({}))
    ])
      .then(([res, cardsRes, budgets]) => {
        console.log('📥 FinancialDashboard data received:', res);
        console.log('💰 Category budgets received:', budgets);
        console.log('💰 Budget type check:', typeof budgets);
        console.log('💰 Budgets JSON:', JSON.stringify(budgets, null, 2));
        
        // Handle old format with month structure - convert to flat
        if (budgets && budgets["2025-11"]) {
          console.log('🔄 Converting from month structure to flat');
          budgets = budgets["2025-11"];
        }
        
        if (budgets && Object.keys(budgets).length > 0) {
          console.log('💰 Budgets:', budgets);
          console.log('💰 Housing budget:', budgets["Housing"], typeof budgets["Housing"]);
          console.log('💰 All categories:', Object.keys(budgets));
        } else {
          console.warn('⚠️ No budgets found in response!');
        }
        setData(res || {});
        // Budgets format: { "2025-11": { "Food": 500, "Housing": 1200 } } (per month)
        setCategoryBudgets(budgets || {});
        
        // Get cards data and calculate total money (sum of all card balances)
        const cards = cardsRes.data || [];
        const totalCardBalance = cards.reduce((sum, card) => sum + (card.balance || 0), 0);
        
        const monthlyData = [];
        const categoryData = {};
        const bankBreakdown = {};
        
        // Check if res is valid and has data
        if (!res || typeof res !== 'object') {
          console.warn('Invalid data received:', res);
          setTotalMoney(358.32); // Fixed value
          setMonthlySpending([]);
          setCategories({});
          setCategoryBankBreakdown({});
          setLoading(false);
          return;
        }
        
        // Sort months chronologically
        const sortedMonths = Object.keys(res).sort();
        
        // Calculate category spending per month
        const categoryMonthlyData = {}; // { "2025-11": { "Housing": { spent: 300, budget: 1000 } } }
        
        // Handle old format with month structure - convert to flat
        let flatBudgets = budgets;
        if (budgets && budgets["2025-11"]) {
          console.log('🔄 Converting budgets from month structure to flat');
          flatBudgets = budgets["2025-11"];
        }
        
        // Initialize November 2025 if budgets exist (even if no transactions)
        console.log('🔍 Checking budgets for November:', flatBudgets);
        if (flatBudgets && Object.keys(flatBudgets).length > 0) {
          console.log('✅ Found budgets:', flatBudgets);
          categoryMonthlyData["2025-11"] = {};
          Object.keys(flatBudgets).forEach(category => {
            let budgetValue = flatBudgets[category];
            console.log(`  - ${category}: ${budgetValue} (type: ${typeof budgetValue})`);
            
            // Convert string to number if needed (MongoDB might return strings)
            if (typeof budgetValue === 'string') {
              budgetValue = parseFloat(budgetValue);
              console.log(`    Converted to number: ${budgetValue}`);
            }
            
            // Only set to null if truly undefined or null, otherwise use the value (even if 0)
            // Ensure we preserve the actual number value
            const finalBudget = (budgetValue !== undefined && budgetValue !== null && !isNaN(budgetValue) && typeof budgetValue === 'number') 
              ? budgetValue 
              : null;
            
            console.log(`    Final budget: ${finalBudget} (type: ${typeof finalBudget})`);
            
            categoryMonthlyData["2025-11"][category] = {
              spent: 0,
              budget: finalBudget
            };
          });
          console.log('✅ Initialized November categories with budgets:', categoryMonthlyData["2025-11"]);
          console.log('📊 Budget values check:', Object.entries(categoryMonthlyData["2025-11"]).map(([cat, info]) => 
            `${cat}: budget=${info.budget} (type: ${typeof info.budget}, isNaN: ${isNaN(info.budget)})`
          ));
        } else {
          console.warn('⚠️ No budgets found');
          console.log('Budgets object:', flatBudgets);
        }
        
        sortedMonths.forEach(month => {
          const txns = res[month] || [];
          let monthTotal = 0;
          
          if (!categoryMonthlyData[month]) {
            categoryMonthlyData[month] = {};
          }
          
          // Initialize all categories with budgets (even if no transactions yet)
          // Only for November 2025 (current month)
          if (month === "2025-11" && flatBudgets) {
            Object.keys(flatBudgets).forEach(category => {
              if (!categoryMonthlyData[month][category]) {
                let budgetValue = flatBudgets[category];
                
                // Convert string to number if needed
                if (typeof budgetValue === 'string') {
                  budgetValue = parseFloat(budgetValue);
                }
                
                const finalBudget = (budgetValue !== undefined && budgetValue !== null && !isNaN(budgetValue) && typeof budgetValue === 'number')
                  ? budgetValue
                  : null;
                
                categoryMonthlyData[month][category] = {
                  spent: 0,
                  budget: finalBudget
                };
              }
            });
          }
          
          if (Array.isArray(txns)) {
            txns.forEach(txn => {
              // Calculate monthly spending (only negative amounts - expenses)
              if (txn.amount < 0) {
                monthTotal += Math.abs(txn.amount);
                
                // Group by category per month
                const category = txn.category || 'Other';
                if (!categoryMonthlyData[month][category]) {
                  // Only get budget for November 2025
                  let budgetValue = (month === "2025-11" && flatBudgets) ? flatBudgets[category] : undefined;
                  
                  // Convert string to number if needed
                  if (typeof budgetValue === 'string') {
                    budgetValue = parseFloat(budgetValue);
                  }
                  
                  const finalBudget = (budgetValue !== undefined && budgetValue !== null && !isNaN(budgetValue) && typeof budgetValue === 'number')
                    ? budgetValue
                    : null;
                  
                  categoryMonthlyData[month][category] = {
                    spent: 0,
                    budget: finalBudget
                  };
                } else {
                  // Preserve existing budget if category already exists (from budget initialization)
                  // Only update budget if it's missing and it's November 2025
                  if ((categoryMonthlyData[month][category].budget === null || categoryMonthlyData[month][category].budget === undefined) && month === "2025-11" && flatBudgets) {
                    let budgetValue = flatBudgets[category];
                    
                    // Convert string to number if needed
                    if (typeof budgetValue === 'string') {
                      budgetValue = parseFloat(budgetValue);
                    }
                    
                    const finalBudget = (budgetValue !== undefined && budgetValue !== null && !isNaN(budgetValue) && typeof budgetValue === 'number')
                      ? budgetValue
                      : null;
                    
                    categoryMonthlyData[month][category].budget = finalBudget;
                  }
                }
                
                // Calculate spent amount for this month
                categoryMonthlyData[month][category].spent += Math.abs(txn.amount);
                
                // Also update overall category data for backward compatibility
                if (!categoryData[category]) {
                  categoryData[category] = {
                    total: 0,
                    spent: 0,
                    budget: 0
                  };
                }
                categoryData[category].spent += Math.abs(txn.amount);
                
                // Mock bank data - in real app, this would come from transaction data
                const bank = txn.bank || getBankFromMerchant(txn.merchant) || 'Bank of America';
                if (!bankBreakdown[category]) {
                  bankBreakdown[category] = {};
                }
                if (!bankBreakdown[category][bank]) {
                  bankBreakdown[category][bank] = 0;
                }
                bankBreakdown[category][bank] += Math.abs(txn.amount);
              }
            });
          }
          
          monthlyData.push({
            month,
            amount: monthTotal
          });
        });
        
        // Store category monthly data (per month per category)
        console.log('📦 Final categoryMonthlyData before setCategories:', categoryMonthlyData);
        if (categoryMonthlyData["2025-11"]) {
          console.log('📦 November 2025 categories:', categoryMonthlyData["2025-11"]);
          console.log('📦 Sample category (Housing):', categoryMonthlyData["2025-11"]["Housing"]);
        }
        setCategories(categoryMonthlyData);
        
        console.log('Calculated totals:', { totalCardBalance, monthlyData, categoryData, bankBreakdown });
        
        setTotalMoney(358.32); // Fixed value
        setMonthlySpending(monthlyData);
        setCategoryBankBreakdown(bankBreakdown);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading financial data:', error);
        setLoading(false);
      });
  }, [user?.email]);

  // Helper function to mock bank assignment
  function getBankFromMerchant(merchant) {
    if (!merchant) return 'Bank of America';
    const merchantLower = merchant.toLowerCase();
    if (merchantLower.includes('capital') || merchantLower.includes('one')) {
      return 'Capital One';
    }
    if (merchantLower.includes('chase')) {
      return 'Chase';
    }
    if (merchantLower.includes('wells')) {
      return 'Wells Fargo';
    }
    return 'Bank of America';
  }

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // Deselect if clicking same category
    } else {
      setSelectedCategory(category);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryData.category || !newCategoryData.budget) {
      alert('Please fill in all fields');
      return;
    }

    // Flat structure: { "Housing": 3000, "Transportation": 200 }
    const updatedBudgets = { ...categoryBudgets };
    updatedBudgets[newCategoryData.category] = parseFloat(newCategoryData.budget);
    
    try {
      await saveCategoryBudgets(user.email, updatedBudgets);
      setCategoryBudgets(updatedBudgets);
      
      // Update categories state for November 2025
      const monthKey = "2025-11";
      const updatedCategories = { ...categories };
      if (!updatedCategories[monthKey]) {
        updatedCategories[monthKey] = {};
      }
      if (!updatedCategories[monthKey][newCategoryData.category]) {
        updatedCategories[monthKey][newCategoryData.category] = { spent: 0, budget: parseFloat(newCategoryData.budget) };
      } else {
        updatedCategories[monthKey][newCategoryData.category].budget = parseFloat(newCategoryData.budget);
      }
      setCategories(updatedCategories);
      
      setNewCategoryData({ category: '', month: '2025-11', budget: '' });
      setShowAddCategoryForm(false);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category. Please try again.');
    }
  };

  const handleDeleteCategory = async (month, category) => {
    if (!confirm(`Are you sure you want to delete ${category} budget for ${formatMonth(month)}?`)) {
      return;
    }

    // Flat structure: { "Housing": 3000, "Transportation": 200 }
    const updatedBudgets = { ...categoryBudgets };
    if (updatedBudgets[category] !== undefined) {
      delete updatedBudgets[category];
    }
    
    try {
      await saveCategoryBudgets(user.email, updatedBudgets);
      setCategoryBudgets(updatedBudgets);
      
      // Update categories state - set budget to 0 (not null) to indicate deletion
      const updatedCategories = { ...categories };
      if (updatedCategories[month] && updatedCategories[month][category]) {
        updatedCategories[month][category].budget = 0;
      }
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    }
  };

  const formatMonth = (monthKey) => {
    if (!monthKey) return '';
    const [year, month] = monthKey.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };


  // Get graph data based on selection
  const getGraphData = () => {
    if (!selectedCategory) {
      return monthlySpending;
    }
    
    // Calculate category spending by month from categories state
    const categoryMonthlyData = [];
    const sortedMonths = Object.keys(categories).sort();
    
    sortedMonths.forEach(month => {
      const monthCategories = categories[month] || {};
      const categoryInfo = monthCategories[selectedCategory];
      const monthTotal = categoryInfo ? categoryInfo.spent : 0;
      
      categoryMonthlyData.push({
        month,
        amount: monthTotal
      });
    });
    
    return categoryMonthlyData;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your financial data...</p>
      </div>
    );
  }

  const graphData = getGraphData();
  const maxAmount = graphData.length > 0 ? Math.max(...graphData.map(d => d.amount), 1) : 1;
  const yAxisMax = maxAmount * 2; // Y-axis max is double the max amount

  // Show message if no data
  if (!loading && Object.keys(categories).length === 0 && monthlySpending.length === 0) {
    return (
      <div className="financial-dashboard">
        <div className="no-data-message">
          <p>No financial data available. Please check your transactions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-dashboard">
          {/* Total Money Card */}
          <div className="total-money-card">
            <div className="total-money-content">
              <p className="total-money-label">Total Money</p>
              <h1 className="total-money-value">${totalMoney.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
            </div>
          </div>

      {/* Spending Graph - Line Chart */}
      {graphData.length > 0 && (
        <div className="graph-section">
          <h2 className="graph-title">
            {selectedCategory ? `${selectedCategory} Spending Over Time` : 'Total Spending Over Time'}
          </h2>
          <div className="line-graph-container">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={graphData.map(item => ({ ...item, month: formatMonthShort(item.month) }))}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  style={{ fontSize: '11px' }}
                />
                <YAxis 
                  domain={[0, yAxisMax]}
                  stroke="#6b7280"
                  style={{ fontSize: '11px' }}
                  tickFormatter={(value) => `$${formatAmount(value)}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#667eea" 
                  strokeWidth={2}
                  fill="url(#colorGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Category Cards - November Only */}
      {categories["2025-11"] && Object.keys(categories["2025-11"]).length > 0 && (
        <div className="categories-section">
          <div className="categories-header">
            <h2 className="categories-title">Spending by Category</h2>
            <button 
              className="btn-add-category"
              onClick={() => setShowAddCategoryForm(true)}
            >
              + Add Category
            </button>
          </div>
          
          <div className="month-categories-section">
            <h3 className="month-categories-title">{formatMonth("2025-11")}</h3>
            <div className="category-cards">
              {Object.entries(categories["2025-11"]).map(([category, info]) => {
                console.log(`🎯 Rendering category ${category}:`, info);
                const budget = (info.budget !== undefined && info.budget !== null && typeof info.budget === 'number') ? info.budget : null;
                const spent = info.spent || 0;
                const percentage = budget !== null && budget !== undefined && budget > 0 ? (spent / budget) * 100 : 0;
                const isSelected = selectedCategory === category;
                console.log(`  Budget: ${budget}, Spent: ${spent}, Percentage: ${percentage}`);
                
                return (
                  <div
                    key={`2025-11-${category}`}
                    className={`category-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="category-header">
                      <h3 className="category-name">{category}</h3>
                      <span className="category-icon">{getCategoryIcon(category)}</span>
                      <button
                        className="btn-delete-category"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory("2025-11", category);
                        }}
                        title="Delete category budget"
                      >
                        ×
                      </button>
                    </div>
                    <div className="category-amounts">
                      <span className="category-spent">${spent.toFixed(2)}</span>
                      {budget !== null && budget !== undefined && typeof budget === 'number' ? (
                        <span className="category-total">of ${budget.toFixed(2)}</span>
                      ) : (
                        <span className="category-total">of No Limit</span>
                      )}
                    </div>
                    {budget !== null && budget !== undefined && typeof budget === 'number' && (
                      <div className="category-progress">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <span className="progress-percentage">{percentage.toFixed(0)}%</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Category Form Modal */}
      {showAddCategoryForm && (
        <div className="form-overlay" onClick={() => setShowAddCategoryForm(false)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h2>Add Category Budget</h2>
              <button className="btn-close" onClick={() => setShowAddCategoryForm(false)}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddCategory();
            }} className="category-form">
              <div className="form-group">
                <label htmlFor="category-name">Category Name *</label>
                <input
                  type="text"
                  id="category-name"
                  value={newCategoryData.category}
                  onChange={(e) => setNewCategoryData({ ...newCategoryData, category: e.target.value })}
                  placeholder="e.g., Food, Housing, Entertainment"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category-month">Month *</label>
                <input
                  type="month"
                  id="category-month"
                  value={newCategoryData.month}
                  onChange={(e) => setNewCategoryData({ ...newCategoryData, month: e.target.value })}
                  required
                  disabled
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="category-budget">Budget Amount *</label>
                <input
                  type="number"
                  id="category-budget"
                  value={newCategoryData.budget}
                  onChange={(e) => setNewCategoryData({ ...newCategoryData, budget: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddCategoryForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* All Transactions with Filters */}
      {Object.keys(data).length > 0 && (() => {
        // Get all transactions from all months
        let allTransactions = [];
        Object.keys(data).forEach(month => {
          if (Array.isArray(data[month])) {
            allTransactions = allTransactions.concat(data[month]);
          }
        });
        
        // Filter by date range
        if (filterStartDate || filterEndDate) {
          allTransactions = allTransactions.filter(txn => {
            const txnDate = new Date(txn.date);
            if (filterStartDate && txnDate < new Date(filterStartDate)) return false;
            if (filterEndDate && txnDate > new Date(filterEndDate + 'T23:59:59')) return false;
            return true;
          });
        }
        
        // Sort transactions
        allTransactions.sort((a, b) => {
          let comparison = 0;
          
          if (sortBy === 'date') {
            comparison = new Date(a.date) - new Date(b.date);
          } else if (sortBy === 'category') {
            comparison = (a.category || 'Other').localeCompare(b.category || 'Other');
          } else if (sortBy === 'amount') {
            comparison = Math.abs(a.amount) - Math.abs(b.amount);
          }
          
          return sortOrder === 'asc' ? comparison : -comparison;
        });
        
        const totalTransactions = Object.values(data).reduce((sum, txns) => sum + (Array.isArray(txns) ? txns.length : 0), 0);
        
        return (
          <div className="month-transactions-section">
            <div className="transactions-header">
              <h2 className="month-transactions-title">
                All Transactions
              </h2>
              
              {/* Filter and Sort Controls */}
              <div className="transaction-controls">
                <div className="filter-group">
                  <label htmlFor="filter-start-date">From Date:</label>
                  <input
                    type="date"
                    id="filter-start-date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="date-input"
                  />
                </div>
                
                <div className="filter-group">
                  <label htmlFor="filter-end-date">To Date:</label>
                  <input
                    type="date"
                    id="filter-end-date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="date-input"
                  />
                </div>
                
                <div className="filter-group">
                  <label htmlFor="sort-by">Sort By:</label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="date">Date</option>
                    <option value="category">Category</option>
                    <option value="amount">Amount</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label htmlFor="sort-order">Order:</label>
                  <select
                    id="sort-order"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="sort-select"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
                
                {(filterStartDate || filterEndDate) && (
                  <button
                    onClick={() => {
                      setFilterStartDate('');
                      setFilterEndDate('');
                    }}
                    className="btn-clear-filters"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
            
            <div className="transactions-table-container">
              <div className="transactions-count">
                Showing {allTransactions.length} of {totalTransactions} transactions
              </div>
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
                  {allTransactions.length > 0 ? (
                    allTransactions.map((txn) => (
                      <tr key={txn.txn_id} className="transaction-row">
                        <td className="date-cell">{formatDate(txn.date)}</td>
                        <td className="description-cell">{txn.description}</td>
                        <td className="merchant-cell">{txn.merchant || "-"}</td>
                        <td>
                          <span className="category-badge">{txn.category || 'Other'}</span>
                        </td>
                        <td className={`amount-cell ${txn.amount >= 0 ? 'positive' : 'negative'}`}>
                          {txn.amount >= 0 ? '+' : ''}${txn.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-transactions-message">
                        No transactions found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function formatMonthShort(month) {
  const [year, monthNum] = month.split('-');
  const date = new Date(year, parseInt(monthNum) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
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


function formatAmount(amount) {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}k`;
  }
  return amount.toFixed(0);
}

function getCategoryIcon(category) {
  const icons = {
    'Housing': '🏠',
    'Food': '🍔',
    'Entertainment': '🎬',
    'Shopping': '🛍️',
    'Transportation': '🚗',
    'Utilities': '💡',
    'Healthcare': '🏥',
    'Other': '📦'
  };
  return icons[category] || '📦';
}

