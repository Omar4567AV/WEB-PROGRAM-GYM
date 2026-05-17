import React from 'react';
import { ProgressPhoto } from '../../types/progress.types';
import { formatDate } from '../../utils/formatters';
import { Trash2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface PhotoCardProps {
  photo: ProgressPhoto;
  onDelete?: (id: string) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onDelete }) => {
  return (
    <div className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-[3/4]">
      <img 
        src={photo.imageUrl} 
        alt={`${photo.type} view on ${formatDate(photo.date)}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex justify-between items-end">
          <div>
            <Badge variant="primary" size="sm" className="mb-2">
              {photo.type}
            </Badge>
            <p className="text-white font-medium text-sm">
              {formatDate(photo.date)}
            </p>
            {photo.weightAtTime && (
              <p className="text-gray-300 text-xs mt-1">
                {photo.weightAtTime} kg
              </p>
            )}
          </div>
          
          {onDelete && (
            <button 
              onClick={() => onDelete(photo.id)}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
