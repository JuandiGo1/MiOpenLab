import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { getDiscussionById, getDiscussionReplies, addReply } from '../services/forumService';
import { getGroupById } from '../../groups/services/groupService';
import { NewLoader } from '../../common/components/Loader';
import { formatDate } from '../../utils/dateFormatter';

const DiscussionDetailsPage = () => {
  const { groupId, discussionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [discussion, setDiscussion] = useState(null);
  const [group, setGroup] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const lastReplyRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    loadDiscussionData();
  }, [discussionId, groupId]);

  const loadDiscussionData = async () => {
    setError('');
    try {
      const [discussionData, groupData, repliesData] = await Promise.all([
        getDiscussionById(discussionId, groupId),
        getGroupById(groupId),
        getDiscussionReplies(discussionId, groupId)
      ]);

      if (!discussionData || !groupData) {
        setError('Discussion not found');
        navigate(`/groups/${groupId}`);
        return;
      }

      // Verificar permisos del grupo
      if (!groupData.members?.includes(user?.uid)) {
        setError('You must be a member of this group to view discussions');
        return;
      }

      setDiscussion(discussionData);
      setGroup(groupData);
      setReplies(repliesData.replies);
      setHasMore(repliesData.hasMore);
      lastReplyRef.current = repliesData.lastReply;
    } catch (error) {
      console.error('Error loading discussion:', error);
      setError('Error loading discussion. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const loadMoreReplies = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    setError('');
    try {
      const lastReply = replies[replies.length - 1];
      const repliesData = await getDiscussionReplies(discussionId, groupId, lastReply);
      
      // Verificar si ya tenemos estas respuestas para evitar duplicados
      const newReplies = repliesData.replies.filter(
        newReply => !replies.some(existing => existing.id === newReply.id)
      );
      
      if (newReplies.length > 0) {
        setReplies(prev => [...prev, ...newReplies]);
        setHasMore(repliesData.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more replies:', error);
      setError('Error loading more replies. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Validaciones del cliente
      if (replyContent.trim().length < 5) {
        throw new Error('Reply must be at least 5 characters long');
      }

      // Optimistic update
      const optimisticReply = {
        id: 'temp-' + Date.now(),
        content: replyContent,
        authorId: user.uid,
        authorName: user.displayName,
        createdAt: new Date(),
        isOptimistic: true
      };

      setReplies(prev => [...prev, optimisticReply]);
      setReplyContent('');
      
      // Scroll to bottom
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

      const newReply = await addReply(discussionId, {
        groupId,
        content: replyContent,
        authorId: user.uid,
        authorName: user.displayName
      });

      // Replace optimistic reply with real one
      setReplies(prev => 
        prev.map(reply => 
          reply.id === optimisticReply.id ? newReply : reply
        )
      );
    } catch (error) {
      console.error('Error submitting reply:', error);
      setError(error.message || 'Error submitting reply. Please try again.');
      
      // Remove optimistic reply on error
      setReplies(prev => prev.filter(reply => !reply.isOptimistic));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <NewLoader />;
  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to={`/groups/${groupId}`} className="text-blue-500 hover:underline">
          Back to Group
        </Link>
      </div>
    );
  }

  const canReply = user && group?.members?.includes(user.uid);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Discussion Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-[#333333] mb-4">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">{discussion.title}</h1>
          <div className="text-gray-600 mb-6 dark:text-gray-300">
            <p>{discussion.content}</p>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{discussion.authorName}</span>
            <span className="mx-2">&bull;</span>
            <span>{formatDate(discussion.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Replies */}
      <div className="border-t border-gray-200 dark:border-gray-600">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-white">
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h2>

          <div className="space-y-6">
            {replies.map((reply, index) => (
              <div 
                key={reply.id}
                className={`border-b border-gray-200 last:border-0 pb-6 last:pb-0 dark:border-gray-600 ${
                  reply.isOptimistic ? 'opacity-50' : ''
                }`}
              >
                <p className="text-gray-600 mb-2 dark:text-gray-300">{reply.content}</p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{reply.authorName}</span>
                  <span className="mx-2">&bull;</span>
                  <span>{formatDate(reply.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <button
              onClick={loadMoreReplies}
              disabled={loadingMore}
              className="mt-4 w-full py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
            >
              {loadingMore ? 'Loading...' : 'Load More Replies'}
            </button>
          )}

          {user ? (
            <form onSubmit={handleSubmitReply} className="mt-6">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                rows="4"
                disabled={submitting}
                minLength={5}
                maxLength={1000}
                required
              />
              {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || replyContent.trim().length < 5}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {submitting ? 'Submitting...' : 'Submit Reply'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 text-center">
              <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                Log in to reply
              </Link>
            </div>
          )}
        </div>
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default DiscussionDetailsPage;
