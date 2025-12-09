import { useAuth } from '../../../context/AuthContext';

const Profile = () => {
  const { user, userRole } = useAuth();

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold gradient-text mb-6 text-center">Profile</h2>

      <div className="flex flex-col items-center mb-6">
        <img
          src={user?.photoURL || 'https://via.placeholder.com/150'}
          alt={user?.displayName}
          className="w-32 h-32 rounded-full border-4 border-primary-400 mb-4"
        />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Name
            </label>
            <p className="text-lg font-semibold">{user?.displayName || 'N/A'}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Email
            </label>
            <p className="text-lg font-semibold">{user?.email || 'N/A'}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Role
            </label>
            <span className="badge bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-lg">
              {userRole || 'user'}
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Account Status
            </label>
            <span className="badge bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-lg">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
