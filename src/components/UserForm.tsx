import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Stack,
} from '@mui/material';
import type { User } from '../types';
import { formFieldsConfig } from '../config/formConfig';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: Omit<User, 'id'>) => Promise<void>;
  initialData?: User;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

const UserForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  mode,
}: UserFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<User, 'id'>>({
    mode: 'onBlur',
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
      });
    }
  }, [initialData, reset, open]);

  const onFormSubmit: SubmitHandler<Omit<User, 'id'>> = async (data) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <DialogTitle 
        sx={{ 
          fontWeight: 700,
          fontSize: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pb: 2,
          pt: 2.5,
        }}
      >
        {mode === 'create' ? '✨ Create New User' : '✏️ Edit User'}
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5, pb: 2 }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {formFieldsConfig.map((field) => (
            <Controller
              key={String(field.name)}
              name={field.name as keyof Omit<User, 'id'>}
              control={control}
              rules={{
                required: field.required ? `${field.label} is required` : false,
                validate: (value) => {
                  if (!value) return true;
                  if (field.validation) {
                    return field.validation(value) || true;
                  }
                  return true;
                },
              }}
              render={({ field: fieldProps }) => (
                <TextField
                  {...fieldProps}
                  label={field.label}
                  type={field.type}
                  placeholder={field.placeholder}
                  error={Boolean(errors[field.name as keyof Omit<User, 'id'>])}
                  helperText={errors[field.name as keyof Omit<User, 'id'>]?.message}
                  required={field.required}
                  fullWidth
                  variant="outlined"
                  disabled={isLoading}
                  multiline={field.type === 'textarea'}
                  rows={field.type === 'textarea' ? 4 : undefined}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#ffffff',
                        '& fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#ffffff',
                        '& fieldset': {
                          borderColor: '#667eea',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      opacity: 0.6,
                    },
                  }}
                />
              )}
            />
          ))}
        </Stack>
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: 2, 
          gap: 1,
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Button 
          onClick={onClose} 
          disabled={isLoading}
          sx={{
            textTransform: 'none',
            fontSize: '1rem',
            px: 3,
            color: '#666',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onFormSubmit)}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} />}
          sx={{
            textTransform: 'none',
            fontSize: '1rem',
            px: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(102, 126, 234, 0.6)',
            },
          }}
        >
          {isLoading ? 'Processing...' : mode === 'create' ? 'Create User' : 'Update User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
