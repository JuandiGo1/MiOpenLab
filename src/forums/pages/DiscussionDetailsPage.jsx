import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { getDiscussionById, getDiscussionReplies, addReply } from '../services/forumService';
import { NewLoader } from '../../common/components/Loader';
import { formatDate } from '../../utils/dateFormatter';

const DiscussionDetailsPage = () => {
  const { discussionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [discussion, setDiscussion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDiscussion();
  }, [discussionId]);

  const loadDiscussion = async () => {
    try {
      const [discussionData, repliesData] = await Promise.all([
        getDiscussionById(discussionId),
        getDiscussionReplies(discussionId)
      ]);
      setDiscussion(discussionData);
      setReplies(repliesData);
    } catch (error) {
      console.error('Error loading discussion:', error);
      navigate('/forums');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await addReply(discussionId, user.uid, replyContent);
      setReplyContent('');
      loadDiscussion(); // Recargar la discusión para mostrar la nueva respuesta
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <NewLoader />
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-300">Discussion not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Discussion Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-[#333333]">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">
            {discussion.title}
          </h1>
          <div className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-wrap">
            {discussion.content}
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div>
              <span>{formatDate(discussion.createdAt)}</span>
              <span className="mx-2">•</span>
              <span>{discussion.views} views</span>
            </div>
            <div>
              <span>{replies.length} replies</span>
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="space-y-4 mb-6">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-white rounded-lg shadow-md p-6 dark:bg-[#333333]">
              <div className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {reply.content}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                {formatDate(reply.createdAt)}
              </div>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        {user ? (
          <form onSubmit={handleSubmitReply} className="bg-white rounded-lg shadow-md p-6 dark:bg-[#333333]">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-[#bd9260] text-white rounded-lg hover:bg-[#ce9456]/80 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                {submitting ? <NewLoader /> : 'Reply'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-300">
              Please <a href="/login" className="text-blue-600 hover:underline dark:text-blue-400">log in</a> to reply
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionDetailsPage;
