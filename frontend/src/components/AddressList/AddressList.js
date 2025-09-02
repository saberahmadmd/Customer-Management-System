import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/api";
import AddressForm from "../AddressFrom/AddressForm";
import "./AddressList.css";

const AddressList = ({
  customerId,
  initialAddresses = null,
  onChange,
  canEdit = true
}) => {
  const [addresses, setAddresses] = useState(initialAddresses || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchAddresses = useCallback(async () => {
    if (!customerId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/customers/${customerId}/addresses`);
      const data = Array.isArray(res.data) ? res.data : [];
      setAddresses(data);
      if (onChange) onChange(data);
    } catch (err) {
      console.error("Fetch addresses error:", err);
      setError("Failed to load addresses");
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [customerId, onChange]);

  useEffect(() => {
    if (initialAddresses === null) {
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [customerId, initialAddresses, fetchAddresses]);

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      await api.delete(`/customers/address/${addressId}`);
      const updated = addresses.filter(a => a.id !== addressId);
      setAddresses(updated);
      if (onChange) onChange(updated);
    } catch (err) {
      console.error("Delete address error:", err);
      alert("Failed to delete address. Please try again.");
    }
  };

  const handleAdd = (newAddress) => {
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    if (onChange) onChange(updated);
  };

  const handleUpdate = (updatedAddress) => {
    const updated = addresses.map(a =>
      a.id === updatedAddress.id ? updatedAddress : a
    );
    setAddresses(updated);
    setEditingAddress(null);
    if (onChange) onChange(updated);
  };

  const startEditing = (address) => {
    setEditingAddress(address);
  };

  const cancelEditing = () => {
    setEditingAddress(null);
  };

  if (loading) return <div className="loading">Loading addresses...</div>;
  if (error) return <div className="error">{error}</div>;

  const hasOnlyOneAddress = addresses.length === 1;

  return (
    <div className="address-list">
      <div className="address-header">
        <h3>Addresses</h3>
        {hasOnlyOneAddress && (
          <span className="only-one-badge">Only One Address</span>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="no-addresses">
          <p>No addresses found for this customer.</p>
        </div>
      ) : (
        <div className="addresses-grid">
          {addresses.map((address) => (
            <div key={address.id} className="address-card">
              {editingAddress && editingAddress.id === address.id ? (
                <AddressForm
                  customerId={customerId}
                  initialData={address}
                  onSubmit={handleUpdate}
                  onCancel={cancelEditing}
                  mode="edit"
                />
              ) : (
                <>
                  <div className="address-content">
                    <p className="address-details">{address.address_details}</p>
                    <p className="address-location">
                      {address.city}, {address.state} - {address.pin_code}
                    </p>
                  </div>

                  {canEdit && (
                    <div className="address-actions">
                      <button
                        onClick={() => startEditing(address)}
                        className="btn btn-primary btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {canEdit && !editingAddress && (
        <div className="add-address-section">
          <h4>Add New Address</h4>
          <AddressForm customerId={customerId} onAdd={handleAdd} />
        </div>
      )}
    </div>
  );
};

export default AddressList;