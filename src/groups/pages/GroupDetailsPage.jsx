import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { getGroupById, joinGroup, leaveGroup, isGroupMember } from '../services/groupService';
import { NewLoader } from '../../common/components/Loader';
import ProjectCard from '../../profile/components/ProjectCard';
import { getUserProfile } from '../../auth/services/userService';
import defaultBanner from '../../assets/defaultBanner.jpg';

const GroupDetailsPage = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  const loadGroup = async () => {
    try {
      const groupData = await getGroupById(groupId);
      setGroup(groupData);

      if (user) {
        const memberStatus = await isGroupMember(groupId, user.uid);
        setIsMember(memberStatus);
      }

      // Cargar información de los miembros
      if (groupData?.members) {
        const memberProfiles = await Promise.all(
          groupData.members.slice(0, 5).map(memberId => getUserProfile(memberId))
        );
        setMembers(memberProfiles.filter(Boolean));
      }
    } catch (error) {
      console.error('Error loading group:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeave = async () => {
    if (!user || isJoining) return;

    setIsJoining(true);
    try {
      if (isMember) {
        await leaveGroup(groupId, user.uid);
      } else {
        await joinGroup(groupId, user.uid);
      }
      await loadGroup();
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

              {user && (
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
              <span>•</span>
              <span>{group.projectCount || 0} proyectos</span>
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mt-4">
              {group.technologies?.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm dark:bg-gray-700 dark:text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Members Preview */}
            {members.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 dark:text-white">
                  Miembros
                </h3>
                <div className="flex -space-x-2 overflow-hidden">
                  {members.map((member) => (
                    <img
                      key={member.uid}
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

        {/* Projects Section - To be implemented in the next phase */}
        {/* <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">
            Proyectos del grupo
          </h2>
          <div className="grid gap-6">
            {group.projects?.map(project => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default GroupDetailsPage;
