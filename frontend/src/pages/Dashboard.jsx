import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import TransactionModal from '../components/TransactionModal';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Plus, 
  PieChart as PieChartIcon, 
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Edit2
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#0d9488', '#f97316', '#0891b2', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    savings: 0,
    recentTransactions: [],
    categoryData: [],
    range: 'monthly'
  });
  const [range, setRange] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    fetchDashboardData(range);
  }, [range]);

  const fetchDashboardData = async (selectedRange) => {
    try {
      setLoading(true);
      const res = await api.get(`/dashboard/overview?range=${selectedRange}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      const endpoint = formData.type === 'income' ? '/income' : '/expense';
      if (formData.id) {
        await api.put(`${endpoint}/update/${formData.id}`, formData);
        toast.success(`${formData.type === 'income' ? 'Income' : 'Expense'} updated`);
      } else {
        await api.post(`${endpoint}/add`, formData);
        toast.success(`${formData.type === 'income' ? 'Income' : 'Expense'} added`);
      }
      fetchDashboardData(range);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const endpoint = type === 'income' ? '/income' : '/expense';
      await api.delete(`${endpoint}/delete/${id}`);
      toast.success('Record deleted');
      fetchDashboardData(range);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete record');
    }
  };

  const comparisonData = [
    { name: 'Income', amount: data.totalIncome },
    { name: 'Expense', amount: data.totalExpense },
    { name: 'Savings', amount: data.savings },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-emerald-500/10 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-teal-700 to-cyan-800 bg-clip-text text-transparent">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Here's your financial summary overview.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Time range selector */}
          <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-sm text-xs font-medium">
            {['daily', 'weekly', 'monthly', 'yearly', 'all'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                  range === r ? 'bg-teal-500 text-white font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-2xl font-semibold shadow-md transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Balance */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Balance</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-2">
              ${data.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
              Net Balance
            </span>
          </div>
          <div className="p-3.5 bg-teal-100 text-teal-600 rounded-2xl">
            <Wallet className="w-7 h-7" />
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Income</p>
            <h3 className="text-2xl font-extrabold text-green-600 mt-2">
              +${data.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
              Earnings
            </span>
          </div>
          <div className="p-3.5 bg-green-100 text-green-600 rounded-2xl">
            <TrendingUp className="w-7 h-7" />
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Expense</p>
            <h3 className="text-2xl font-extrabold text-orange-600 mt-2">
              -${data.totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
              Spent
            </span>
          </div>
          <div className="p-3.5 bg-orange-100 text-orange-600 rounded-2xl">
            <TrendingDown className="w-7 h-7" />
          </div>
        </div>

        {/* Savings */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Savings</p>
            <h3 className="text-2xl font-extrabold text-cyan-600 mt-2">
              ${data.savings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700">
              Retained
            </span>
          </div>
          <div className="p-3.5 bg-cyan-100 text-cyan-600 rounded-2xl">
            <PiggyBank className="w-7 h-7" />
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown Donut Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-teal-600" />
              Expense Categories
            </h3>
          </div>
          {data.categoryData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              No expense category data for this period.
            </div>
          )}
        </div>

        {/* Financial Comparison Bar Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-600" />
              Financial Breakdown
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  <Cell fill="#10b981" />
                  <Cell fill="#f97316" />
                  <Cell fill="#0891b2" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            Recent Transactions
          </h3>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading transactions...</div>
        ) : data.recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {data.recentTransactions.map((tx) => (
              <div
                key={tx._id || tx.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50/80 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    {tx.type === 'income' ? (
                      <ArrowUpRight className="w-5 h-5" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{tx.description}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {tx.category} • {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`font-bold text-sm ${
                      tx.type === 'income' ? 'text-green-600' : 'text-orange-600'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingTransaction(tx); setIsModalOpen(true); }}
                      className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tx._id || tx.id, tx.type)}
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
            No recent transactions. Click "Add New" to record your first income or expense.
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingTransaction}
        defaultType="income"
      />

    </div>
  );
};

export default Dashboard;
