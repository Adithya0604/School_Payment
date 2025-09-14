import React from "react";

function Model({ message }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "gray",
        color: "black",
        padding: "16px 24px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        zIndex: 9999,
        textAlign: "center",
      }}
    >
      {message}
    </div>
  );
}

export default Model;
