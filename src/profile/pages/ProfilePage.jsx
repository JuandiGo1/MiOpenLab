import React from "react";
import ProjectCard from "../components/ProjectCard";
import ProfileHeader from "../components/ProfileHeader";
import SearchBar from "../../common/components/SearchBar";

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

      <SearchBar></SearchBar>
    </div>
  );
};

export default ProfilePage;