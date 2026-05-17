import React, { useState } from 'react';
import { Modal, Input, Select, Button } from '../../components/ui';
import { photoService } from '../../services/photoService';
import { ProgressPhoto } from '../../types/progress.types';
import { toast } from 'react-hot-toast';

interface PhotoUploadProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  onSuccess: (photo: ProgressPhoto) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  isOpen,
  onClose,
  clientId,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [type, setType] = useState<ProgressPhoto['type']>('front');
  const [weightAtTime, setWeightAtTime] = useState('');

  const resetForm = () => {
    setImageUrl('');
    setType('front');
    setWeightAtTime('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const photo = await photoService.uploadPhoto({
        clientId,
        date: new Date().toISOString().split('T')[0],
        imageUrl,
        type,
        ...(weightAtTime ? { weightAtTime: Number(weightAtTime) } : {}),
      });
      toast.success('Photo uploaded!');
      onSuccess(photo);
      handleClose();
    } catch {
      toast.error('Failed to upload photo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Progress Photo">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Image URL"
          type="url"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />

        <Select
          label="Photo Type"
          value={type}
          onChange={(e) => setType(e.target.value as ProgressPhoto['type'])}
          options={[
            { value: 'front', label: 'Front' },
            { value: 'side', label: 'Side' },
            { value: 'back', label: 'Back' },
          ]}
        />

        <Input
          label="Current Weight (kg)"
          type="number"
          step="0.1"
          placeholder="Optional"
          value={weightAtTime}
          onChange={(e) => setWeightAtTime(e.target.value)}
        />

        <div className="pt-2 flex gap-3">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Upload Photo
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PhotoUpload;
