import { useState, useEffect } from 'react';

function ManualEntryForm({ onSubmit, onCancel, initialEntry = null }) {
  const [entry, setEntry] = useState({
    store: '',
    amount: '',
    currency: 'GBP',
    date: new Date().toISOString().split('T')[0],
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
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
          Date
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="date"
          type="date"
          value={entry.date}
          onChange={(e) => setEntry({ ...entry, date: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-gray-700 text-sm font-bold">
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              type="text"
              placeholder="Product name"
              value={product.name}
              onChange={(e) => updateSubProduct(index, 'name', e.target.value)}
              required
            />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
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