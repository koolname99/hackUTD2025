const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const Account = require("./models/Account.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Check if email exists in database
app.get("/api/auth/check-email", async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (mongoose.connection.readyState === 1) {
      // Search for account with email in different possible fields
      let account = await Account.findOne({ email: email });
      if (!account) {
        account = await Account.findOne({ "customer.email": email });
      }
      if (!account) {
        account = await Account.findOne({ "auth.email": email });
      }
      
      if (account) {
        return res.json({ exists: true, message: "Email đã được đăng ký" });
      } else {
        return res.json({ exists: false, message: "Email chưa được đăng ký" });
      }
    } else {
      // If MongoDB is not connected, return false
      return res.json({ exists: false, message: "Database not connected" });
    }
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ error: "Failed to check email" });
  }
});

// Mock data for development when MongoDB is not available
const mockTransactions = {
  "2025-01": [
    { txn_id: "1", date: "2025-01-15", description: "Salary", merchant: "Company", category: "Income", amount: 5000 },
    { txn_id: "2", date: "2025-01-20", description: "Rent", merchant: "Landlord", category: "Housing", amount: -1200 },
    { txn_id: "3", date: "2025-01-22", description: "Grocery Store", merchant: "Walmart", category: "Food", amount: -150 },
    { txn_id: "4", date: "2025-01-25", description: "Netflix Subscription", merchant: "Netflix", category: "Entertainment", amount: -15.99 }
  ],
  "2025-02": [
    { txn_id: "5", date: "2025-02-15", description: "Salary", merchant: "Company", category: "Income", amount: 5000 },
    { txn_id: "6", date: "2025-02-20", description: "Rent", merchant: "Landlord", category: "Housing", amount: -1200 },
    { txn_id: "7", date: "2025-02-22", description: "Restaurant", merchant: "Capital One Restaurant", category: "Food", amount: -75 },
    { txn_id: "8", date: "2025-02-23", description: "Shopping", merchant: "Amazon", category: "Shopping", amount: -200 },
    { txn_id: "9", date: "2025-02-25", description: "Movie", merchant: "AMC", category: "Entertainment", amount: -25 }
  ],
  "2025-03": [
    { txn_id: "10", date: "2025-03-15", description: "Salary", merchant: "Company", category: "Income", amount: 5000 },
    { txn_id: "11", date: "2025-03-20", description: "Rent", merchant: "Landlord", category: "Housing", amount: -1200 },
    { txn_id: "12", date: "2025-03-21", description: "Gas Station", merchant: "Shell", category: "Transportation", amount: -60 },
    { txn_id: "13", date: "2025-03-22", description: "Grocery Store", merchant: "Whole Foods", category: "Food", amount: -180 },
    { txn_id: "14", date: "2025-03-24", description: "Electric Bill", merchant: "BofA Utility", category: "Utilities", amount: -120 }
  ],
  "2025-04": [
    { txn_id: "15", date: "2025-04-15", description: "Salary", merchant: "Company", category: "Income", amount: 5000 },
    { txn_id: "16", date: "2025-04-20", description: "Rent", merchant: "Landlord", category: "Housing", amount: -1200 },
    { txn_id: "17", date: "2025-04-22", description: "Doctor Visit", merchant: "Medical Center", category: "Healthcare", amount: -200 },
    { txn_id: "18", date: "2025-04-25", description: "Gym Membership", merchant: "Fitness Club", category: "Personal Care", amount: -50 }
  ],
  "2025-05": [
    { txn_id: "19", date: "2025-05-15", description: "Salary", merchant: "Company", category: "Income", amount: 5000 },
    { txn_id: "20", date: "2025-05-20", description: "Rent", merchant: "Landlord", category: "Housing", amount: -1200 },
    { txn_id: "21", date: "2025-05-22", description: "Car Insurance", merchant: "Insurance Co", category: "Insurance", amount: -150 },
    { txn_id: "22", date: "2025-05-25", description: "Online Course", merchant: "Udemy", category: "Education", amount: -99 }
  ],
  "2025-06": [
    { txn_id: "23", date: "2025-06-15", description: "Salary", merchant: "Company", category: "Income", amount: 5000 },
    { txn_id: "24", date: "2025-06-20", description: "Rent", merchant: "Landlord", category: "Housing", amount: -1200 },
    { txn_id: "25", date: "2025-06-22", description: "Pharmacy", merchant: "CVS", category: "Healthcare", amount: -80 },
    { txn_id: "26", date: "2025-06-25", description: "Haircut", merchant: "Barbershop", category: "Personal Care", amount: -30 }
  ],
  "2025-07": [
    { txn_id: "27", date: "2025-07-15", description: "Salary", merchant: "Company", category: "Income", amount: 5000 },
    { txn_id: "28", date: "2025-07-20", description: "Rent", merchant: "Landlord", category: "Housing", amount: -1200 },
    { txn_id: "29", date: "2025-07-22", description: "Vacation Booking", merchant: "Travel Agency", category: "Travel", amount: -800 },
    { txn_id: "30", date: "2025-07-25", description: "Restaurant", merchant: "Fine Dining", category: "Food", amount: -120 }
  ],
  "2025-08": [
    { txn_id: "31", date: "2025-08-15", description: "Salary", merchant: "Company", category: "Income", amount: 5000 },
    { txn_id: "32", date: "2025-08-20", description: "Rent", merchant: "Landlord", category: "Housing", amount: -1200 },
    { txn_id: "33", date: "2025-08-22", description: "Phone Bill", merchant: "Verizon", category: "Utilities", amount: -100 },
    { txn_id: "34", date: "2025-08-25", description: "Books", merchant: "Bookstore", category: "Education", amount: -75 }
  ],
  "2025-09": [
    { txn_id: "35", date: "2025-09-15", description: "Salary", merchant: "Company", category: "Income", amount: 5000 },
    { txn_id: "36", date: "2025-09-20", description: "Rent", merchant: "Landlord", category: "Housing", amount: -1200 },
    { txn_id: "37", date: "2025-09-22", description: "Health Insurance", merchant: "Insurance Co", category: "Insurance", amount: -300 },
    { txn_id: "38", date: "2025-09-25", description: "Concert Tickets", merchant: "Ticketmaster", category: "Entertainment", amount: -150 }
  ],
  "2025-10": [
    { txn_id: "39", date: "2025-10-15", description: "Salary", merchant: "Company", category: "Income", amount: 5000 },
    { txn_id: "40", date: "2025-10-20", description: "Rent", merchant: "Landlord", category: "Housing", amount: -1200 },
    { txn_id: "41", date: "2025-10-22", description: "Clothing", merchant: "Macy's", category: "Shopping", amount: -250 },
    { txn_id: "42", date: "2025-10-25", description: "Dental Checkup", merchant: "Dental Clinic", category: "Healthcare", amount: -150 }
  ],
  "2025-11": [
    { txn_id: "43", date: "2025-11-05", description: "Rent", merchant: "Landlord", category: "Housing", amount: -1200 },
    { txn_id: "44", date: "2025-11-08", description: "Shopping Spree", merchant: "Amazon", category: "Shopping", amount: -850 }
  ]
};

