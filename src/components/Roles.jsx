import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { TextField, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import InfoIcon from '@mui/icons-material/Info';

// Demo data
const demoData = [
  { id: 1, projectName: 'Project 1', manager: ['John'], managerDescription: 'Lead Manager', engineer: ['Alice'], engineerDescription: 'Senior Engineer' },
  { id: 2, projectName: 'Project 2', manager: ['Bob'], managerDescription: 'Project Manager', engineer: ['Eve'], engineerDescription: 'Junior Engineer' },
  { id: 3, projectName: 'Project 3', manager: ['Charlie'], managerDescription: 'Technical Manager', engineer: ['David'], engineerDescription: 'Lead Engineer' },
];

// Column configuration
const columnConfig = [
  { field: 'projectName', headerName: 'Project', type: 'readonly' }, // Not editable
  { field: 'manager', headerName: 'Manager', type: 'people' },
  { field: 'managerDescription', headerName: 'Manager Description', type: 'text' },
  { field: 'engineer', headerName: 'Engineer', type: 'people' },
  { field: 'engineerDescription', headerName: 'Engineer Description', type: 'text' },
];

// Demo people list for selection
const people = ['John', 'Bob', 'Charlie', 'Alice', 'Eve', 'David'];

const Roles = () => {
  const [data, setData] = useState(demoData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogField, setDialogField] = useState('');
  const [dialogType, setDialogType] = useState('');
  const [textValue, setTextValue] = useState('');
  const [selectedPeople, setSelectedPeople] = useState([]);

  const handleRowSelection = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const handlePeopleChange = (event, newValue) => {
    setSelectedPeople(newValue ?? []);
  };

  const openEditDialog = (field, type) => {
    setDialogField(field);
    setDialogType(type);
    setOpenDialog(true);

    if (type === 'people') {
      // Get unique people from selected rows
      const selectedPeopleSet = new Set();
      selectedRows.forEach((rowId) => {
        const row = data.find((item) => item.id === rowId);
        if (row && row[field]) {
          row[field].forEach((person) => selectedPeopleSet.add(person));
        }
      });
      setSelectedPeople(Array.from(selectedPeopleSet));
    } else if (type === 'text') {
      setTextValue('');
    }
  };

  const handleUpdate = () => {
    if (selectedRows.length === 0) {
      alert('Please select rows.');
      return;
    }

    const updatedData = data.map((row) => {
      if (selectedRows.includes(row.id)) {
        return { ...row, [dialogField]: dialogType === 'people' ? selectedPeople : textValue };
      }
      return row;
    });

    setData(updatedData);
    setOpenDialog(false);
    setSelectedPeople([]);
    setTextValue('');
  };

  const columns = columnConfig.map(({ field, headerName, type }) => ({
    field,
    headerName,
    width: 250,
    sortable: false,
    renderHeader: (params) => (
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <span>{params.colDef.headerName}</span>
        {type === 'people' && <PeopleIcon sx={{ marginLeft: 1 }} fontSize="small" />}
        {type === 'text' && <InfoIcon sx={{ marginLeft: 1 }} fontSize="small" />}
        {type !== 'readonly' && (
          <IconButton
            onClick={() => openEditDialog(field, type)}
            disabled={selectedRows.length === 0}
            sx={{ marginLeft: 2 }}
            size="small"
          >
            <EditIcon />
          </IconButton>
        )}
      </Box>
    ),
  }));

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={handleRowSelection}
        slots={{ toolbar: GridToolbar }}
        hideFooter
      />

      {/* Dialog for bulk update */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} sx={{ '& .MuiDialog-paper': { minWidth: 600 } }}>
        <DialogTitle>Edit {columnConfig.find(col => col.field === dialogField)?.headerName}</DialogTitle>
        <DialogContent sx={{ paddingTop: '20px !important' }}>
          {dialogType === 'people' ? (
            <Autocomplete
              multiple
              options={people}
              value={selectedPeople}
              onChange={handlePeopleChange}
              renderInput={(params) => <TextField {...params} label="Select People" variant="outlined" />}
              fullWidth
            />
          ) : (
            <TextField
              label="New Value"
              variant="outlined"
              fullWidth
              value={textValue}
              onChange={handleTextChange}
              autoFocus
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Roles;
