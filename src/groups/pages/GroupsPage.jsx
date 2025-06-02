import React, { useState, useEffect } from 'react';
import { getAllGroups, searchGroups } from '../services/groupService';
import GroupCard from '../components/GroupCard';
import { NewLoader } from '../../common/components/Loader';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const allGroups = await getAllGroups();
      setGroups(allGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length >= 2) {
      try {
        const results = await searchGroups(term);
        setGroups(results);
      } catch (error) {
        console.error('Error searching groups:', error);
      }
    } else if (term.length === 0) {
      loadGroups();
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 dark:text-white">
          Grupos de Interés
        </h1>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar grupos por nombre o tecnología..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#bd9260] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.length > 0 ? (
          groups.map(group => (
            <GroupCard 
              key={group.id} 
              {...group} 
              onMembershipChange={loadGroups}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No se encontraron grupos' : 'No hay grupos disponibles'}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;
