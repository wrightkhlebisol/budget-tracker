import { useState, useEffect } from 'react';

function ManualEntryForm({ onSubmit, onCancel, initialEntry = null }) {
  const [entry, setEntry] = useState(initialEntry || { 
    store: '', 
    amount: '', 
    currency: 'GBP', 
    description: ''
  });

  useEffect(() => {
    if (initialEntry) {
      setEntry(initialEntry);
    }
  }, [initialEntry]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(entry);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="store">
          Store
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="store"
          type="text"
          placeholder="Store name"
          value={entry.store}
          onChange={(e) => setEntry({ ...entry, store: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
          Amount
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="amount"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={entry.amount}
          onChange={(e) => setEntry({ ...entry, amount: parseFloat(e.target.value) })}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currency">
          Currency
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="currency"
          value={entry.currency}
          onChange={(e) => setEntry({ ...entry, currency: e.target.value })}
        >
          <option value="GBP">GBP</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="NGN">NGN</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          placeholder="Transaction description"
          value={entry.description}
          onChange={(e) => setEntry({ ...entry, description: e.target.value })}
          rows="3"
        ></textarea>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {initialEntry ? 'Update Entry' : 'Add Entry'}
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ManualEntryForm;