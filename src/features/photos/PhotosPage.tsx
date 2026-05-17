import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { photoService } from '../../services/photoService';
import { ProgressPhoto } from '../../types/progress.types';
import { PhotoCard } from '../../components/cards';
import { Spinner, Button } from '../../components/ui';
import { Camera, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const PhotosPage: React.FC = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadPhotos();
    }
  }, [user?.id]);

  const loadPhotos = () => {
    if (user?.id) {
      setIsLoading(true);
      photoService.getPhotosByClientId(user.id)
        .then(setPhotos)
        .finally(() => setIsLoading(false));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await photoService.deletePhoto(id);
        setPhotos(photos.filter(p => p.id !== id));
        toast.success('Photo deleted successfully');
      } catch (error) {
        toast.error('Failed to delete photo');
      }
    }
  };

  if (isLoading) return <Spinner size="lg" />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Progress Photos</h2>
          <p className="text-gray-500 font-medium">A visual timeline of your transformation.</p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />}>
          Upload Photos
        </Button>
      </div>

      {photos.length === 0 ? (
        <div className="card text-center py-24 border-2 border-dashed border-gray-200 bg-transparent shadow-none">
          <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Photos Yet</h3>
          <p className="text-gray-500 mb-6">Start documenting your journey by uploading your first progress photo.</p>
          <Button leftIcon={<Plus className="w-5 h-5" />}>Upload Now</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <PhotoCard 
              key={photo.id} 
              photo={photo} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotosPage;
