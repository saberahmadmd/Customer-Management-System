import { useState, useEffect } from "react";
import api from "../../api/api";
import "./AddressForm.css";

const AddressForm = ({
  customerId,
  initialData = null,
  onAdd,
  onUpdate,
  onCancel,
  mode = "add"
}) => {
  const [form, setForm] = useState({
    address_details: "",
    city: "",
    state: "",
    pin_code: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        address_details: initialData.address_details || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pin_code: initialData.pin_code || "",
      });
    }
  }, [initialData]);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "address_details":
        if (!value.trim()) error = "Address details are required";
        else if (value.length < 5) error = "Address must be at least 5 characters";
        break;
      case "city":
        if (!value.trim()) error = "City is required";
        else if (value.length < 2) error = "City must be at least 2 characters";
        break;
      case "state":
        if (!value.trim()) error = "State is required";
        else if (value.length < 2) error = "State must be at least 2 characters";
        break;
      case "pin_code":
        if (!value.trim()) error = "PIN code is required";
        else if (!/^\d{4,10}$/.test(value)) error = "PIN code must be 4-10 digits";
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(form).forEach(key => {
      const error = validateField(key, form[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      address_details: true,
      city: true,
      state: true,
      pin_code: true,
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === "edit" && initialData) {
        await api.put(`/customers/address/${initialData.id}`, form);
        if (onUpdate) {
          onUpdate({ ...form, id: initialData.id });
        }
      } else {
        const response = await api.post(`/customers/${customerId}/addresses`, form);
        if (onAdd) {
          onAdd(response.data);
        }
        setForm({
          address_details: "",
          city: "",
          state: "",
          pin_code: "",
        });
        setTouched({});
      }
    } catch (err) {
      console.error("Address form error:", err);
      alert(err.response?.data?.error || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="address-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="address_details" className="form-label">
            Address Details *
          </label>
          <textarea
            id="address_details"
            name="address_details"
            value={form.address_details}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.address_details ? 'error' : ''}`}
            placeholder="Street address, building, landmark, etc."
            rows="3"
            disabled={loading}
          />
          {errors.address_details && (
            <div className="error-text">{errors.address_details}</div>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city" className="form-label">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={form.city}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.city ? 'error' : ''}`}
            placeholder="Enter city"
            disabled={loading}
          />
          {errors.city && (
            <div className="error-text">{errors.city}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="state" className="form-label">
            State *
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={form.state}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.state ? 'error' : ''}`}
            placeholder="Enter state"
            disabled={loading}
          />
          {errors.state && (
            <div className="error-text">{errors.state}</div>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pin_code" className="form-label">
            PIN Code *
          </label>
          <input
            type="text"
            id="pin_code"
            name="pin_code"
            value={form.pin_code}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.pin_code ? 'error' : ''}`}
            placeholder="Enter PIN code"
            disabled={loading}
          />
          {errors.pin_code && (
            <div className="error-text">{errors.pin_code}</div>
          )}
        </div>
      </div>

      <div className="form-actions">
        {mode === "edit" && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : mode === "edit" ? "Update Address" : "Add Address"}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;