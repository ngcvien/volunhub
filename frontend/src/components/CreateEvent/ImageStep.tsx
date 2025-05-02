import React from 'react';
import { Upload, Image as ImageIcon } from 'react-bootstrap-icons';
import { ProgressBar } from 'react-bootstrap';

interface ImageStepProps {
  formData: any;
  handleFileUpload: (file: File) => void;
  uploadProgress: number;
  isUploading: boolean;
  errors: any;
}

export const ImageStep: React.FC<ImageStepProps> = ({
  formData,
  handleFileUpload,
  uploadProgress,
  isUploading,
  errors
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="form-step">
      <div
        className={`upload-area ${formData.imageUrl ? 'has-preview' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {formData.imageUrl ? (
          <div className="preview-container">
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="preview-image"
            />
            <div className="preview-overlay">
              <Upload size={24} />
              <span>Thay đổi ảnh</span>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <ImageIcon size={48} className="upload-icon" />
            <p>Kéo thả ảnh vào đây hoặc click để chọn</p>
            <small>Kích thước đề xuất: 1200x630px</small>
          </div>
        )}

        {isUploading && (
          <ProgressBar
            now={uploadProgress}
            label={`${uploadProgress}%`}
            className="mt-3"
          />
        )}

        {errors.imageUrl && (
          <div className="invalid-feedback d-block">
            {errors.imageUrl}
          </div>
        )}
      </div>
    </div>
  );
};