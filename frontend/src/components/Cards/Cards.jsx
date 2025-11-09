import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import capitalOneLogo from '../../assets/Capital_One-Logo.wine.png';
import pncLogo from '../../assets/PNC-Bank-logo.png';
import './Cards.css';

export default function Cards() {
  const { user } = useAuth0();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    type: 'credit',
    expireDate: '',
    accountNumber: ''
  });

  useEffect(() => {
    if (!user?.email) return;

    // Fetch cards from backend
    axios.get('http://localhost:5000/api/cards', {
      params: { email: user.email }
    })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCards(res.data);
        } else {
          // Initialize with default cards for specific user
          if (user.email === 'nguyenquochuy15022007@gmail.com') {
            const defaultCards = [
              { id: '1', name: 'Capital One', balance: 3200, type: 'credit' },
              { id: '2', name: 'PNC', balance: 1800, type: 'credit' },
              { id: '3', name: 'Golden Sachs', balance: 2500, type: 'credit' }
            ];
            setCards(defaultCards);
            // Save to backend
            axios.post('http://localhost:5000/api/cards', {
              email: user.email,
              cards: defaultCards
            });
          } else {
            setCards([]);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching cards:', error);
        // Use default cards for specific user
        if (user.email === 'nguyenquochuy15022007@gmail.com') {
          const defaultCards = [
            { id: '1', name: 'Capital One', balance: 3200, type: 'credit' },
            { id: '2', name: 'PNC', balance: 1300, type: 'credit' },
            { id: '3', name: 'Goldman Sachs', balance: 500, type: 'credit' }
          ];
          setCards(defaultCards);
        }
        setLoading(false);
      });
  }, [user?.email]);

  const handleAddCard = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cardNumber || !formData.expireDate || !formData.accountNumber) {
      alert('Please fill in all required fields');
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      name: formData.name,
      cardNumber: formData.cardNumber,
      balance: 0, // Default balance
      type: formData.type,
      expireDate: formData.expireDate,
      accountNumber: formData.accountNumber
    };

    const updatedCards = [...cards, newCard];

    try {
      // Save to backend
      await axios.post('http://localhost:5000/api/cards', {
        email: user.email,
        cards: updatedCards
      });
      
      setCards(updatedCards);
      setFormData({ name: '', cardNumber: '', type: 'credit', expireDate: '', accountNumber: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding card:', error);
      alert('Failed to add card. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="cards-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cards-container">
      <button className="btn-add-card" onClick={() => setShowForm(true)}>
        + Add Card
      </button>
      <div className="cards-header">
        <h1 className="cards-title">My Cards</h1>
      </div>

      {showForm && (
        <div className="form-overlay" onClick={() => setShowForm(false)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h2>Add New Card</h2>
              <button className="btn-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleAddCard} className="card-form">
              <div className="form-group">
                <label htmlFor="card-name">Card/Bank Name *</label>
                <input
                  type="text"
                  id="card-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Capital One, PNC, Chase"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="card-number">Credit Card Number *</label>
                <input
                  type="text"
                  id="card-number"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="card-type">Card Type *</label>
                <select
                  id="card-type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="expire-date">Expire Date *</label>
                <input
                  type="text"
                  id="expire-date"
                  value={formData.expireDate}
                  onChange={(e) => setFormData({ ...formData, expireDate: e.target.value })}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="account-number">Account Number (Bank) *</label>
                <input
                  type="text"
                  id="account-number"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="Account series in the bank"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cards.length === 0 ? (
        <div className="no-cards">
          <p>No cards added yet. Add your first card to get started.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {cards.map((card) => {
            // Get card gradient based on card name
            const getCardGradient = (cardName) => {
              if (cardName.toLowerCase().includes('capital')) {
                return 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';
              } else if (cardName.toLowerCase().includes('pnc')) {
                return 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)';
              } else if (cardName.toLowerCase().includes('golden') || cardName.toLowerCase().includes('sachs')) {
                return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
              } else {
                return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              }
            };

            // Generate masked card number
            const displayCardNumber = card.cardNumber 
              ? '**** **** **** ' + card.cardNumber.slice(-4).replace(/\s/g, '')
              : '**** **** **** ' + (card.id || '1234');
            
            // Get card logo/icon
            const getCardLogo = (cardName) => {
              if (cardName.toLowerCase().includes('capital')) {
                return <img src={capitalOneLogo} alt="Capital One" className="card-logo-img" />;
              } else if (cardName.toLowerCase().includes('pnc')) {
                return <img src={pncLogo} alt="PNC" className="card-logo-img" />;
              } else if (cardName.toLowerCase().includes('goldman') || cardName.toLowerCase().includes('sachs')) {
                return (
                  <div className="goldman-sachs-logo">
                    <div className="gs-circle gs-circle-1"></div>
                    <div className="gs-circle gs-circle-2"></div>
                  </div>
                );
              }
              return '💳';
            };

            return (
              <div key={card.id} className="credit-card" style={{ background: getCardGradient(card.name) }}>
                <div className="card-top">
                  <div className="card-chip">
                    <div className="chip-inner"></div>
                  </div>
                  <div className="card-logo">{getCardLogo(card.name)}</div>
                </div>
                <div className="card-number">{displayCardNumber}</div>
                <div className="card-bottom">
                  <div className="card-info">
                    <div className="card-holder">
                      <span className="label">CARDHOLDER</span>
                      <span className="value">{card.name.toUpperCase()}</span>
                    </div>
                    <div className="card-expiry">
                      <span className="label">EXPIRES</span>
                      <span className="value">{card.expireDate || '12/25'}</span>
                    </div>
                  </div>
                  <div className="card-balance-display">
                    <span className="balance-label">Balance</span>
                    <span className="balance-value">${card.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

