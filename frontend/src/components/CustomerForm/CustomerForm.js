import { useState, useEffect } from "react";
import "./CustomerForm.css";

const CustomerForm = ({
  initialData = null,
  onSubmit,
  submitLabel = "Save",
  loading = false
}) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        first_name: initialData.first_name || "",
        last_name: initialData.last_name || "",
        phone_number: initialData.phone_number || "",
      });
    }
  }, [initialData]);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "first_name":
        if (!value.trim()) error = "First name is required";
        else if (value.length < 2) error = "First name must be at least 2 characters";
        break;
      case "last_name":
        if (!value.trim()) error = "Last name is required";
        else if (value.length < 2) error = "Last name must be at least 2 characters";
        break;
      case "phone_number":
        if (!value.trim()) error = "Phone number is required";
        else if (!/^\+?\d{7,15}$/.test(value.trim())) {
          error = "Enter a valid phone number (7-15 digits, optional +)";
        }
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
      first_name: true,
      last_name: true,
      phone_number: true,
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      await onSubmit({ ...form });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <div className="form-group">
        <label htmlFor="first_name" className="form-label">
          First Name *
        </label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${errors.first_name ? 'error' : ''}`}
          placeholder="Enter first name"
          disabled={loading}
        />
        {errors.first_name && (
          <div className="error-text">{errors.first_name}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="last_name" className="form-label">
          Last Name *
        </label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${errors.last_name ? 'error' : ''}`}
          placeholder="Enter last name"
          disabled={loading}
        />
        {errors.last_name && (
          <div className="error-text">{errors.last_name}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="phone_number" className="form-label">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone_number"
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${errors.phone_number ? 'error' : ''}`}
          placeholder="+919876543210 or 9876543210"
          disabled={loading}
        />
        {errors.phone_number && (
          <div className="error-text">{errors.phone_number}</div>
        )}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Processing..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;