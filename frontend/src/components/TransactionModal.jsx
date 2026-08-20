import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Housing', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Other'];

const TransactionModal = ({ isOpen, onClose, onSubmit, initialData = null, defaultType = 'income' }) => {
  const [type, setType] = useState(defaultType);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || defaultType);
      setDescription(initialData.description || '');
      setAmount(initialData.amount || '');
      setCategory(initialData.category || '');
      if (initialData.date) {
        setDate(new Date(initialData.date).toISOString().split('T')[0]);
      }
    } else {
      setType(defaultType);
      setDescription('');
      setAmount('');
      setCategory(defaultType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData, defaultType, isOpen]);

  // Update default category when type changes
  const handleTypeChange = (newType) => {
    setType(newType);
    if (!initialData) {
      setCategory(newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) return;
    try {
      setSubmitting(true);
      await onSubmit({
        id: initialData?._id || initialData?.id,
        type,
        description,
        amount: Number(amount),
        category,
        date
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative border border-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? `Edit ${type === 'income' ? 'Income' : 'Expense'}` : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type selector */}
        {!initialData && (
          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                type === 'income'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Income
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                type === 'expense'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              Expense
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Monthly Salary, Grocery Shopping"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full text-white py-3 rounded-xl font-semibold shadow-md transition-all mt-4 flex items-center justify-center ${
              type === 'income'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
            }`}
          >
            {submitting ? 'Saving...' : initialData ? 'Update Record' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
          </button>
        </form>

      </div>
    </div>
  );
};

export default TransactionModal;
