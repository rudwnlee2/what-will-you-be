import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="text-center py-10 ">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Welcome to WWUB!</h2>
      <p className="text-lg text-gray-700 leading-relaxed max-w-2xl ">
        Discover your potential and embark on a journey of continuous learning and personal development.
        We provide tools and resources to help you explore various paths and grow into the best version of yourself.
      </p>
      <button className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
        Start Your Journey
      </button>
    </div>
  );
};

export default HomePage;