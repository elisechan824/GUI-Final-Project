/*
 * Project 1
 * MenuBar component JavaScript source code
 *
 * Author: Elise Chan (elisechan824)
 * Version: 2.0
 */

import './MenuBar.css';
import React from "react";
import Box from '@mui/material/Box';
import {
    AppBar,
    Button,
    Toolbar,
    Menu,
    MenuItem,
    DialogTitle,
    DialogContent,
    Dialog,
    DialogActions, List, ListItemText, ListItemButton
} from "@mui/material";
import TextField from "@mui/material/TextField";

const MenuBar = (props) => {
    const [fileAnchor, setFileAnchor] = React.useState(null);   //Anchor for file menu
    const [editAnchor, setEditAnchor] = React.useState(null);   //Anchor for edit menu
    const [newOpen, setNewOpen] = React.useState(false);    //New dialog state
    const [loadOpen, setLoadOpen] = React.useState(false);    //Load dialog state
    const [saveOpen, setSaveOpen] = React.useState(false);    //Save As dialog state
    const [fileName, setFileName] = React.useState('');    //New File Name
    const fileOpen = Boolean(fileAnchor);   //File Menu state
    const editOpen = Boolean(editAnchor);
    const handleFileClick = (event) => {
        setFileAnchor(event.currentTarget);
    };
    const handleEditClick = (event) => {
        setEditAnchor(event.currentTarget);
    };
    const handleFileClose = () => {
        setFileAnchor(null);
    };
    const handleEditClose = () => {
        setEditAnchor(null);
    };


    return(
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <div>
                        <Button
                            sx={{ bgcolor: 'white', color: 'blue'}}
                            id="basic-button"
                            aria-controls={fileOpen ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={fileOpen ? 'true' : undefined}
                            onClick={handleFileClick}
                        >
                            File
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={fileAnchor}
                            open={fileOpen}
                            onClose={handleFileClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={() => {setNewOpen(true)}} >New</MenuItem>
                            <Dialog open={newOpen} onClose={() => {setNewOpen(false)}}>
                                <DialogTitle>Enter File Name</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        label="File Name"
                                        fullWidth
                                        variant="standard"
                                        onChange={(e) => setFileName(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => {setNewOpen(false)}} >Cancel</Button>
                                    <Button onClick={() => {props.newFileHandler(fileName); setFileName(''); setNewOpen(false)}} >Submit</Button>
                                </DialogActions>
                            </Dialog>

                            <MenuItem onClick={() => {setLoadOpen(true);}} >Load</MenuItem>
                            <Dialog open={loadOpen} onClick={() => {setLoadOpen(false)}} >
                                <DialogTitle>Select file to load</DialogTitle>
                                <List sx={{ pt: 0 }}>
                                    {Object.keys(localStorage).map((file) => (
                                        <ListItemButton onClick={() => props.loadHandler(file)} key={file}>
                                            <ListItemText primary={file} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Dialog>

                            <MenuItem onClick={props.saveHandler}>Save</MenuItem>

                            <MenuItem onClick={() => {setSaveOpen(true)}}>Save As</MenuItem>
                            <Dialog open={saveOpen} onClose={() => {setSaveOpen(false)}}>
                                <DialogTitle>Enter File Name</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        label="File Name"
                                        fullWidth
                                        variant="standard"
                                        onChange={(e) => setFileName(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => {setSaveOpen(false)}} >Cancel</Button>
                                    <Button onClick={() => {props.saveAsHandler(fileName); setFileName(''); setSaveOpen(false)}} >Submit</Button>
                                </DialogActions>
                            </Dialog>
                        </Menu>

                        <Button
                            sx={{ bgcolor: 'white', color: 'blue'}}
                            id="basic-button2"
                            aria-controls={editOpen ? 'basic-menu2' : undefined}
                            aria-haspopup="true"
                            aria-expanded={editOpen ? 'true' : undefined}
                            onClick={handleEditClick}
                        >
                            Edit
                        </Button>
                        <Menu
                            id="basic-menu2"
                            anchorEl={editAnchor}
                            open={editOpen}
                            onClose={handleEditClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button2',
                            }}
                        >
                            <MenuItem onClick={() => props.cutHandler()} >Cut</MenuItem>
                            <MenuItem onClick={() => props.copyHandler()} >Copy</MenuItem>
                            <MenuItem onClick={() => props.pasteHandler()} >Paste</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default MenuBar;
