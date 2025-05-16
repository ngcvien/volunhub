"use client"

import React from "react"
import { List, ListItemButton, ListItemText, Divider } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledList = styled(List)(({ theme }) => ({
  width: "100%",
  maxWidth: 360,
  backgroundColor: theme.palette.background.paper,
}))

const ROOM_URL = "https://rooms.xyz/akueng/lab"

const UserRooms: React.FC = () => {
  return (
    <StyledList component="nav" aria-label="user rooms">
      <ListItemButton
        onClick={() => window.open(ROOM_URL, "_blank", "noopener,noreferrer")}
      >
        <ListItemText primary="Phòng thử nghiệm: akueng/lab" secondary={ROOM_URL} />
      </ListItemButton>
      <Divider />
    </StyledList>
  )
}

export default UserRooms