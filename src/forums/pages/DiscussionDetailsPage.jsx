import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    loadDiscussionData();
  }, [discussionId, groupId]);
  const loadDiscussionData = async () => {
    try {
      const [discussionData, groupData, repliesData] = await Promise.all([
        getDiscussionById(discussionId, groupId),
        getGroupById(groupId),
        getDiscussionReplies(discussionId, groupId)
      ]);

      if (!discussionData || !groupData) {
        navigate(`/groups/${groupId}`);
        return;
      }

      setDiscussion(discussionData);
      setGroup(groupData);
      setReplies(repliesData || []);
    } catch (error) {
      console.error('Error loading discussion:', error);
      navigate(`/groups/${groupId}`);
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
      await addReply(discussionId, {
        content: replyContent,
        authorId: user.uid,
        authorName: user.displayName || user.username,
        groupId,
      });
      setReplyContent('');
      await loadDiscussionData();
    } catch (error) {
      console.error('Error adding reply:', error);
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

  const canReply = user && group?.members?.includes(user.uid);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link to="/groups" className="hover:text-[#bd9260] dark:hover:text-blue-500">Groups</Link></li>
            <li>&gt;</li>
            <li><Link to={`/groups/${groupId}`} className="hover:text-[#bd9260] dark:hover:text-blue-500">{group?.name}</Link></li>
            <li>&gt;</li>
            <li className="text-gray-700 dark:text-gray-300">Discussion</li>
          </ol>
        </nav>

        {/* Discussion */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-[#333333]">
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

          {/* Replies */}
          <div className="border-t border-gray-200 dark:border-gray-600">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-white">
                {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
              </h2>

              <div className="space-y-6">
                {replies.map((reply, index) => (
                  <div 
                    key={reply.id || index}
                    className="border-b border-gray-200 last:border-0 pb-6 last:pb-0 dark:border-gray-600"
                  >
                    <p className="text-gray-600 mb-2 dark:text-gray-300">{reply.content}</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{reply.authorName}</span>
                      <span className="mx-2">&bull;</span>
                      <span>{formatDate(reply.createdAt)}</span>
                    </div>
                  </div>
                ))}

                {canReply && (
                  <form onSubmit={handleSubmitReply} className="mt-8">
                    <div>
                      <label htmlFor="reply" className="sr-only">
                        Your reply
                      </label>
                      <textarea
                        id="reply"
                        rows={4}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        required
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Write your reply..."
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#bd9260] hover:bg-[#ce9456]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
                      >
                        {submitting ? <NewLoader /> : 'Post Reply'}
                      </button>
                    </div>
                  </form>
                )}

                {!canReply && user && (
                  <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center dark:bg-gray-700">
                    <p className="text-gray-600 dark:text-gray-300">
                      You need to be a member of this group to participate in discussions.
                    </p>
                  </div>
                )}

                {!user && (
                  <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center dark:bg-gray-700">
                    <p className="text-gray-600 dark:text-gray-300">
                      Please {' '}
                      <Link to="/login" className="text-[#bd9260] hover:underline dark:text-blue-500">
                        log in
                      </Link>
                      {' '} to participate in discussions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetailsPage;
