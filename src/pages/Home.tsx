import React from "react";

const Home: React.FC = () => {
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">ReliefMap</h1>
      <p className="text-gray-600">Find and share resources on the map.</p>
      <div className="mt-6">
        {/* Map placeholder - replace with real map component (Google Maps / Mapbox) */}
        <div className="h-64 bg-gray-100 border rounded flex items-center justify-center">
          <span className="text-gray-400">Map placeholder</span>
        </div>
      </div>
    </section>
  );
};

export default Home;
