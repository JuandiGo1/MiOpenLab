import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { createDiscussion } from '../services/forumService';
import { getGroupById } from '../../groups/services/groupService';
import { NewLoader } from '../../common/components/Loader';

const CreateDiscussionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { groupId } = useParams();
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    if (groupId) {
      loadGroup();
    }
  }, [groupId]);

  const loadGroup = async () => {
    try {
      const groupData = await getGroupById(groupId);
      if (!groupData || !groupData.members?.includes(user.uid)) {
        // If user is not a member, redirect to group page
        navigate(`/groups/${groupId}`);
        return;
      }
      setGroup(groupData);
    } catch (error) {
      console.error('Error loading group:', error);
      navigate('/groups');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const discussionId = await createDiscussion({
        ...formData,
        groupId,
        authorId: user.uid,
        authorName: user.displayName || user.username,
      });
      navigate(`/groups/${groupId}/discussions/${discussionId}`);
    } catch (error) {
      console.error('Error creating discussion:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!group) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <NewLoader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 dark:bg-[#333333]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Discussion</h2>
          <p className="text-gray-600 dark:text-gray-300">in {group.name}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={8}
                value={formData.content}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(`/groups/${groupId}`)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#bd9260] hover:bg-[#ce9456]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {loading ? <NewLoader /> : 'Create Discussion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDiscussionPage;
