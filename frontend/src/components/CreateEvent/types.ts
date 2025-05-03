export interface FormData {
  title: string;
  description: string;
  location: string;
  eventTime: string;
  imageUrl: string | null;
  maxParticipants: number;
  requirements: string;
  contactInfo: string;
}

export interface StepProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string | number) => void;
  errors: Partial<FormData>;
  touched: Partial<Record<keyof FormData, boolean>>;
}

export interface ImageStepProps extends Omit<StepProps, 'handleInputChange'> {
  handleFileUpload: (file: File) => void;
  uploadProgress: number;
  isUploading: boolean;
}

export interface DetailsStepProps extends StepProps {
  provinces: Province[];
}