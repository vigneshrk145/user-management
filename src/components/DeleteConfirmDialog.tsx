import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
  userName?: string;
}

const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  userName,
}: DeleteConfirmDialogProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !isLoading && onClose()}
      aria-labelledby="delete-dialog-title"
    >
      <DialogTitle id="delete-dialog-title">Delete User?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {userName
            ? `Are you sure you want to delete ${userName}? This action cannot be undone.`
            : 'Are you sure you want to delete this user? This action cannot be undone.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} />}
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
