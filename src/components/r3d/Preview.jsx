import React from "react";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";

const Preview = ({ capturedImage }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Captured Image
      </Typography>
      <Card sx={{ width: "100%", boxShadow: 3 }}>
        {capturedImage ? (
          <CardMedia
            component="img"
            image={capturedImage}
            alt="Captured Preview"
            sx={{ height: 400, objectFit: "contain" }}
          />
        ) : (
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              No Preview Available
            </Typography>
          </CardContent>
        )}
      </Card>
    </Box>
  );
};

export default Preview;
