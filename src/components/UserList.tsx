import { useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import {
  Paper,
  IconButton,
  CircularProgress,
  Box,
  Typography,
  Stack,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import type { User } from '../types';
import { formFieldsConfig } from '../config/formConfig';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onCreate: () => void;
  isLoading?: boolean;
}

const UserList = ({
  users,
  onEdit,
  onDelete,
  onCreate,
  isLoading = false,
}: UserListProps) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDeleteClick = (user: User) => {
    setDeletingId(user.id || null);
    onDelete(user);
  };

  
  const columns: GridColDef[] = [
    {
      field: 'serialNumber',
      headerName: 'Serial No.',
      flex: 0.2,
      sortable: false,
      filterable: false,
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1,
    },
    ...formFieldsConfig.map((field) => ({
      field: field.name,
      headerName: field.label,
      flex: 0.2,
      sortable: true,
    })),
    {
      field: 'actions',
      headerName: 'Actions',
       flex: 0.2,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const user = users.find((u) => u.id === params.row.id);
        return user ? (
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(user)}
              title="Edit user"
              disabled={isLoading}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteClick(user)}
              title="Delete user"
              disabled={isLoading || deletingId === user.id}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        ) : null;
      },
    },
  ];

  if (isLoading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
     
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 600,
          }}
        >
          User List 
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreate}
          disabled={isLoading}
          sx={{
            textTransform: 'none',
            fontSize: '1rem',
            px: 3,
          }}
        >
          Create User
        </Button>
      </Box>

      {users.length === 0 ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Typography color="textSecondary" sx={{ fontSize: '1.1rem' }}>
            No users found. Click "Create User" to add one!
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ width: '100%', '& .MuiDataGrid-root': { border: 'none' } }}>
          <DataGrid
            rows={users}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            disableRowSelectionOnClick
            loading={isLoading}
            autoHeight
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              '& .MuiDataGrid-cell:hover': {
                cursor: 'pointer',
              },
            }}
          />
        </Box>
      )}
    </>
  );
};

export default UserList;
