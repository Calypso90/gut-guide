import React from "react";
import { useParams } from "react-router-dom";

const LocationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <section>
      <h2 className="text-xl font-semibold">Location {id}</h2>
      <p className="text-gray-600">Details and resources for this location.</p>
      <div className="mt-4">
        <div className="bg-white border p-4 rounded">
          Resource list placeholder
        </div>
      </div>
    </section>
  );
};

export default LocationDetails;
