import React from "react";

type ProfileProps = {};

const Profile: React.FC<ProfileProps> = () => {
  return (
    <section>
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <p className="text-gray-600">User details and saved locations.</p>
    </section>
  );
};

export default Profile;
