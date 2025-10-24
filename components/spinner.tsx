import React from 'react';

const Spinner: React.FC<{ size?: string }> = ({ size = 'w-8 h-8' }) => {
  return (
    <div
      className={`${size} animate-spin rounded-full border-4 border-slate-400 border-t-sky-400`}
    ></div>
  );
};

export default Spinner;
