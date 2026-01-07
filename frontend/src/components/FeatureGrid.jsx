import React from 'react';

export default function FeatureGrid({ cards = [] }) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="flex flex-row gap-8 mb-8">
        {cards.slice(0, 2).map((item, idx) => (
          <div
            key={idx}
            className="w-[380px] h-[420px] border-4 border-white/20 rounded-[24px] overflow-hidden bg-gray-900/90 backdrop-blur-md shadow-xl flex flex-col items-center justify-center text-center p-8"
          >
            <div className="text-7xl mb-6">{item.icon}</div>
            <h3 className="text-3xl font-bold text-white mb-4">{item.title}</h3>
            <p className="text-base text-gray-300 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-row gap-8">
        {cards.slice(2, 4).map((item, idx) => (
          <div
            key={idx}
            className="w-[380px] h-[420px] border-4 border-white/20 rounded-[24px] overflow-hidden bg-gray-900/90 backdrop-blur-md shadow-xl flex flex-col items-center justify-center text-center p-8"
          >
            <div className="text-7xl mb-6">{item.icon}</div>
            <h3 className="text-3xl font-bold text-white mb-4">{item.title}</h3>
            <p className="text-base text-gray-300 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
