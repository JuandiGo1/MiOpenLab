import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { joinGroup, leaveGroup } from '../services/groupService';

const GroupCard = ({ id, name, description, banner, memberCount, technologies, members = [], onMembershipChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = React.useState(false);
  const isMember = user ? members.includes(user.uid) : false;

  const handleJoinLeave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsJoining(true);
    try {
      if (isMember) {
        await leaveGroup(id, user.uid);
      } else {
        await joinGroup(id, user.uid);
      }
      if (onMembershipChange) {
        onMembershipChange();
      }
    } catch (error) {
      console.error('Error updating group membership:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleClick = () => {
    navigate(`/groups/${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-[#333333]">
      {/* Banner */}
      <div 
        className="h-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      />
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 
              className="text-xl font-semibold text-gray-800 dark:text-white cursor-pointer hover:text-[#bd9260] dark:hover:text-[#8293ff]"
              onClick={handleClick}
            >
              {name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {memberCount} {memberCount === 1 ? 'miembro' : 'miembros'}
            </p>
          </div>
          
          <button
            onClick={handleJoinLeave}
            disabled={isJoining}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              isMember
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                : 'bg-[#bd9260] text-white hover:bg-[#ce9456]/80 dark:bg-blue-600 dark:hover:bg-blue-700'
            }`}
          >
            {isJoining ? 'Procesando...' : isMember ? 'Abandonar' : 'Unirse'}
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {technologies?.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm dark:bg-gray-700 dark:text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
