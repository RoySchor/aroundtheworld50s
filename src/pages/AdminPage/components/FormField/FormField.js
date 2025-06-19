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
  accept,
}) => {
  const handleChange = (e) => {
    if (type === "file") {
      onChange(e.target.files[0]);
    } else {
      onChange(e.target.value);
    }
  };

  const inputProps = {
    id,
    onChange: handleChange,
    placeholder,
    maxLength,
    required,
    className: `form-field-input ${className}`,
  };

  // For file inputs, don't include value prop
  if (type !== "file") {
    inputProps.value = value;
  }

  // For file inputs, add accept prop
  if (type === "file" && accept) {
    inputProps.accept = accept;
  }

  return (
    <div className="form-field-group">
      <label htmlFor={id} className="form-field-label">
        {label}
        {required && <span className="form-field-required">*</span>}
      </label>
      {type === "file" && value && value.name && (
        <div className="form-field-file-preview">
          <span className="form-field-file-name">{value.name}</span>
        </div>
      )}
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
  type: PropTypes.oneOf(["text", "email", "tel", "url", "textarea", "file"]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  rows: PropTypes.number,
  required: PropTypes.bool,
  className: PropTypes.string,
  accept: PropTypes.string,
};

export default FormField;
