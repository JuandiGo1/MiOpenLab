import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { getGroupById, joinGroup, leaveGroup } from '../services/groupService';
import { getGroupDiscussions } from '../../forums/services/forumService';
import { NewLoader } from '../../common/components/Loader';
import ProjectCard from '../../profile/components/ProjectCard';
import { getUserProfile } from '../../auth/services/userService';
import defaultBanner from '../../assets/defaultBanner.jpg';
import { formatDate } from '../../utils/dateFormatter';

const GroupDetailsPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  useEffect(() => {
    if (user && group) {
      // Verificar membresía usando el array de IDs
      setIsMember(Array.isArray(group.members) && group.members.includes(user.uid));
    }
  }, [user, group]);

  useEffect(() => {
    if (groupId && activeTab === 'discussions') {
      loadDiscussions();
    }
  }, [groupId, activeTab]);

  const loadGroup = async () => {
    try {
      const groupData = await getGroupById(groupId);
      if (!groupData) {
        navigate('/groups');
        return;
      }
      setGroup(groupData);
      // Usar memberDetails para la UI
      setMembers(groupData.memberDetails?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error loading group:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDiscussions = async () => {
    try {
      const groupDiscussions = await getGroupDiscussions(groupId);
      setDiscussions(groupDiscussions || []);
    } catch (error) {
      console.error('Error loading discussions:', error);
      setDiscussions([]);
    }
  };

  const handleJoinLeave = async () => {
    setIsJoining(true);
    try {
      if (isMember) {
        await leaveGroup(groupId, user.uid);
        // Actualizar estado inmediatamente para la UI
        setIsMember(false);
        // Actualizar datos del grupo
        const updatedGroup = await getGroupById(groupId);
        setGroup(updatedGroup);
        setMembers(updatedGroup.memberDetails?.slice(0, 5) || []);
      } else {
        await joinGroup(groupId, user.uid);
        // Actualizar estado inmediatamente para la UI
        setIsMember(true);
        // Actualizar datos del grupo
        const updatedGroup = await getGroupById(groupId);
        setGroup(updatedGroup);
        setMembers(updatedGroup.memberDetails?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error('Error updating membership:', error);
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <NewLoader />
      </div>
    );
  }

  if (!group) {
    return (      <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
        Group not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#181818]">
      {/* Banner */}
      <div 
        className="h-48 md:h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${group.banner || defaultBanner})` }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md -mt-16 relative z-10 dark:bg-[#333333]">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2 dark:text-white">
                  {group.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {group.description}
                </p>
              </div>

              {user && user.uid !== group.creator?.id && (
                <button
                  onClick={handleJoinLeave}
                  disabled={isJoining}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    isMember
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      : 'bg-[#bd9260] text-white hover:bg-[#ce9456]/80 dark:bg-blue-600 dark:hover:bg-blue-700'
                  }`}
                >
                  {isJoining ? 'Processing...' : isMember ? 'Leave' : 'Join'}
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">              <span>{group.memberCount || 0} members</span>
            </div>

            {/* Members Preview */}
            {members.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 dark:text-white">
                  Members
                </h3>
                <div className="flex -space-x-2 overflow-hidden">                  {members.map((member) => (
                    <img
                      key={member.id || member.uid}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
                      src={member.photoURL}
                      alt={member.displayName}
                    />
                  ))}
                  {group.memberCount > 5 && (
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-xs font-medium text-gray-700 ring-2 ring-white dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-800">
                      +{group.memberCount - 5}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200 dark:border-gray-600 mt-6">
            <div className="flex gap-8 p-4">
              <button
                onClick={() => setActiveTab('projects')}
                className={`pb-2 ${
                  activeTab === 'projects'
                    ? 'border-b-2 border-[#bd9260] text-[#bd9260] dark:border-blue-600 dark:text-blue-500'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab('discussions')}
                className={`pb-2 ${
                  activeTab === 'discussions'
                    ? 'border-b-2 border-[#bd9260] text-[#bd9260] dark:border-blue-600 dark:text-blue-500'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Discussions
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'projects' ? (
                <div>
                  {/* Projects content will go here */}
                  <p>Projects section coming soon...</p>
                </div>
              ) : (
                <div>
                  {user && isMember && (
                    <button
                      onClick={() => navigate(`/groups/${groupId}/discussions/new`)}
                      className="mb-6 bg-[#bd9260] text-white px-4 py-2 rounded-lg hover:bg-[#ce9456]/80 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      Start Discussion
                    </button>
                  )}
                  
                  <div className="space-y-4">
                    {discussions.map(discussion => (
                      <div
                        key={discussion.id}
                        onClick={() => navigate(`/groups/${groupId}/discussions/${discussion.id}`)}
                        className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-[#bd9260] dark:border-gray-600 dark:hover:border-blue-500"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                              {discussion.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                              {discussion.content}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{discussion.authorName}</span>
                                <span>&bull;</span>
                                <span>{discussion.createdAt ? formatDate(discussion.createdAt) : 'Recently'}</span>
                              </div>
                              <span>&bull;</span>
                              <span>{discussion.replies?.length || 0} replies</span>
                              <span>&bull;</span>
                              <span>{discussion.views || 0} views</span>
                            </div>
                          </div>

                          {discussion.lastReply && (
                            <div className="text-right text-sm text-gray-500 dark:text-gray-400 ml-4">
                              <p>Last reply by</p>
                              <p className="font-medium">{discussion.lastReply.authorName}</p>
                              <p>{discussion.lastReply.createdAt ? formatDate(discussion.lastReply.createdAt) : 'Recently'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {discussions.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-600 dark:text-gray-300">
                          No discussions yet. {isMember ? 'Start one!' : 'Join the group to start discussions!'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPage;
