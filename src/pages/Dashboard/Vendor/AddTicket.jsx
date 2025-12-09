import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../config/api';
import toast from 'react-hot-toast';

const AddTicket = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    from: '',
    to: '',
    transportType: 'bus',
    pricePerUnit: '',
    quantity: '',
    departureDate: '',
    departureTime: '',
    perks: [],
    imageUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const perkOptions = [
    'AC',
    'WiFi',
    'Meals',
    'Reclining Seats',
    'Entertainment',
    'Charging Port',
    'Restroom',
    'Extra Legroom',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePerkToggle = (perk) => {
    setFormData((prev) => ({
      ...prev,
      perks: prev.perks.includes(perk)
        ? prev.perks.filter((p) => p !== perk)
        : [...prev.perks, perk],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      toast.error('Please provide an image URL');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/tickets', {
        ...formData,
        vendorName: user.displayName,
        vendorEmail: user.email,
      });

      toast.success('Ticket added successfully! Waiting for admin approval.');
      setFormData({
        title: '',
        from: '',
        to: '',
        transportType: 'bus',
        pricePerUnit: '',
        quantity: '',
        departureDate: '',
        departureTime: '',
        perks: [],
        imageUrl: '',
      });
    } catch (error) {
      console.error('Error adding ticket:', error);
      toast.error('Failed to add ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold gradient-text mb-6">Add New Ticket</h2>

      <div className="card max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Dhaka to Chittagong Express"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Transport Type *</label>
              <select
                name="transportType"
                value={formData.transportType}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="launch">Launch</option>
                <option value="plane">Plane</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">From *</label>
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                className="input-field"
                placeholder="Dhaka"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">To *</label>
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                className="input-field"
                placeholder="Chittagong"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Price Per Unit ($) *</label>
              <input
                type="number"
                name="pricePerUnit"
                value={formData.pricePerUnit}
                onChange={handleChange}
                className="input-field"
                placeholder="50"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="input-field"
                placeholder="40"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Departure Date *</label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Departure Time *</label>
              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Perks & Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {perkOptions.map((perk) => (
                <label key={perk} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.perks.includes(perk)}
                    onChange={() => handlePerkToggle(perk)}
                    className="w-5 h-5 text-primary-500 rounded"
                  />
                  <span className="text-sm">{perk}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Ticket Image URL *</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/my-ticket-image.jpg"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Use a valid image link (JPG/PNG/WebP)
            </p>
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="mt-4 w-full h-48 object-cover rounded-2xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Vendor Name</label>
              <input
                type="text"
                value={user?.displayName || ''}
                className="input-field bg-gray-100 dark:bg-dark-lighter"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Vendor Email</label>
              <input
                type="email"
                value={user?.email || ''}
                className="input-field bg-gray-100 dark:bg-dark-lighter"
                readOnly
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? 'Adding Ticket...' : 'Add Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTicket;
