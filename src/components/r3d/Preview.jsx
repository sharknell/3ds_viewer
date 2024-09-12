import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Preview = ({ capturedImage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxWidth: { xs: "100%", sm: 400 },
        mx: "auto",
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        캡처된 이미지
      </Typography>
      <Card sx={{ width: "100%", boxShadow: 3 }}>
        {capturedImage ? (
          <CardMedia
            component="img"
            image={capturedImage}
            alt="캡처된 미리보기"
            sx={{
              height: isMobile ? 300 : 400,
              objectFit: "contain",
              maxWidth: "100%",
            }}
          />
        ) : (
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              미리보기 없음
            </Typography>
          </CardContent>
        )}
      </Card>
    </Box>
  );
};

export default React.memo(Preview);
