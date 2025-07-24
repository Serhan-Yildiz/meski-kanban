import React from "react";

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  onKeyDown,
}) {
  return (
    <input
      className="input"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
    />
  );
}
