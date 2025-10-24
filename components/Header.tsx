import React from 'react';
import { CodeBracketIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-md p-4 border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto flex items-center gap-4">
        <CodeBracketIcon className="w-8 h-8 text-sky-400"/>
        <div>
            <h1 className="text-xl font-bold text-slate-100">AI Test Case Generator</h1>
            <p className="text-sm text-slate-400">Automated QA for Healthcare Software Compliance</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
