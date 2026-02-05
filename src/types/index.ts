// Define field types for form builder
export type FieldType = 'text' | 'email' | 'tel' | 'date' | 'number' | 'textarea';

export interface FormFieldConfig {
  name: keyof User;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  validation?: (value: string | number | null) => string | null;
}

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
