import React from 'react';

const Spinner = () => {
  return (
    <div className="w-full flex items-center justify-center flex-col">
      <div className="w-10 h-10 bg-red-600 animate-ping rounded-full relative flex  items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-red-600 blur-xl"></div>
      </div>
    </div>
  );
};

export default Spinner;
