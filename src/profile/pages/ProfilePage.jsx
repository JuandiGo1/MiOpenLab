import React from "react";
import ProjectCard from "../components/ProjectCard";
import ProfileHeader from "../components/ProfileHeader";

const ProfilePage = () => {
  const posts = [
    {
      image: "https://via.placeholder.com/400",
      title: "Post 1",
      description: "This is the description of the first post.",
      likes: 122,
      date: "March 24",
    },
    {
      image: "https://via.placeholder.com/400",
      title: "Post 2",
      description: "This is the description of the second post.",
      likes: 98,
      date: "March 24",
    },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">


      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Profile Header */}
        <ProfileHeader></ProfileHeader>

        {/* Tabs */}
        <div className="flex space-x-4 border-b mb-6">
          <button className="pb-2 border-b-2 border-blue-600">Posts</button>
          <button className="pb-2 text-gray-600">Followers</button>
          <button className="pb-2 text-gray-600">Likes</button>
        </div>

        {/* Posts Section */}
        <div className="grid grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <ProjectCard key={index} {...post} />
          ))}
        </div>
      </main>

      {/* Suggestions */}
      <aside className="w-1/5 bg-white p-6 shadow-md">
        <h2 className="text-lg font-bold mb-4">Suggestions</h2>
        <div className="flex items-center mb-4">
          <img
            src="https://via.placeholder.com/50"
            alt="Suggestion"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-4">
            <p className="font-bold">Jessica Alba</p>
            <p className="text-gray-600">@jessicaalba</p>
          </div>
        </div>
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/50"
            alt="Suggestion"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-4">
            <p className="font-bold">Jessica Alba</p>
            <p className="text-gray-600">@jessicaalba</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ProfilePage;