import { useState, useEffect, useMemo } from 'react';
import ManualEntryForm from './ManualEntryForm';
import TransactionModal from './TransactionModal';
import Modal from './Modal';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { formatDateToHumanReadable } from '../utils/dateUtils';
import { dummyNotifications } from '../dummyData';

const monthlyBudget = 1000;
const exchangeRates = { USD: 0.72, EUR: 0.86, GBP: 1, NGN: 0.0017, YEN: 0.006 };

function NotificationList() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [totalSpent, setTotalSpent] = useState(0);
  const [remaining, setRemaining] = useState(monthlyBudget);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [expandedMonths, setExpandedMonths] = useState({});

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
    const date = formatDateToHumanReadable(notification.date);

    return storeName.includes(searchLower) ||
           description.includes(searchLower) ||
           amount.includes(searchLower) ||
           date.includes(searchLower);
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return '';
  };

  const openTransactionModal = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeTransactionModal = () => {
    setSelectedTransaction(null);
  };

  const prepareEntryForEdit = (notification) => {
    if (!notification) {
      console.error('Notification not found');
      return null;
    }
    console.log('Preparing entry for edit:', notification);
    // If the notification doesn't have subProducts, create them from the description
    if (!notification.subProducts) {
      const subProducts = notification.description.split(', ').map(item => {
        const [name, price] = item.split(': ');
        return { name, price: parseFloat(price) };
      });
      return { ...notification, subProducts };
    }
    return notification;
  };

  const toggleMonth = (year, month) => {
    setExpandedMonths(prev => ({
      ...prev,
      [`${year}-${month}`]: !prev[`${year}-${month}`]
    }));
  };

  const groupedNotifications = useMemo(() => {
    const grouped = sortedNotifications.reduce((acc, notification) => {
      const date = new Date(notification.date);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (!acc[year]) {
        acc[year] = { months: {}, total: 0 };
      }
      if (!acc[year].months[month]) {
        acc[year].months[month] = { transactions: [], total: 0 };
      }

      const amountInGBP = notification.amount * exchangeRates[notification.currency];
      acc[year].months[month].transactions.push(notification);
      acc[year].months[month].total += amountInGBP;
      acc[year].total += amountInGBP;

      return acc;
    }, {});

    return grouped;
  }, [sortedNotifications, exchangeRates]);

  return (
    <div className="max-w-[90%] mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Budget Tracker</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Monthly Budget</h2>
          <p className="text-xl sm:text-2xl font-bold">{formatCurrency(monthlyBudget, 'GBP')}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Remaining</h2>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{formatCurrency(remaining, 'GBP')}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Spent</h2>
          <p className="text-xl sm:text-2xl font-bold text-red-600">{formatCurrency(totalSpent, 'GBP')}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${(totalSpent / monthlyBudget) * 100}%`}}></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
        <div className="flex-1">
          <label htmlFor="file-upload" className="flex items-center justify-center w-full h-12 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
            <span className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="font-medium text-gray-600">
                Upload Receipt
              </span>
            </span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
        <button
          onClick={() => setShowManualEntry(true)}
          className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Manual Entry
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by store, description, amount, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Modal isOpen={showManualEntry} onClose={() => setShowManualEntry(false)}>
        <ManualEntryForm
          onSubmit={(entry) => {
            addManualEntry(entry);
            setShowManualEntry(false);
          }}
          onCancel={() => setShowManualEntry(false)}
        />
      </Modal>

      <h2 className="text-xl sm:text-2xl font-bold mb-2">Transactions</h2>
      <div className="w-[90%] mx-auto overflow-x-auto">
        {Object.entries(groupedNotifications).map(([year, yearData]) => (
          <div key={year} className="mb-6">
            <div className="flex justify-between items-center mb-2 bg-gray-100 p-2 rounded-md">
              <h3 className="text-lg font-semibold">{year}</h3>
              <span className="font-semibold">{formatCurrency(yearData.total, 'GBP')}</span>
            </div>
            {Object.entries(yearData.months).map(([month, monthData]) => {
              const isExpanded = expandedMonths[`${year}-${month}`] !== false;
              const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
              return (
                <div key={`${year}-${month}`} className="mb-4">
                  <button
                    onClick={() => toggleMonth(year, month)}
                    className="flex justify-between items-center w-full bg-gray-50 p-2 rounded-md mb-2"
                  >
                    <div className="flex items-center">
                      {isExpanded ? (
                        <ChevronDownIcon className="h-5 w-5 mr-2" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5 mr-2" />
                      )}
                      <span>{monthName}</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(monthData.total, 'GBP')}</span>
                  </button>
                  {isExpanded && (
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('store')}>
                            Store {getSortIndicator('store')}
                          </th>
                          <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('amount')}>
                            Amount {getSortIndicator('amount')}
                          </th>
                          <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('date')}>
                            Date {getSortIndicator('date')}
                          </th>
                          <th className="px-4 py-2">Description</th>
                          <th className="px-4 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthData.transactions.map((notification) => {
                          const amountInGBP = notification.amount * exchangeRates[notification.currency];
                          return (
                            <tr key={notification.id} className="border-b" onClick={() => openTransactionModal(notification)}>
                              <td className="px-4 py-2">{notification.store}</td>
                              <td className="px-4 py-2">
                                {formatCurrency(notification.amount, notification.currency)}
                                {notification.currency !== 'GBP' && (
                                  <span className="ml-2 text-sm text-gray-500">
                                    ({formatCurrency(amountInGBP, 'GBP')})
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2">{formatDateToHumanReadable(notification.date)}</td>
                              <td className="px-4 py-2">{notification.description}</td>
                              <td className="px-4 py-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingId(notification.id);
                                  }}
                                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteEntry(notification.id);
                                  }}
                                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <TransactionModal
        transaction={selectedTransaction}
        onClose={closeTransactionModal}
        formatCurrency={formatCurrency}
      />
      <Modal isOpen={editingId !== null} onClose={() => setEditingId(null)}>
        {editingId !== null && (
          <ManualEntryForm
            initialEntry={prepareEntryForEdit(notifications.find(n => n.id === editingId))}
            onSubmit={(updatedEntry) => {
              updateEntry(updatedEntry);
              setEditingId(null);
            }}
            onCancel={() => setEditingId(null)}
          />
        )}
      </Modal>
    </div>
  );
}

export default NotificationList;
