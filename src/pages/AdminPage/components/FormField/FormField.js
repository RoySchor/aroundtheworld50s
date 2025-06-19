import React from "react";
import PropTypes from "prop-types";
import "./FormField.css";

const FormField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  maxLength,
  rows,
  required = false,
  className = "",
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const inputProps = {
    id,
    value,
    onChange: handleChange,
    placeholder,
    maxLength,
    required,
    className: `form-field-input ${className}`,
  };

  return (
    <div className="form-field-group">
      <label htmlFor={id} className="form-field-label">
        {label}
        {required && <span className="form-field-required">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          {...inputProps}
          rows={rows || 4}
          className={`form-field-textarea ${className}`}
        />
      ) : (
        <input {...inputProps} type={type} />
      )}
    </div>
  );
};

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["text", "email", "tel", "url", "textarea"]),
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  rows: PropTypes.number,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default FormField;
