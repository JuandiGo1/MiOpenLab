import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllDiscussions } from '../services/forumService';
import { useAuth } from '../../auth/hooks/useAuth';
import { NewLoader } from '../../common/components/Loader';
import { formatDate } from '../../utils/dateFormatter';

const ForumsPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDiscussions();
  }, []);

  const loadDiscussions = async () => {
    try {
      const allDiscussions = await getAllDiscussions();
      setDiscussions(allDiscussions);
    } catch (error) {
      console.error('Error loading discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <NewLoader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Discussion Forums</h1>
        {user && (
          <Link
            to="/forums/new"
            className="bg-[#bd9260] text-white px-4 py-2 rounded-lg hover:bg-[#ce9456]/80 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Start Discussion
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow dark:bg-[#333333]">
        {discussions.map((discussion, index) => (
          <div
            key={discussion.id}
            className={`p-4 flex items-start justify-between ${
              index !== discussions.length - 1 ? 'border-b dark:border-gray-600' : ''
            }`}
          >
            <div className="flex-1">
              <Link
                to={`/forums/${discussion.id}`}
                className="text-xl font-semibold text-gray-800 hover:text-[#bd9260] dark:text-white dark:hover:text-[#8293ff]"
              >
                {discussion.title}
              </Link>
              <p className="text-gray-600 mt-1 dark:text-gray-300 line-clamp-2">
                {discussion.content}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{discussion.replies} replies</span>
                <span>{discussion.views} views</span>
                <span>Started {formatDate(discussion.createdAt)}</span>
              </div>
            </div>
            {discussion.lastReplyAt && (
              <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                <p>Last reply</p>
                <p>{formatDate(discussion.lastReplyAt)}</p>
              </div>
            )}
          </div>
        ))}
        {discussions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300">
              No discussions yet. Be the first to start one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumsPage;
