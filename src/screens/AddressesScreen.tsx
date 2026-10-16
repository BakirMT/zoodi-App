import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Home, Briefcase, MapPin, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Address } from '../types';

export const AddressesScreen: React.FC = () => {
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    showToast,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form inputs
  const [type, setType] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [name, setName] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Kerala');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const openAddModal = () => {
    setEditingAddress(null);
    setType('Home');
    setName('Muhammed Afneel');
    setAddressLine('');
    setCity('Mannarkkad');
    setState('Kerala');
    setPincode('678583');
    setPhone('+91 98765 43210');
    setIsDefault(addresses.length === 0);
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setType(addr.type);
    setName(addr.name);
    setAddressLine(addr.addressLine);
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setPhone(addr.phone);
    setIsDefault(Boolean(addr.isDefault));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !addressLine.trim() || !city.trim() || !pincode.trim() || !phone.trim()) {
      showToast('Please fill in all address details', 'error');
      return;
    }

    if (editingAddress) {
      updateAddress({
        id: editingAddress.id,
        type,
        name,
        addressLine,
        city,
        state,
        pincode,
        phone,
        isDefault,
      });
    } else {
      addAddress({
        type,
        name,
        addressLine,
        city,
        state,
        pincode,
        phone,
        isDefault,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="pb-28 flex flex-col gap-3">
      {/* Top "+ Add New Address" Button (Matching Screenshot 16) */}
      <div className="px-4 pt-2 flex justify-end">
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 bg-pink-50 dark:bg-pink-950/40 px-3 py-1.5 rounded-xl border border-pink-200 dark:border-pink-900/60 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Address List Cards (Matching Screenshot 16) */}
      <div className="px-4 flex flex-col gap-3">
        {addresses.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No saved addresses
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Add your delivery address for faster checkout.
            </p>
            <button
              type="button"
              onClick={openAddModal}
              className="mt-4 px-4 py-2 rounded-xl bg-pink-500 text-white text-xs font-semibold"
            >
              Add First Address
            </button>
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col gap-2 relative"
            >
              {/* Top Row: Type and Default badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-500 flex items-center justify-center">
                    {addr.type === 'Office' ? (
                      <Briefcase className="w-3.5 h-3.5" />
                    ) : (
                      <Home className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {addr.type}
                  </span>
                </div>

                {addr.isDefault ? (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDefaultAddress(addr.id)}
                    className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Set as default
                  </button>
                )}
              </div>

              {/* Address Details */}
              <div className="text-xs text-slate-600 dark:text-slate-300 pl-9">
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {addr.name}
                </p>
                <p className="mt-0.5">
                  {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-slate-400 dark:text-slate-500 mt-1">{addr.phone}</p>
              </div>

              {/* Edit and Delete Actions (Matching Screenshot 16) */}
              <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => openEditModal(addr)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline px-2 py-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => deleteAddress(addr.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:underline px-2 py-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="py-4 flex flex-col gap-3 text-xs">
              {/* Type pills */}
              <div>
                <span className="text-slate-500 block mb-1.5">Address Type</span>
                <div className="flex gap-2">
                  {(['Home', 'Office', 'Other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 py-1.5 rounded-xl border font-bold text-xs ${
                        type === t
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-600'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-slate-500 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Address Line */}
              <div>
                <label className="text-slate-500 block mb-1">House / Flat / Area</label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Manakkad"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Pincode & Phone */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Default checkbox */}
              <label className="flex items-center gap-2 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded accent-pink-500"
                />
                <span className="text-slate-600 dark:text-slate-300">
                  Make this my default shipping address
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md shadow-pink-500/20 mt-2"
              >
                {editingAddress ? 'Update Address' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
