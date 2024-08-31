import { useState, useEffect } from 'react';
import ManualEntryForm from './ManualEntryForm';

const dummyNotifications = [
  { id: 1, store: "Walmart", amount: 52.99, currency: "USD", date: "2023-04-15T10:30:00Z", description: "Groceries" },
  { id: 2, store: "Amazon", amount: 29.99, currency: "GBP", date: "2023-04-14T14:45:00Z", description: "Books" },
  { id: 3, store: "Target", amount: 75.50, currency: "USD", date: "2023-04-13T09:15:00Z", description: "Home decor" },
  { id: 4, store: "Best Buy", amount: 199.99, currency: "USD", date: "2023-04-12T16:20:00Z", description: "Electronics" },
  { id: 5, store: "Starbucks", amount: 5.75, currency: "EUR", date: "2023-04-11T08:00:00Z", description: "Coffee" },
  { id: 6, store: "Shoprite Nigeria", amount: 15000, currency: "NGN", date: "2023-04-10T12:30:00Z", description: "Groceries" },
  { id: 7, store: "Jumia Nigeria", amount: 22500, currency: "NGN", date: "2023-04-09T15:45:00Z", description: "Electronics" },
];

const monthlyBudget = 1000;
const exchangeRates = { USD: 0.72, EUR: 0.86, GBP: 1, NGN: 0.0017 };

function NotificationList() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [totalSpent, setTotalSpent] = useState(0);
  const [remaining, setRemaining] = useState(monthlyBudget);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    calculateTotals();
  }, [notifications]);

  const calculateTotals = () => {
    const spent = notifications.reduce((sum, notification) => {
      const amountInGBP = notification.amount * exchangeRates[notification.currency];
      return sum + amountInGBP;
    }, 0);
    setTotalSpent(spent);
    setRemaining(monthlyBudget - spent);
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency }).format(amount);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newNotification = {
          id: notifications.length + 1,
          store: "Uploaded Receipt",
          amount: Math.random() * 100,
          currency: "GBP",
          date: new Date().toISOString(),
          image: e.target.result,
          description: "Uploaded receipt"
        };
        setNotifications([...notifications, newNotification]);
      };
      reader.readAsDataURL(file);
    }
  };

  const addManualEntry = (entry) => {
    const newNotification = {
      id: notifications.length + 1,
      ...entry,
      date: new Date().toISOString()
    };
    setNotifications([...notifications, newNotification]);
    setShowManualEntry(false);
  };

  const updateEntry = (updatedEntry) => {
    setNotifications(notifications.map(n => n.id === updatedEntry.id ? updatedEntry : n));
    setEditingId(null);
  };

  const deleteEntry = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    const searchLower = searchTerm.toLowerCase();
    const storeName = notification.store.toLowerCase();
    const description = notification.description.toLowerCase();
    const amount = notification.amount.toString();
    const date = new Date(notification.date).toLocaleDateString();
    
    return storeName.includes(searchLower) || 
           description.includes(searchLower) || 
           amount.includes(searchLower) ||
           date.includes(searchLower);
  });

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Budget Tracker</h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Monthly Budget</h2>
          <p className="text-2xl font-bold">{formatCurrency(monthlyBudget, 'GBP')}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Remaining</h2>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(remaining, 'GBP')}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Spent</h2>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSpent, 'GBP')}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${(totalSpent / monthlyBudget) * 100}%`}}></div>
          </div>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        <button
          onClick={() => setShowManualEntry(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Manual Entry
        </button>
      </div>

      {/* Update search input placeholder */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by store, description, amount, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {showManualEntry && (
        <ManualEntryForm 
          onSubmit={addManualEntry} 
          onCancel={() => setShowManualEntry(false)} 
        />
      )}
      <h2 className="text-xl font-bold mb-2">Recent Transactions</h2>
      <ul className="space-y-4">
        {filteredNotifications.map((notification) => {
          const amountInGBP = notification.amount * exchangeRates[notification.currency];
          return (
            <li key={notification.id} className="bg-white shadow rounded-lg p-4">
              {editingId === notification.id ? (
                <ManualEntryForm
                  initialEntry={notification}
                  onSubmit={updateEntry}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{notification.store}</p>
                    <p className="text-gray-600">
                      {formatCurrency(notification.amount, notification.currency)}
                      {notification.currency !== 'GBP' && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({formatCurrency(amountInGBP, 'GBP')})
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.date).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{notification.description}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    {notification.image && (
                      <img
                        src={notification.image}
                        alt="Receipt"
                        className="mb-2 w-20 h-20 object-cover cursor-pointer"
                        onClick={() => window.open(notification.image, '_blank')}
                      />
                    )}
                    <div>
                      <button
                        onClick={() => setEditingId(notification.id)}
                        className="mr-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEntry(notification.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default NotificationList;