import { useState, useEffect } from 'react';

function ManualEntryForm({ onSubmit, onCancel, initialEntry = null }) {
  const [entry, setEntry] = useState({
    store: '',
    amount: '',
    currency: 'GBP',
    date: new Date().toLocaleDateString(),
    subProducts: [{ name: '', price: '' }]
  });

  useEffect(() => {
    console.log('Initial entry:', initialEntry);
    if (initialEntry) {
      setEntry({
        ...initialEntry,
        subProducts: initialEntry.subProducts || [{ name: '', price: '' }],
        date: initialEntry.date ? initialEntry.date.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [initialEntry]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalAmount = entry.subProducts.reduce((sum, product) => sum + Number(product.price), 0);
    const description = entry.subProducts.map(product => `${product.name}: ${product.price}`).join(', ');
    onSubmit({ ...entry, amount: totalAmount, description });
  };

  const addSubProduct = () => {
    setEntry({ ...entry, subProducts: [...entry.subProducts, { name: '', price: '' }] });
  };

  const removeSubProduct = (index) => {
    const updatedSubProducts = entry.subProducts.filter((_, i) => i !== index);
    setEntry({ ...entry, subProducts: updatedSubProducts });
  };

  const updateSubProduct = (index, field, value) => {
    const updatedSubProducts = entry.subProducts.map((product, i) =>
      i === index ? { ...product, [field]: value } : product
    );
    setEntry({ ...entry, subProducts: updatedSubProducts });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="store" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Store</label>
        <input
          className="mt-1 appearance-none border leading-tight focus:outline-none focus:shadow-outline block w-full py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          id="store"
          type="text"
          placeholder="Store name"
          value={entry.store}
          onChange={(e) => setEntry({ ...entry, store: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" htmlFor="currency">
          Currency
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="date">
          Date
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          id="date"
          type="date"
          value={entry.date}
          onChange={(e) => setEntry({ ...entry, date: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold">
            Sub Products
          </label>
          <button
            type="button"
            onClick={addSubProduct}
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        {entry.subProducts.map((product, index) => (
          <div key={index} className="flex mb-2 items-center">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              type="text"
              placeholder="Product name"
              value={product.name}
              onChange={(e) => updateSubProduct(index, 'name', e.target.value)}
              required
            />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              type="number"
              step="0.01"
              placeholder="Price"
              value={product.price}
              onChange={(e) => updateSubProduct(index, 'price', e.target.value)}
              required
            />
            {entry.subProducts.length > 1 && (
              <button
                type="button"
                onClick={() => removeSubProduct(index)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialEntry ? 'Update' : 'Add'} Entry
        </button>
      </div>
    </form>
  );
}

export default ManualEntryForm;
