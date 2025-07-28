// app/(dashboard)/profile/page.tsx

import React from 'react';

const ProfilePage = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Name</label>
            <p className="text-gray-900">Nikhil Sharma</p>
          </div>
          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <p className="text-gray-900">nikhil@example.com</p>
          </div>
          <div>
            <label className="block font-medium text-gray-700">Bio</label>
            <p className="text-gray-900">Passionate web developer who loves building cool stuff.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
