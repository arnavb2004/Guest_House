import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, updateUserDetails } from "../redux/userSlice"; // Ensure this action is correctly implemented in your slice
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from "./Menu"; // Assuming Menu is a correctly implemented component
import Logo from "../images/IIT-logo.png"; // Ensure the path is correct
import EditIcon from '@mui/icons-material/Edit';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import EmailIcon from '@mui/icons-material/Email';

const Header = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showHindi, setShowHindi] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editableName, setEditableName] = useState(user.name);
  const [editableContact, setEditableContact] = useState(user.contact || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowHindi((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const goToLoginPage = () => {
    navigate("/login");
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setIsEditing(false); // Disable editing mode when the dialog is opened
    // Reset editable fields to current user details when dialog opens
    setEditableName(user.name);
    setEditableContact(user.contact || '');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateUserDetails = () => {
    dispatch(updateUserDetails({ name: editableName, contact: editableContact }));
    setIsEditing(false); // Exit editing mode after updating
    setOpenDialog(false);
  };

  const handleEnableEditing = () => {
    setIsEditing(true); // Enable editing mode
  };

  return (
    <div className="header flex flex-col items-center bg-gray-50">
      <div className="header-container w-5/6 px-10 h-40 grid grid-cols-12 py-2 pb-5">
        <div className="flex gap-4 w-28 h-32 pt-4">
          <img src={Logo} alt="IIT Ropar logo" />
        </div>
        <div className="col-span-6 flex flex-col pl-5 justify-end pb-2">
          <a
              className='font-["Dosis"] text-5xl text-justify  font-bold'
              href="/"
            >
              GUEST HOUSE
            </a>
            <a
              className='text-3xl text-justify min-w-max font-medium font-["Dosis"]'
              href="/"
            >
              <div className="flex flex-col h-9 py-1 ">
                <div className={!showHindi && "h-0 overflow-hidden"}>
                  भारतीय प्रौद्योगिकी संस्थान रोपड़
                </div>
                <div className={showHindi && "h-0 overflow-hidden"}>
                  INDIAN INSTITUTE OF TECHNOLOGY ROPAR
                </div>
              </div>
            </a>
        </div>
        <div className='font-["Dosis"] col-span-4 uppercase flex p-3 pr-12 flex-col w-full justify-end mb-4 text-2xl text-right font-medium items-center'>
        {user.email && (
              <div className="cursor-default flex items-center">
                <IconButton onClick={handleOpenDialog} size="large">
                  <AccountCircleIcon />
                </IconButton>
                <div className="ml-2">HELLO {user.name}</div>
              </div>
            )}
            {user.email ? (
              <div className="cursor-pointer mt-2" onClick={handleLogout}>
                LOGOUT
              </div>
            ) : (
              <div className="cursor-pointer mt-2" onClick={goToLoginPage}>
                LOGIN
              </div>
            )}
            
          <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>User Information</DialogTitle>
          <DialogContent>
            {isEditing ? (
              <>
                <TextField
                  margin="dense"
                  id="name"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={editableName}
                  onChange={(e) => setEditableName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                    ),
                  }}
                />
                <TextField
                  margin="dense"
                  id="email"
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={user.email}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                    ),
                  }}
                />
                <TextField
                  margin="dense"
                  id="contact"
                  label="Contact"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={editableContact}
                  onChange={(e) => setEditableContact(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <ListItemIcon>
                        <ContactPhoneIcon />
                      </ListItemIcon>
                    ),
                  }}
                />
              </>
            ) : (
              <>
                <TextField
                  margin="dense"
                  id="name"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={user.name}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                    ),
                  }}
                />
                <TextField
                  margin="dense"
                  id="email"
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={user.email}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                    ),
                  }}
                />
                <TextField
                  margin="dense"
                  id="contact"
                  label="Contact"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={user.contact}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <ListItemIcon>
                        <ContactPhoneIcon />
                      </ListItemIcon>
                    ),
                  }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            {isEditing ? (
              <>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={handleUpdateUserDetails}>Save Changes</Button>
              </>
            ) : (
              <>
                <IconButton onClick={handleEnableEditing} size="small">
                  <EditIcon />
                </IconButton>
                <Button onClick={handleCloseDialog}>Close</Button>
              </>
            )}
          </DialogActions>
        </Dialog>
        </div>
      </div>
      <Menu />
    </div>
  );
};

export default Header;
