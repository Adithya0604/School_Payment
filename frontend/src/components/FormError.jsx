import React from "react";

function FormError({ error }) {
  if (!error) return null;
  return (
    <>
      <div className="text-red-500 text-sm mb-2">
        {Array.isArray(error) ? error.join(", ") : error}
      </div>
    </>
  );
}

export default FormError;
