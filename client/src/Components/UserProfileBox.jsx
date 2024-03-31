import React from 'react';
import profilePhoto from "../images/profile-photo.png";

const UserProfileBox = ({user}) => {
  return (
    <div className="bg-white border rounded-md p-4 shadow-md flex flex-col justify-center">
      <div className="mb-4">
        <img src={profilePhoto} alt="User Profile" className="rounded-full w-16 h-16 mx-auto" />
      </div>

      <div className="mb-2 text-center">
        <h2 className="text-xl font-bold">{user.name}</h2>
      </div>

      <div className="mb-2 text-center">
        <h3 className="text-lg font-medium">{user.post}</h3>
      </div>

      <div className="mb-2 text-center">
        <p className="text-sm">{user.email}</p>
      </div>

      <div className="text-center">
        <p className="text-sm">{user.contact}</p>
      </div>
    </div>
  );
};

export default UserProfileBox;