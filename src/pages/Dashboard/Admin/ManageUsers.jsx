import { useState, useEffect } from 'react';
import api from '../../../config/api';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/all');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, role) => {
    try {
      await api.put('/users/role', { userId, role });
      toast.success(`User role updated to ${role}`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  const handleMarkFraud = async (userId) => {
    if (window.confirm('Are you sure you want to mark this user as fraud?')) {
      try {
        await api.put('/users/fraud', { userId });
        toast.success('User marked as fraud');
        fetchUsers();
      } catch (error) {
        console.error('Error marking fraud:', error);
        toast.error('Failed to mark as fraud');
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
      case 'vendor':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      case 'user':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-400"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold gradient-text mb-6">Manage Users</h2>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-dark-lighter">
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-left py-3 px-4 font-semibold">Email</th>
              <th className="text-left py-3 px-4 font-semibold">Role</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-200 dark:border-dark-lighter hover:bg-gray-50 dark:hover:bg-dark-lighter"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.photoURL || 'https://via.placeholder.com/40'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-semibold">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {user.fraudFlag ? (
                    <span className="badge bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                      Fraud
                    </span>
                  ) : (
                    <span className="badge bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      Active
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-2">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleRoleUpdate(user._id, 'admin')}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-1 px-3 rounded-full text-sm transition-all"
                      >
                        Make Admin
                      </button>
                    )}
                    {user.role !== 'vendor' && (
                      <button
                        onClick={() => handleRoleUpdate(user._id, 'vendor')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-full text-sm transition-all"
                      >
                        Make Vendor
                      </button>
                    )}
                    {user.role === 'vendor' && !user.fraudFlag && (
                      <button
                        onClick={() => handleMarkFraud(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-full text-sm transition-all"
                      >
                        Mark Fraud
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
