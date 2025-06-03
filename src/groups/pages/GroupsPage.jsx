import React, { useState, useEffect } from 'react';
import { getAllGroups } from '../services/groupService';
import GroupCard from '../components/GroupCard';
import { NewLoader } from '../../common/components/Loader';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    // Filtrar grupos cuando cambie el término de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = groups.filter(group =>
        group.name.toLowerCase().includes(searchLower) ||
        group.description.toLowerCase().includes(searchLower)
      );
      setFilteredGroups(filtered);
    } else {
      setFilteredGroups(groups);
    }
  }, [searchTerm, groups]);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const allGroups = await getAllGroups();
      setGroups(allGroups);
      setFilteredGroups(allGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar cambios en membresía
  const handleMembershipChange = () => {
    loadGroups(); // Recargar grupos cuando cambie la membresía
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Grupos de Interés</h1>
        {user && (
          <Link 
            to="/create-group"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Crear Grupo
          </Link>
        )}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar grupos..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <GroupCard 
              key={group.id} 
              {...group} 
              onMembershipChange={handleMembershipChange}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {searchTerm ? 'No se encontraron grupos que coincidan con tu búsqueda.' : 'No hay grupos creados aún.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
