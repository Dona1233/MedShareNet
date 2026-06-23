const Input = ({ label, type = 'text', name, value, onChange, placeholder, required, error, className = '' }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${error ? 'border-red-500' : ''} ${className}`}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default Input;