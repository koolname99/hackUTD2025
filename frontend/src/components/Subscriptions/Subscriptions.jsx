import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import './Subscriptions.css';

export default function Subscriptions() {
  const { user } = useAuth0();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    // Fetch subscriptions from backend
    axios.get('http://localhost:5000/api/subscriptions', {
      params: { email: user.email }
    })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setSubscriptions(res.data);
        } else {
          // Initialize with default subscriptions for specific user
          if (user.email === 'nguyenquochuy15022007@gmail.com') {
            const defaultSubscriptions = [
              { id: '1', name: 'Netflix', amount: 15.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-25' },
              { id: '2', name: 'Spotify', amount: 9.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-20' },
              { id: '3', name: 'Amazon Prime', amount: 14.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-15' }
            ];
            setSubscriptions(defaultSubscriptions);
            // Save to backend
            axios.post('http://localhost:5000/api/subscriptions', {
              email: user.email,
              subscriptions: defaultSubscriptions
            });
          } else {
            setSubscriptions([]);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching subscriptions:', error);
        // Use default subscriptions for specific user
        if (user.email === 'nguyenquochuy15022007@gmail.com') {
          const defaultSubscriptions = [
            { id: '1', name: 'Netflix', amount: 15.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-25' },
            { id: '2', name: 'Spotify', amount: 9.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-20' },
            { id: '3', name: 'Amazon Prime', amount: 14.99, frequency: 'monthly', status: 'active', nextRenewal: '2025-12-15' }
          ];
          setSubscriptions(defaultSubscriptions);
        }
        setLoading(false);
      });
  }, [user?.email]);

  const handleRenew = async (subscriptionId) => {
    try {
      await axios.put(`http://localhost:5000/api/subscriptions/${subscriptionId}`, {
        email: user.email,
        action: 'renew'
      });
      
      // Update local state
      setSubscriptions(prev => prev.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, status: 'active', nextRenewal: getNextRenewalDate(sub.frequency) }
          : sub
      ));
    } catch (error) {
      console.error('Error renewing subscription:', error);
    }
  };

  const handleUnsubscribe = async (subscriptionId) => {
    try {
      await axios.put(`http://localhost:5000/api/subscriptions/${subscriptionId}`, {
        email: user.email,
        action: 'unsubscribe'
      });
      
      // Update local state
      setSubscriptions(prev => prev.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, status: 'cancelled' }
          : sub
      ));
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  };

  const getNextRenewalDate = (frequency) => {
    const date = new Date();
    if (frequency === 'monthly') {
      date.setMonth(date.getMonth() + 1);
    } else if (frequency === 'yearly') {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date.toISOString().split('T')[0];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const totalMonthly = subscriptions
    .filter(sub => sub.status === 'active' && sub.frequency === 'monthly')
    .reduce((sum, sub) => sum + sub.amount, 0);

  const totalYearly = subscriptions
    .filter(sub => sub.status === 'active' && sub.frequency === 'yearly')
    .reduce((sum, sub) => sum + sub.amount, 0);

  if (loading) {
    return (
      <div className="subscriptions-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="subscriptions-container">
      <div className="subscriptions-header">
        <h1 className="subscriptions-title">My Subscriptions</h1>
        <div className="subscriptions-summary">
          <div className="summary-item">
            <span className="summary-label">Monthly Total</span>
            <span className="summary-amount">${totalMonthly.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Yearly Total</span>
            <span className="summary-amount">${totalYearly.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <div className="no-subscriptions">
          <p>No subscriptions found. Add your first subscription to track recurring payments.</p>
        </div>
      ) : (
        <div className="subscriptions-list">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className={`subscription-item ${subscription.status === 'cancelled' ? 'cancelled' : ''}`}>
              <div className="subscription-info">
                <div className="subscription-header">
                  <h3 className="subscription-name">{subscription.name}</h3>
                  <span className={`subscription-status ${subscription.status}`}>
                    {subscription.status === 'active' ? 'Active' : 'Cancelled'}
                  </span>
                </div>
                <div className="subscription-details">
                  <div className="detail-item">
                    <span className="detail-label">Amount</span>
                    <span className="detail-value">${subscription.amount.toFixed(2)}/{subscription.frequency === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  {subscription.status === 'active' && subscription.nextRenewal && (
                    <div className="detail-item">
                      <span className="detail-label">Next Renewal</span>
                      <span className="detail-value">{formatDate(subscription.nextRenewal)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="subscription-actions">
                {subscription.status === 'active' ? (
                  <button
                    onClick={() => handleUnsubscribe(subscription.id)}
                    className="action-btn unsubscribe-btn"
                  >
                    Unsubscribe
                  </button>
                ) : (
                  <button
                    onClick={() => handleRenew(subscription.id)}
                    className="action-btn renew-btn"
                  >
                    Renew
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


