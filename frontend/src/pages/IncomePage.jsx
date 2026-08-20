import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TransactionModal from '../components/TransactionModal';
import { 
  TrendingUp, 
  Plus, 
  Download, 
  Edit2, 
  Trash2, 
  Calendar,
  Briefcase,
  CreditCard,
  FileText,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [overview, setOverview] = useState({
    totalIncome: 0,
    averageIncome: 0,
    numberOfTransactions: 0
  });
  const [range, setRange] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  useEffect(() => {
    fetchIncomeData();
  }, [range]);

  const fetchIncomeData = async () => {
    try {
      setLoading(true);
      const [listRes, overviewRes] = await Promise.all([
        api.get(`/income/get?range=${range}`),
        api.get(`/income/overview?range=${range}`)
      ]);

      if (listRes.data.success) {
        setIncomes(listRes.data.data);
      }
      if (overviewRes.data.success) {
        setOverview(overviewRes.data.data);
      }
    } catch (err) {
      console.error("Income fetch error:", err);
      toast.error("Failed to load income data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (formData.id) {
        await api.put(`/income/update/${formData.id}`, formData);
        toast.success("Income record updated");
      } else {
        await api.post("/income/add", formData);
        toast.success("Income record added");
      }
      fetchIncomeData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income entry?")) return;
    try {
      await api.delete(`/income/delete/${id}`);
      toast.success("Income record deleted");
      fetchIncomeData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete record");
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await api.get('/income/downloadExcel', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'income_details.xlsx');
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
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            Income Tracker
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Monitor and organize all your revenue streams.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-2xl font-semibold shadow-sm transition-all text-sm"
          >
            <Download className="w-4 h-4 text-green-600" />
            Export Excel
          </button>

          <button
            onClick={() => { setEditingIncome(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-2xl font-semibold shadow-md transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Income
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Income</p>
            <h3 className="text-2xl font-extrabold text-green-600 mt-2">
              +${(overview.totalIncome || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3.5 bg-green-100 text-green-600 rounded-2xl">
            <DollarSign className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Average Income</p>
            <h3 className="text-2xl font-extrabold text-teal-600 mt-2">
              ${(overview.averageIncome || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3.5 bg-teal-100 text-teal-600 rounded-2xl">
            <Briefcase className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Transactions Count</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-2">
              {overview.numberOfTransactions || 0}
            </h3>
          </div>
          <div className="p-3.5 bg-emerald-100 text-emerald-600 rounded-2xl">
            <CreditCard className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Filters & Income List */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Income History
          </h3>

          <div className="flex bg-gray-100 p-1 rounded-2xl text-xs font-medium">
            {['daily', 'weekly', 'monthly', 'yearly', 'all'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                  range === r ? 'bg-green-600 text-white font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading income records...</div>
        ) : incomes.length > 0 ? (
          <div className="space-y-3">
            {incomes.map((item) => (
              <div
                key={item._id || item.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-green-50/40 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{item.description}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.category} • {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-green-600 text-sm">
                    +${Number(item.amount).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditingIncome(item); setIsModalOpen(true); }}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
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
            No income entries found for this time frame. Click "Add Income" to record new earnings.
          </div>
        )}

      </div>

      {/* Income Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingIncome(null); }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingIncome}
        defaultType="income"
      />

    </div>
  );
};

export default IncomePage;
