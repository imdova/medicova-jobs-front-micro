interface FormErrors {
  email: string;
  phone: string;
  companyTypeId: string;
  name: string;
}

interface FileWithPreview extends File {
  preview: string;
  uploaded?: boolean;
}

interface UploadResponse {
  message?: string;
  fileId?: string;
  fileUrl?: string;
  error?: string;
  fileName?: string;
}

interface Folder {
  id: string;
  name: string;
  companyId: string;
  seekersCount: number;
  _version: number;
  created_at: string;
  updated_at: string;
}
