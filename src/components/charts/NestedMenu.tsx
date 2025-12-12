import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  ListItemText,
  ListItemIcon,
  Box,
  Button,
  Typography,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { Dayjs } from "dayjs";

const NestedMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [nestedMenuEl, setNestedMenuEl] = useState<null | HTMLElement>(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [tempStartDate, setTempStartDate] = useState<Dayjs | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Dayjs | null>(null);
  const [isPickerOpen, setPickerOpen] = useState(true);

  const handleMainMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMainMenuClose = () => {
    setAnchorEl(null);
    setNestedMenuEl(null);
  };

  const handleNestedMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNestedMenuEl(event.currentTarget);
    setPickerOpen(true);
  };

  const handleNestedMenuClose = () => {
    setNestedMenuEl(null);
    setPickerOpen(false);
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedValue(event.target.value as string);
  };

  // handlle save dates
  const handleApply = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };

  return (
    <div>
      <Select
        className="h-10"
        value={selectedValue}
        onChange={handleSelectChange}
        displayEmpty
        onClick={handleMainMenuOpen}
        onClose={handleMainMenuClose}
        renderValue={(value) => (value ? value : "Today")}
      >
        <MenuItem value="Today">Today</MenuItem>
        <MenuItem value="This week">This week</MenuItem>
        <MenuItem value="This month">This month</MenuItem>
        <MenuItem value="This year">This year</MenuItem>
        <MenuItem
          value="Set up"
          onMouseEnter={(event) => handleNestedMenuOpen(event)}
        >
          <ListItemText primary="Set up" />
          <ListItemIcon>
            <ArrowRightIcon />
          </ListItemIcon>
        </MenuItem>
      </Select>

      <Menu
        anchorEl={nestedMenuEl}
        open={Boolean(nestedMenuEl)}
        onClose={handleNestedMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div className="flex p-2">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* Date picker container */}
              {isPickerOpen && (
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    backgroundColor: "white",
                    width: "fit-content",
                  }}
                >
                  {/* Button to open date picker */}
                  <div className="flex w-full items-center justify-center">
                    {startDate && endDate ? (
                      <div className="flex items-center gap-3">
                        <div className="rounded-md border p-2">
                          {startDate.format("MM.DD.YYYY")}
                        </div>
                        -
                        <div className="rounded-md border p-2">
                          {endDate.format("MM.DD.YYYY")}
                        </div>
                      </div>
                    ) : (
                      "Select Date Range"
                    )}
                  </div>

                  <Typography variant="h6">Select Start Date</Typography>
                  <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    orientation="portrait"
                    value={tempStartDate}
                    sx={{
                      ".css-xi742h-MuiButtonBase-root-MuiPickersDay-root.Mui-selected":
                        {
                          color: "white",
                        },
                    }}
                    onChange={(newValue) => setTempStartDate(newValue)}
                  />

                  <Typography variant="h6">Select End Date</Typography>
                  <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    sx={{
                      ".css-xi742h-MuiButtonBase-root-MuiPickersDay-root.Mui-selected":
                        {
                          color: "white",
                        },
                    }}
                    orientation="portrait"
                    value={tempEndDate}
                    onChange={(newValue) => setTempEndDate(newValue)}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Button variant="outlined" onClick={handleNestedMenuClose}>
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleApply}
                    >
                      Apply
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </LocalizationProvider>
        </div>
      </Menu>
    </div>
  );
};

export default NestedMenu;
