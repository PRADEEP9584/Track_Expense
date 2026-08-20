import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, ShieldCheck, KeyRound, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, updatePassword } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPass, setUpdatingPass] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      await updateProfile(name, email);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    try {
      setUpdatingPass(true);
      await updatePassword(currentPassword, newPassword);
      toast.success("Password updated successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update password");
    } finally {
      setUpdatingPass(false);
    }
  };

  const getInitials = (n) => {
    if (!n) return 'U';
    return n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      
      {/* User Header Card */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-8 text-center text-white shadow-lg relative overflow-hidden">
        <div className="w-24 h-24 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-extrabold text-white shadow-inner mb-4">
          {getInitials(user?.name)}
        </div>
        <h2 className="text-2xl font-bold">{user?.name || 'User Profile'}</h2>
        <p className="text-teal-100 text-sm mt-1">{user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Settings */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="p-2 bg-teal-100 text-teal-600 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={updatingProfile}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2 text-sm mt-2"
            >
              {updatingProfile ? 'Saving...' : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Security & Password</h3>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={updatingPass}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2 text-sm mt-2"
            >
              {updatingPass ? 'Updating...' : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Update Password
                </>
              )}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
