import React, { useState, useEffect } from 'react';
import { getUserFavorites } from '../../auth/services/userService';
import ProjectCard from './ProjectCard';
import { NewLoader } from '../../common/components/Loader';

const FavoritesList = ({ userId }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const userFavorites = await getUserFavorites(userId);
        setFavorites(userFavorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center">
        <NewLoader />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400">
        No hay proyectos favoritos aún
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {favorites.map(project => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
};

export default FavoritesList;
