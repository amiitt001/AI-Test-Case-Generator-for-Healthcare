import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 py-4 mt-8">
      <div className="container mx-auto text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} AI-Powered Test Case Generation. All Rights Reserved.</p>
        <p>Built with React, Tailwind CSS, and Gemini API.</p>
      </div>
    </footer>
  );
};

export default Footer;
