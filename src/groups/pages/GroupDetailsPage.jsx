import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { getGroupById, joinGroup, leaveGroup } from '../services/groupService';
import { NewLoader } from '../../common/components/Loader';
import ProjectCard from '../../profile/components/ProjectCard';
import { getUserProfile } from '../../auth/services/userService';
import defaultBanner from '../../assets/defaultBanner.jpg';

const GroupDetailsPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  useEffect(() => {
    if (user && group) {
      // Verificar membresía usando el array de IDs
      setIsMember(Array.isArray(group.members) && group.members.includes(user.uid));
    }
  }, [user, group]);

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

  const handleJoinLeave = async () => {
    setIsJoining(true);
    try {
      if (isMember) {
        await leaveGroup(groupId, user.uid);
        setIsMember(false);
      } else {
        await joinGroup(groupId, user.uid);
        setIsMember(true);
        // Redireccionar al grupo después de unirse
        navigate(`/groups/${groupId}`);
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
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
        Grupo no encontrado
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
                  {isJoining ? 'Procesando...' : isMember ? 'Abandonar' : 'Unirse'}
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <span>{group.memberCount || 0} miembros</span>
            </div>

            {/* Members Preview */}
            {members.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 dark:text-white">
                  Miembros
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
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPage;
