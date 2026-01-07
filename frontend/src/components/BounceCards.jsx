import React from 'react';

// Simple presentational fallback (no animation)
export default function BounceCards({
  className = '',
  images = [],
  cards = [],
}) {
  const items = cards.length > 0 ? cards : images;
  return (
    <div className={`w-full h-[calc(100vh-120px)] min-h-[600px] max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-6 p-6 ${className}`}> 
      {items.slice(0, 4).map((item, idx) => (
        <div
          key={idx}
          className="border-4 border-white/20 rounded-[24px] overflow-hidden bg-gray-900/90 backdrop-blur-md shadow-xl flex flex-col items-center justify-center text-center p-8 w-full h-full min-h-[260px] min-w-[200px] transition-transform transition-shadow duration-300 ease-out hover:scale-105 hover:shadow-2xl"
        >
          {typeof item === 'string' ? (
            <img className="w-full h-full object-cover" src={item} alt={`card-${idx}`} />
          ) : (
            <>
              <div className="text-7xl mb-6">{item.icon}</div>
              <h3 className="text-3xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-base text-gray-300 leading-relaxed">{item.description}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