// Get transactions grouped by month
app.get("/api/transactions", async (req, res) => {
  try {
    const userEmail = req.query.email;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      console.log(`🔍 Searching for account with REAL DATA in database (ignoring email matching)`);
      
      // Find ALL accounts in database
      const allAccounts = await Account.find({});
      console.log(`   - Found ${allAccounts.length} total accounts in database`);
      
      // Find account with actual transactions data
      let account = null;
      let transactions = [];
      
      // Search through all accounts to find one with transactions
      for (const acc of allAccounts) {
        const accObj = acc.toObject ? acc.toObject() : acc;
        let accTransactions = [];
        
        // Check different transaction structures
        if (accObj.transactions && Array.isArray(accObj.transactions) && accObj.transactions.length > 0) {
          accTransactions = accObj.transactions;
        } else if (accObj.transactions && typeof accObj.transactions === 'object' && !Array.isArray(accObj.transactions)) {
          accTransactions = Object.values(accObj.transactions);
        }
        
        if (accTransactions.length > 0) {
          account = acc;
          transactions = accTransactions;
          const accEmail = accObj.email || accObj.customer?.email || accObj.auth?.email || 'unknown';
          console.log(`   ✓ Found account with ${accTransactions.length} transactions (email: ${accEmail})`);
          break;
        }
      }
      
      if (!account || transactions.length === 0) {
        console.log(`   ✗ No account with transactions found in database`);
        return res.json({}); // Return empty data
      }

      // Transactions already extracted above
      console.log(`📊 Using account with REAL DATA from database`);
      console.log(`   - Account ID: ${account._id}`);
      console.log(`   - Transactions count: ${transactions.length}`);
      
      // Log first transaction for debugging
      if (transactions.length > 0) {
        console.log(`   - First transaction sample:`, JSON.stringify(transactions[0]).substring(0, 200));
      }

      // Normalize transaction format for frontend
      let normalizedTransactions = transactions.map((txn, index) => {
        // Handle different transaction formats
        // Handle MongoDB number format ($numberDouble, $numberInt)
        let amount = txn.amount;
        if (amount === null || amount === undefined) {
          amount = 0;
        } else if (typeof amount === 'object' && amount !== null) {
          if (amount.$numberDouble !== undefined) {
            amount = parseFloat(amount.$numberDouble);
          } else if (amount.$numberInt !== undefined) {
            amount = parseInt(amount.$numberInt);
          } else {
            console.log(`   ⚠️  Transaction ${index} has unknown amount format:`, amount);
            amount = 0;
          }
        } else if (typeof amount === 'string') {
          amount = parseFloat(amount) || 0;
        } else if (typeof amount !== 'number') {
          console.log(`   ⚠️  Transaction ${index} has invalid amount type:`, typeof amount, amount);
          amount = 0;
        }
        
        // Preserve original amount for debugging
        const normalizedTxn = {
          txn_id: txn.txn_id || txn.id || txn._id?.toString() || `txn-${Date.now()}-${Math.random()}`,
          date: txn.date || txn.transaction_date || new Date().toISOString().split('T')[0],
          description: txn.description || txn.desc || '',
          merchant: txn.merchant || txn.merchant_name || null,
          category: txn.category || txn.category_name || 'Other',
          amount: amount,
          type: txn.type || (amount >= 0 ? 'credit' : 'debit'),
          running_balance: txn.running_balance || null,
          subscription_id: txn.subscription_id || null
        };
        
        // Log first few transactions for debugging
        if (index < 3) {
          console.log(`   📝 Transaction ${index}: ${normalizedTxn.description} - $${normalizedTxn.amount} (${normalizedTxn.category})`);
        }
        
        return normalizedTxn;
      });

      // ALWAYS use database data - we already found account with transactions
      if (normalizedTransactions.length > 0) {
        const categories = [...new Set(normalizedTransactions.map(t => t.category))];
        const months = [...new Set(normalizedTransactions.map(t => t.date.slice(0, 7)))];
        const sampleAmounts = normalizedTransactions.slice(0, 5).map(t => `${t.category}: $${t.amount}`);
        
        // Calculate totals by category and month for verification
        const categoryTotals = {};
        const monthTotals = {};
        normalizedTransactions.forEach(txn => {
          const cat = txn.category;
          const month = txn.date.slice(0, 7);
          categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(txn.amount);
          monthTotals[month] = (monthTotals[month] || 0) + Math.abs(txn.amount);
        });
        
        console.log(`✓✓✓ Using REAL DATABASE DATA ✓✓✓`);
        console.log(`   - Transactions: ${normalizedTransactions.length}`);
        console.log(`   - Months: ${months.join(', ')}`);
        console.log(`   - Categories: ${categories.join(', ')}`);
        console.log(`   - Sample transactions: ${sampleAmounts.join('; ')}`);
        console.log(`   - Category totals:`, Object.entries(categoryTotals).slice(0, 10).map(([cat, total]) => `${cat}: $${total.toFixed(2)}`).join(', '));
        console.log(`   - Month totals:`, Object.entries(monthTotals).slice(0, 10).map(([month, total]) => `${month}: $${total.toFixed(2)}`).join(', '));
      } else {
        console.log(`   ⚠️  No transactions after normalization`);
        return res.json({});
      }

      // Group transactions by month
    const grouped = {};
      normalizedTransactions.forEach((txn) => {
      const month = txn.date.slice(0, 7); // e.g., "2025-05"
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(txn);
    });

      return res.json(grouped);
    } else {
      // MongoDB not connected, return mock data only for specific user
      if (userEmail === "nguyenquochuy15022007@gmail.com") {
        console.log("⚠️  MongoDB not connected, returning mock data for", userEmail);
        return res.json(mockTransactions);
      } else {
        // Return empty for other users when MongoDB is not connected
        return res.json({});
      }
    }
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Get cards for a user
app.get("/api/cards", async (req, res) => {
  try {
    const userEmail = req.query.email;
    
    if (!userEmail) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (mongoose.connection.readyState === 1) {
      // Find account by email - support multiple formats
      let account = await Account.findOne({ email: userEmail });
      if (!account) {
        account = await Account.findOne({ "customer.email": userEmail });
      }
      if (!account) {
        account = await Account.findOne({ "auth.email": userEmail });
      }
      
      if (!account) {
        // Create new account with empty cards
        account = new Account({
          email: userEmail,
          cards: []
        });
        await account.save();
        return res.json([]);
      }

      // Extract cards from account
      let cards = account.cards || [];
      
      // If account has account object with institution info, create card from it
      if (account.account && !cards.length) {
        cards = [{
          id: account.account.account_id || '1',
          name: account.account.institution || 'Bank',
          balance: account.account.opening_balance || 0,
          type: account.account.type || 'checking'
        }];
      }

      // If this is the specific user, initialize with default cards if none exist
      if (userEmail === "nguyenquochuy15022007@gmail.com" && cards.length === 0) {
        const defaultCards = [
          { id: '1', name: 'Capital One', balance: 3200, type: 'credit' },
          { id: '2', name: 'PNC', balance: 1300, type: 'credit' },
          { id: '3', name: 'Goldman Sachs', balance: 500, type: 'credit' }
        ];
        account.cards = defaultCards;
        await account.save();
        cards = defaultCards;
      }

      return res.json(cards);
    } else {
      // MongoDB not connected, return default cards for specific user
      if (userEmail === "nguyenquochuy15022007@gmail.com") {
        return res.json([
          { id: '1', name: 'Capital One', balance: 3200, type: 'credit' },
          { id: '2', name: 'PNC', balance: 1300, type: 'credit' },
          { id: '3', name: 'Goldman Sachs', balance: 500, type: 'credit' }
        ]);
      }
      return res.json([]);
    }
  } catch (err) {
    console.error("Error fetching cards:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Save cards for a user
app.post("/api/cards", async (req, res) => {
  try {
    const { email, cards } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (mongoose.connection.readyState === 1) {
      let account = await Account.findOne({ email });
      
      if (!account) {
        account = new Account({ email, cards: cards || [] });
      } else {
        account.cards = cards || [];
      }
      
      await account.save();
      return res.json({ success: true, cards: account.cards });
    } else {
      return res.json({ success: true, cards: cards || [] });
    }
  } catch (err) {
    console.error("Error saving cards:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Restore mock data for specific user (admin endpoint)
app.post("/api/restore-mock-data", async (req, res) => {
  try {
    const userEmail = req.body.email || req.query.email;
    
    if (!userEmail) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Only allow for specific user
    if (userEmail !== "nguyenquochuy15022007@gmail.com") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (mongoose.connection.readyState === 1) {
      let account = await Account.findOne({ email: userEmail });
      
      if (!account) {
        account = new Account({ email: userEmail });
      }

      // Force restore mock transactions (always overwrite)
      const allTransactions = [];
      Object.values(mockTransactions).forEach(monthTxns => {
        allTransactions.push(...monthTxns);
      });
      account.transactions = allTransactions;

      // Force restore default cards
      account.cards = [
        { id: '1', name: 'Capital One', balance: 3200, type: 'credit' },
        { id: '2', name: 'PNC', balance: 1300, type: 'credit' },
        { id: '3', name: 'Goldman Sachs', balance: 500, type: 'credit' }
      ];

      // Force restore default subscriptions
      account.subscriptions = [
        { id: '1', name: 'Netflix', amount: 15.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-25' },
        { id: '2', name: 'Spotify', amount: 9.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-20' },
        { id: '3', name: 'Amazon Prime', amount: 14.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-15' }
      ];

      await account.save();
      console.log(`✅ Mock data force restored for ${userEmail} - ${allTransactions.length} transactions`);
      return res.json({ 
        success: true, 
        message: "Mock data restored successfully",
        transactionCount: allTransactions.length
      });
    } else {
      return res.status(500).json({ error: "MongoDB not connected" });
    }
  } catch (err) {
    console.error("Error restoring mock data:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Also support GET for easy browser access - Force restore all data
app.get("/api/restore-mock-data", async (req, res) => {
  try {
    const userEmail = req.query.email || "nguyenquochuy15022007@gmail.com";
    
    if (userEmail !== "nguyenquochuy15022007@gmail.com") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (mongoose.connection.readyState === 1) {
      let account = await Account.findOne({ email: userEmail });
      
      if (!account) {
        account = new Account({ email: userEmail });
      }

      // Force restore ALL mock transactions (complete data)
      const allTransactions = [];
      Object.values(mockTransactions).forEach(monthTxns => {
        allTransactions.push(...monthTxns);
      });
      
      // Ensure we have all 24 transactions
      console.log(`📊 Restoring ${allTransactions.length} transactions from mock data`);
      account.transactions = allTransactions;

      // Force restore default cards
      account.cards = [
        { id: '1', name: 'Capital One', balance: 3200, type: 'credit' },
        { id: '2', name: 'PNC', balance: 1300, type: 'credit' },
        { id: '3', name: 'Goldman Sachs', balance: 500, type: 'credit' }
      ];

      // Force restore default subscriptions
      account.subscriptions = [
        { id: '1', name: 'Netflix', amount: 15.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-25' },
        { id: '2', name: 'Spotify', amount: 9.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-20' },
        { id: '3', name: 'Amazon Prime', amount: 14.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-15' }
      ];

      await account.save();
      
      // Log categories and months for verification
      const categories = [...new Set(allTransactions.map(t => t.category))];
      const months = [...new Set(allTransactions.map(t => t.date.slice(0, 7)))];
      
      console.log(`✅ Mock data force restored via GET for ${userEmail}`);
      console.log(`   - Transactions: ${allTransactions.length}`);
      console.log(`   - Months: ${months.join(', ')}`);
      console.log(`   - Categories: ${categories.join(', ')}`);
      
      return res.json({ 
        success: true, 
        message: "Mock data restored successfully",
        transactionCount: allTransactions.length,
        months: months,
        categories: categories
      });
    } else {
      return res.status(500).json({ error: "MongoDB not connected" });
    }
  } catch (err) {
    console.error("Error restoring mock data:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Get subscriptions for a user
app.get("/api/subscriptions", async (req, res) => {
  try {
    const userEmail = req.query.email;
    
    if (!userEmail) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (mongoose.connection.readyState === 1) {
      // Find account by email - support multiple formats
      let account = await Account.findOne({ email: userEmail });
      if (!account) {
        account = await Account.findOne({ "customer.email": userEmail });
      }
      if (!account) {
        account = await Account.findOne({ "auth.email": userEmail });
      }
      
      if (!account) {
        account = new Account({
          email: userEmail,
          subscriptions: []
        });
        await account.save();
        return res.json([]);
      }

      // Extract subscriptions from account
      let subscriptions = account.subscriptions || [];
      
      // Normalize subscription format for frontend
      const normalizedSubscriptions = subscriptions.map(sub => {
        // Handle different subscription formats
        let amount = sub.amount;
        if (typeof amount === 'object' && amount !== null) {
          if (amount.$numberDouble !== undefined) {
            amount = parseFloat(amount.$numberDouble);
          } else if (amount.$numberInt !== undefined) {
            amount = parseInt(amount.$numberInt);
          } else {
            amount = 0;
          }
        } else if (typeof amount === 'string') {
          amount = parseFloat(amount) || 0;
        } else if (typeof amount !== 'number') {
          amount = 0;
        }
        
        return {
          id: sub.subscription_id || sub.id || sub._id?.toString() || `sub-${Date.now()}-${Math.random()}`,
          name: sub.name || sub.subscription_name || '',
          amount: amount,
          frequency: sub.billing_cycle || sub.frequency || 'monthly',
          status: sub.status || 'active',
          nextRenewal: sub.next_bill_date || sub.nextRenewal || null,
          merchant: sub.merchant || null,
          category: sub.category || null,
          notes: sub.notes || null
        };
      });

      // If this is the specific user, initialize with default subscriptions if none exist
      if (userEmail === "nguyenquochuy15022007@gmail.com" && normalizedSubscriptions.length === 0) {
        const defaultSubscriptions = [
          { id: '1', name: 'Netflix', amount: 15.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-25' },
          { id: '2', name: 'Spotify', amount: 9.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-20' },
          { id: '3', name: 'Amazon Prime', amount: 14.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-15' }
        ];
        account.subscriptions = defaultSubscriptions;
        await account.save();
        return res.json(defaultSubscriptions);
      }

      return res.json(normalizedSubscriptions);
    } else {
      // MongoDB not connected, return default subscriptions for specific user
      if (userEmail === "nguyenquochuy15022007@gmail.com") {
        return res.json([
          { id: '1', name: 'Netflix', amount: 15.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-25' },
          { id: '2', name: 'Spotify', amount: 9.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-20' },
          { id: '3', name: 'Amazon Prime', amount: 14.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-15' }
        ]);
      }
      return res.json([]);
    }
  } catch (err) {
    console.error("Error fetching subscriptions:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Save subscriptions for a user
app.post("/api/subscriptions", async (req, res) => {
  try {
    const { email, subscriptions } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (mongoose.connection.readyState === 1) {
      let account = await Account.findOne({ email });
      
      if (!account) {
        account = new Account({ email, subscriptions: subscriptions || [] });
      } else {
        account.subscriptions = subscriptions || [];
      }
      
      await account.save();
      return res.json({ success: true, subscriptions: account.subscriptions });
    } else {
      return res.json({ success: true, subscriptions: subscriptions || [] });
    }
  } catch (err) {
    console.error("Error saving subscriptions:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Default budgets for November 2025
const defaultBudgetsNovember = {
  "Housing": 3000,
  "Transportation": 200,
  "Dining": 500,
  "Utilities": 100,
  "Entertainment": 100,
  "Groceries": 500,
  "Games": 50,
  "Shopping": 200,
  "Productivity": 30,
  "Learning": 200
};

// Get category budgets for a user
app.get("/api/category-budgets", async (req, res) => {
  try {
    const userEmail = req.query.email;
    
    console.log("📥 GET /api/category-budgets - Email:", userEmail);
    
    if (!userEmail) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (mongoose.connection.readyState === 1) {
      let account = await Account.findOne({ email: userEmail });
      if (!account) {
        account = await Account.findOne({ "customer.email": userEmail });
      }
      if (!account) {
        account = await Account.findOne({ "auth.email": userEmail });
      }
      
      if (!account) {
        // Return default budgets if no account
        console.log("📤 Returning default budgets (no account found)");
        console.log("📤 Default budgets:", JSON.stringify(defaultBudgetsNovember, null, 2));
        return res.json(defaultBudgetsNovember);
      }

      // Return category budgets (flat structure, no month)
      // Format: { "Food": 500, "Housing": 1200 }
      let budgets = account.categoryBudgets || {};
      console.log("📦 Account budgets from DB:", JSON.stringify(budgets, null, 2));
      
      // Handle old format with month structure - convert to flat
      if (budgets["2025-11"]) {
        budgets = budgets["2025-11"];
        console.log("🔄 Converted from month structure to flat");
      }
      
      // If no budgets exist or empty, initialize with defaults
      if (!budgets || Object.keys(budgets).length === 0) {
        console.log("⚠️ No budgets found, initializing with defaults");
        budgets = defaultBudgetsNovember;
        account.categoryBudgets = budgets;
        await account.save();
        console.log("✅ Initialized default budgets");
      } else {
        // Merge defaults with existing budgets (only add missing categories)
        Object.keys(defaultBudgetsNovember).forEach(category => {
          if (budgets[category] === undefined) {
            budgets[category] = defaultBudgetsNovember[category];
          }
        });
        account.categoryBudgets = budgets;
        await account.save();
        console.log("✅ Merged budgets with defaults");
      }
      
      console.log("📤 Returning budgets:", JSON.stringify(budgets, null, 2));
      return res.json(budgets);
    } else {
      // Return default budgets if database not connected
      console.log("📤 Returning default budgets (DB not connected)");
      console.log("📤 Default budgets:", JSON.stringify(defaultBudgetsNovember, null, 2));
      return res.json(defaultBudgetsNovember);
    }
  } catch (err) {
    console.error("❌ Error fetching category budgets:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Save category budgets for a user
app.post("/api/category-budgets", async (req, res) => {
  try {
    const { email, budgets } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Handle old format with month structure - convert to flat
    let flatBudgets = budgets;
    if (budgets && budgets["2025-11"]) {
      flatBudgets = budgets["2025-11"];
      console.log("🔄 Converting save request from month structure to flat");
    }

    if (mongoose.connection.readyState === 1) {
      let account = await Account.findOne({ email });
      if (!account) {
        account = await Account.findOne({ "customer.email": email });
      }
      if (!account) {
        account = await Account.findOne({ "auth.email": email });
      }
      
      if (!account) {
        account = new Account({ email, categoryBudgets: flatBudgets || {} });
      } else {
        account.categoryBudgets = flatBudgets || {};
      }
      
      await account.save();
      console.log("💾 Saved budgets:", JSON.stringify(account.categoryBudgets, null, 2));
      return res.json({ success: true, budgets: account.categoryBudgets });
    } else {
      return res.json({ success: true, budgets: flatBudgets || {} });
    }
  } catch (err) {
    console.error("Error saving category budgets:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Update subscription (renew or unsubscribe)
app.put("/api/subscriptions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, action } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (mongoose.connection.readyState === 1) {
      let account = await Account.findOne({ email });
      
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }

      const subscriptions = account.subscriptions || [];
      const subscriptionIndex = subscriptions.findIndex(sub => sub.id === id);
      
      if (subscriptionIndex === -1) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      if (action === 'renew') {
        const subscription = subscriptions[subscriptionIndex];
        const nextRenewal = new Date();
        if (subscription.frequency === 'monthly') {
          nextRenewal.setMonth(nextRenewal.getMonth() + 1);
        } else if (subscription.frequency === 'yearly') {
          nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
        }
        subscriptions[subscriptionIndex] = {
          ...subscription,
          status: 'active',
          nextRenewal: nextRenewal.toISOString().split('T')[0]
        };
      } else if (action === 'unsubscribe') {
        subscriptions[subscriptionIndex] = {
          ...subscriptions[subscriptionIndex],
          status: 'cancelled'
        };
      }

      account.subscriptions = subscriptions;
      await account.save();
      
      return res.json({ success: true, subscription: subscriptions[subscriptionIndex] });
    } else {
      return res.json({ success: true });
    }
  } catch (err) {
    console.error("Error updating subscription:", err);
    return res.status(500).json({ error: err.message });
  }
});

// AI Chat endpoint using Gemini API
// Gemini AI Chat endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, email } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_MODEL = "gemini-2.5-flash";
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    console.log(`🧠 User (${email}) asked: ${message}`);

    // 1️⃣ Lấy dữ liệu transaction từ backend
    const txnRes = await axios.get(`http://localhost:5000/api/transactions?email=${email}`);
    const groupedData = txnRes.data || {};
    const allTxns = Object.values(groupedData).flat();

    if (allTxns.length === 0) {
      return res.json({ response: "⚠️ No transaction data found for this user." });
    }

    // 2️⃣ Tóm tắt dữ liệu cho Gemini
    const sortedTxns = allTxns.sort((a, b) => new Date(b.date) - new Date(a.date)); // sắp xếp mới nhất trước
const limitedTxns = sortedTxns.slice(0, 200); // lấy 200 giao dịch gần nhất (bao gồm tháng 11)
const summary = limitedTxns
  .map(txn => `${txn.date} | ${txn.category} | ${txn.merchant || "Unknown"} | ${txn.amount}`)
  .join("\n");

    // 3️⃣ Tạo prompt cho Gemini
    const prompt = `
You are a concise and intelligent financial assistant AI.
The user has provided real transaction data for financial insights.

Here is the user's recent transaction data (date | category | merchant | amount):
${summary}

User's question: "${message}"

🎯 Instructions:
- If the user's message is just a greeting (e.g., "hi", "hello", "how are you"), respond naturally and briefly (e.g., "Hello! How can I assist you today?") without analyzing data.
- If the question is about **a specific time period or category**, only analyze **that part** — do NOT repeat old summaries or overall history.
- Keep responses **under 120 words**.
- Use **bullet points and short lines** for readability.
- Keep **only the most relevant data** for the question.
- Avoid repeating monthly averages or long explanations unless the user asks for a summary.
- End with one short, friendly takeaway or tip (e.g., "💡 Tip: Try lowering dining expenses slightly next month.").

✅ Example:
**Question:** "How much did I spend in November?"
**Answer:**  
You spent **$4,742.46 in November 2025**.  
Main categories:  
- 🏠 Housing: $2,550  
- 🍔 Dining: $250  
- 🛒 Shopping: $300  

💡 Tip: Focus on reducing groceries and dining next month.

Now, respond to the user’s question following this concise format.
`;



    // 4️⃣ Gửi đến Gemini API
    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const aiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t generate an answer.";

    console.log("✅ Gemini replied:", aiResponse);
    res.json({ response: aiResponse });
  } catch (err) {
    console.error("❌ Gemini AI error:", err.response?.data || err.message);
    res.status(500).json({
      error: err.message,
      details: err.response?.data || "No response from Gemini API",
    });
  }
});



// MongoDB connection
const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
if (mongoUri) {
mongoose
    .connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      console.log("⚠️  Server will continue with mock data");
    });
} else {
  console.log("⚠️  MONGO_URI/MONGO_URL not set, using mock data");
  console.log("💡 Create a .env file with MONGO_URI=mongodb://localhost:27017/yourdb");
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
