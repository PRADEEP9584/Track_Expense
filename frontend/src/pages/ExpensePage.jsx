import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TransactionModal from '../components/TransactionModal';
import { 
  TrendingDown, 
  Plus, 
  Download, 
  Edit2, 
  Trash2, 
  Calendar,
  ShoppingBag,
  CreditCard,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [overview, setOverview] = useState({
    totalExpense: 0,
    averageExpense: 0,
    numberOfTransactions: 0
  });
  const [range, setRange] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchExpenseData();
  }, [range]);

  const fetchExpenseData = async () => {
    try {
      setLoading(true);
      const [listRes, overviewRes] = await Promise.all([
        api.get(`/expense/get?range=${range}`),
        api.get(`/expense/overview?range=${range}`)
      ]);

      if (listRes.data.success) {
        setExpenses(listRes.data.data);
      }
      if (overviewRes.data.success) {
        setOverview(overviewRes.data.data);
      }
    } catch (err) {
      console.error("Expense fetch error:", err);
      toast.error("Failed to load expense data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (formData.id) {
        await api.put(`/expense/update/${formData.id}`, formData);
        toast.success("Expense record updated");
      } else {
        await api.post("/expense/add", formData);
        toast.success("Expense record added");
      }
      fetchExpenseData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense entry?")) return;
    try {
      await api.delete(`/expense/delete/${id}`);
      toast.success("Expense record deleted");
      fetchExpenseData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete record");
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await api.get('/expense/downloadExcel', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Excel file downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel file");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <TrendingDown className="w-8 h-8 text-orange-600" />
            Expense Tracker
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Keep full control of your daily and monthly spendings.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-2xl font-semibold shadow-sm transition-all text-sm"
          >
            <Download className="w-4 h-4 text-orange-600" />
            Export Excel
          </button>

          <button
            onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2.5 rounded-2xl font-semibold shadow-md transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Expense</p>
            <h3 className="text-2xl font-extrabold text-orange-600 mt-2">
              -${(overview.totalExpense || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3.5 bg-orange-100 text-orange-600 rounded-2xl">
            <DollarSign className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Average Expense</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-2">
              ${(overview.averageExpense || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3.5 bg-amber-100 text-amber-600 rounded-2xl">
            <ShoppingBag className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Transactions Count</p>
            <h3 className="text-2xl font-extrabold text-yellow-600 mt-2">
              {overview.numberOfTransactions || 0}
            </h3>
          </div>
          <div className="p-3.5 bg-yellow-100 text-yellow-600 rounded-2xl">
            <CreditCard className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Filters & Expense List */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            Expense History
          </h3>

          <div className="flex bg-gray-100 p-1 rounded-2xl text-xs font-medium">
            {['daily', 'weekly', 'monthly', 'yearly', 'all'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                  range === r ? 'bg-orange-500 text-white font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading expense records...</div>
        ) : expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.map((item) => (
              <div
                key={item._id || item.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-orange-50/40 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{item.description}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.category} • {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-orange-600 text-sm">
                    -${Number(item.amount).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingExpense(item); setIsModalOpen(true); }}
                      className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id || item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            No expense records found for this time frame. Click "Add Expense" to log spendings.
          </div>
        )}

      </div>

      {/* Expense Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingExpense(null); }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingExpense}
        defaultType="expense"
      />

    </div>
  );
};

export default ExpensePage;
