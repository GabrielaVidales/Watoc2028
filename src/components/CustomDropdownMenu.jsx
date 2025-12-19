import React, { useState } from "react";
import { Box, Button, createTheme, Menu, MenuList, ThemeProvider, Typography } from "@mui/material";
import './CustomDropdownMenu.css'
import { KeyboardArrowDown } from "@mui/icons-material";

const CustomDropdownMenu = ({ textBlack = false, children }) => {

    return (
        <Box class="dropdown">
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                transition: '0.3s ease',
                color: (textBlack) ? 'black' : 'white',
            }} >
                <Typography variant="h6" component="div" sx={{

                }} >
                    About
                </Typography>
                <KeyboardArrowDown />
                <div ></div>
            </Box>
            <MenuList class="dropdown-content">
                {children}
            </MenuList>
        </Box>
    );
};

export default CustomDropdownMenu;
