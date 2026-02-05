import type { FormFieldConfig, User } from '../types';


const validateEmail = (email: string | number | null): string | null => {
  if (!email || typeof email !== 'string') return 'Invalid email';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? null : 'Invalid email address';
};

const validatePhoneNumber = (phone: string | number | null): string | null => {
  if (!phone || typeof phone !== 'string') return 'Invalid phone number';
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone) ? null : 'Invalid phone number (minimum 10 digits)';
};

const validateName = (name: string | number | null): string | null => {
  if (!name || typeof name !== 'string') return 'Name is required';
  return name.trim().length >= 2 ? null : 'Name must be at least 2 characters';
};


export const formFieldsConfig: FormFieldConfig[] = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    required: true,
    placeholder: 'Enter first name',
    validation: validateName,
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    required: true,
    placeholder: 'Enter last name',
    validation: validateName,
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    placeholder: 'example@domain.com',
    validation: validateEmail,
  },
  {
    name: 'phoneNumber',
    label: 'Phone Number',
    type: 'tel',
    required: true,
    placeholder: '+1 (555) 123-4567',
    validation: validatePhoneNumber,
  },

];

export const getFieldConfig = (fieldName: keyof User): FormFieldConfig | undefined => {
  return formFieldsConfig.find((field) => field.name === fieldName);
};

export const validateForm = (user: Partial<User>): Record<string, string> => {
  const errors: Record<string, string> = {};

  formFieldsConfig.forEach((field) => {
    const value = user[field.name];

    // Check if required
    if (field.required && (!value || value === '')) {
      errors[field.name] = `${field.label} is required`;
    }

    // Run custom validation if provided
    if (value && field.validation) {
      const error = field.validation(value as string);
      if (error) {
        errors[field.name] = error;
      }
    }
  });

  return errors;
};
