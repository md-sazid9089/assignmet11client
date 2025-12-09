import { MdCampaign } from 'react-icons/md';

const AdvertiseTickets = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Advertise Tickets</h1>
          <p className="text-gray-600 mt-1">Promote tickets on the homepage</p>
        </div>
        <MdCampaign className="text-5xl text-pink-500" />
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center py-12">
          <MdCampaign className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Advertising Feature
          </h2>
          <p className="text-gray-600 mb-6">
            Select tickets to feature on the homepage banner
          </p>
          <button className="btn-primary">
            Configure Advertisements
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvertiseTickets;
