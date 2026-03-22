import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-80 z-50">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
};

export default Loader;
