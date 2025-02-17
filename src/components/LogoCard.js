import React from "react";
import { Card, CardActionArea, CardMedia } from "@mui/material";

const LogoCard = ({ logoUrl, onClick }) => {
  return (
    <Card sx={{ maxWidth: 120, cursor: "pointer" }} onClick={onClick}>
      <CardActionArea>
        <CardMedia component="img" image={logoUrl} alt="Logo" />
      </CardActionArea>
    </Card>
  );
};

export default LogoCard;
