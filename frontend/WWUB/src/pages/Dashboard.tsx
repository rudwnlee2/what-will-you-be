import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="py-10 text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Your Personal Dashboard</h2>
      <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
        This is where your personalized journey unfolds. Here, you'll find your progress, recommended learning paths, and tools to track your development.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Progress Tracker</h3>
          <p className="text-gray-600">Monitor your learning milestones.</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-purple-700 mb-2">Skill Builder</h3>
          <p className="text-gray-600">Discover and develop new competencies.</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-green-700 mb-2">Career Compass</h3>
          <p className="text-gray-600">Navigate your professional journey.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;