import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { TextField, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';

// Extended demo data
const demoData = [
  { id: 1, projectName: 'Project Alpha', manager: ['John'], managerDescription: 'Lead Manager', engineer: ['Alice'], engineerDescription: 'Senior Engineer' },
  { id: 2, projectName: 'Project Beta', manager: ['Bob'], managerDescription: 'Project Manager', engineer: ['Eve'], engineerDescription: 'Junior Engineer' },
  { id: 3, projectName: 'Project Gamma', manager: ['Charlie'], managerDescription: 'Technical Manager', engineer: ['David'], engineerDescription: 'Lead Engineer' },
  { id: 4, projectName: 'Project Delta', manager: ['Alice'], managerDescription: 'Operations Lead', engineer: ['John'], engineerDescription: 'Software Engineer' },
  { id: 5, projectName: 'Project Epsilon', manager: ['Eve'], managerDescription: 'Assistant Manager', engineer: ['Bob'], engineerDescription: 'Field Engineer' },
  { id: 6, projectName: 'Project Zeta', manager: ['David'], managerDescription: 'Chief Engineer', engineer: ['Charlie'], engineerDescription: 'Support Engineer' },
  { id: 7, projectName: 'Project Eta', manager: ['John'], managerDescription: 'Consultant', engineer: ['Alice'], engineerDescription: 'Project Engineer' },
  { id: 8, projectName: 'Project Theta', manager: ['Bob'], managerDescription: 'Team Leader', engineer: ['Eve'], engineerDescription: 'Intern' },
  { id: 9, projectName: 'Project Iota', manager: ['Charlie'], managerDescription: 'Senior Developer', engineer: ['David'], engineerDescription: 'Lead Designer' },
  { id: 10, projectName: 'Project Kappa', manager: ['Alice'], managerDescription: 'Coordinator', engineer: ['John'], engineerDescription: 'Mechanical Engineer' },
  { id: 11, projectName: 'Project Lambda', manager: ['Eve'], managerDescription: 'Scrum Master', engineer: ['Bob'], engineerDescription: 'Tech Lead' },
  { id: 12, projectName: 'Project Mu', manager: ['David'], managerDescription: 'Senior Architect', engineer: ['Charlie'], engineerDescription: 'UX Designer' },
  { id: 13, projectName: 'Project Nu', manager: ['John'], managerDescription: 'System Analyst', engineer: ['Alice'], engineerDescription: 'Network Engineer' },
];

// Column configuration
const columnConfig = [
  { field: 'projectName', headerName: 'Project', type: 'readonly' },
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
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter rows based on search query
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) => {
      if (Array.isArray(value)) {
        return value.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return String(value).toLowerCase().includes(searchQuery.toLowerCase());
    })
  );

  const columns = columnConfig.map(({ field, headerName, type }) => ({
    field,
    headerName,
    width: 250,
    sortable: false,
    renderHeader: (params) => (
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {type === 'people' && <PeopleIcon sx={{ marginRight: 1 }} fontSize="small" />}
        {type === 'text' && <InfoIcon sx={{ marginRight: 1 }} fontSize="small" />}
        <span>{params.colDef.headerName}</span>
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
    <div style={{ height: 500, width: '100%' }}>
      <Box display="flex" alignItems="center" mb={2} gap={2}>
        <SearchIcon />
        <TextField
          label="Search..."
          variant="outlined"
          fullWidth
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <DataGrid
        rows={filteredData}
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
