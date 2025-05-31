import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { createComment, getProjectComments, deleteComment } from '../services/commentService';
import DefaultAvatar from '../../assets/defaultAvatar.jpg';
import { NewLoader } from '../components/Loader';
import formatDate from '../../utils/dateFormatter';
import { Timestamp } from 'firebase/firestore'; 

const Comments = ({ projectId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [projectId]);

  const loadComments = async () => {
    try {
      const projectComments = await getProjectComments(projectId);
      setComments(projectComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      await createComment(
        projectId,
        user.uid,
        newComment,
        user.displayName,
        user.photoURL
      );
      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      await loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Comments</h2>
        <div className="flex justify-center">
          <NewLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Comments</h2>
      
      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-4">
            <img
              src={user.photoURL || DefaultAvatar}
              alt={user.displayName}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows="3"
              ></textarea>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className={`mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${
                  submitting || !newComment.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Please log in to leave a comment.
        </p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-800"
          >
            <img
              src={comment.userPhotoURL || DefaultAvatar}
              alt={comment.userDisplayName}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {comment.userDisplayName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {comment.createdAt ? formatDate(comment.createdAt) : ''}
                  </p>
                </div>
                {user && user.uid === comment.userId && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
