import { ProgressPhoto } from '../types/progress.types';

export const mockPhotos: ProgressPhoto[] = [
  // Client 1 Photos
  {
    id: 'photo-1-1',
    clientId: 'client-1',
    date: '2024-03-01',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    type: 'front',
    weightAtTime: 85,
  },
  {
    id: 'photo-1-2',
    clientId: 'client-1',
    date: '2024-04-01',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    type: 'front',
    weightAtTime: 86.5,
  },
  {
    id: 'photo-1-3',
    clientId: 'client-1',
    date: '2024-04-01',
    imageUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400',
    type: 'side',
    weightAtTime: 86.5,
  },
  
  // Client 2 Photos
  {
    id: 'photo-2-1',
    clientId: 'client-2',
    date: '2024-03-05',
    imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400',
    type: 'front',
    weightAtTime: 65,
  },
  {
    id: 'photo-2-2',
    clientId: 'client-2',
    date: '2024-04-05',
    imageUrl: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400',
    type: 'front',
    weightAtTime: 62.5,
  },
  {
    id: 'photo-2-3',
    clientId: 'client-2',
    date: '2024-04-05',
    imageUrl: 'https://images.unsplash.com/photo-1574680094822-55ad615d729c?w=400',
    type: 'back',
    weightAtTime: 62.5,
  },
];

export default mockPhotos;
