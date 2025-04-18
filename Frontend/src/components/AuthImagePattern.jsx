import React from 'react';

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-primary/10 h-full p-8 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-full h-32 flex items-center justify-center">
          <div className="w-20 h-20 bg-primary rounded-xl grid place-items-center transform rotate-45">
            <div className="w-16 h-16 bg-base-100 rounded-lg transform -rotate-45 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">CM</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-base-content/70">{subtitle}</p>
        
        <div className="grid grid-cols-3 gap-3 mt-8">
          {Array(9).fill(0).map((_, i) => (
            <div 
              key={i}
              className={`w-full aspect-square rounded-lg ${
                [0, 2, 4, 6, 8].includes(i) ? 'bg-primary/20' : 'bg-primary/10'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;