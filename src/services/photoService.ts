import { ProgressPhoto } from '../types/progress.types';
import { mockPhotos } from '../data/mockPhotos';

/**
 * Service for managing client progress photos.
 */
export const photoService = {
  /**
   * Fetch all progress photos for a client
   */
  getPhotosByClientId: async (clientId: string): Promise<ProgressPhoto[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockPhotos
      .filter((p) => p.clientId === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  /**
   * Upload a new progress photo
   */
  uploadPhoto: async (photoData: Omit<ProgressPhoto, 'id'>): Promise<ProgressPhoto> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newPhoto: ProgressPhoto = {
      ...photoData,
      id: 'photo-' + Date.now(),
    };
    // In a real app, this would be a multipart/form-data upload
    return newPhoto;
  },

  /**
   * Delete a progress photo
   */
  deletePhoto: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  },
};

export default photoService;
