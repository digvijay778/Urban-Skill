import React from 'react';

const TextArea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  rows = 4,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`
          block w-full rounded-lg border
          ${error ? 'border-red-500' : 'border-gray-300'}
          px-3 py-2
          focus:outline-none focus:ring-2
          ${error ? 'focus:ring-red-500' : 'focus:ring-primary-500'}
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-colors duration-200
          resize-vertical
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default TextArea;
