import React, { useState } from "react";
import { ChromePicker } from "react-color";
import {
  Slider,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// 스타일 정의
const Container = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const ControlGroup = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const Control = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const ColorPickerContainer = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const ButtonGroup = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: theme.spacing(2),
}));

const LightingControlPanel = ({
  keyLightIntensity,
  setKeyLightIntensity,
  fillLightIntensity,
  setFillLightIntensity,
  handleResetCamera,
  handleCapture,
  backgroundColor,
  setBackgroundColor,
}) => {
  const [color, setColor] = useState(backgroundColor);

  const handleColorChange = (newColor) => {
    const { hex } = newColor;
    setColor(hex);
    setBackgroundColor(hex);
  };

  return (
    <Container>
      <Typography variant="h6">Lighting Control</Typography>

      <ControlGroup>
        <Control>
          <Typography>Key Light Intensity:</Typography>
          <Slider
            min={-10}
            max={10}
            step={0.1}
            value={keyLightIntensity}
            onChange={(e, newValue) => setKeyLightIntensity(newValue)}
            aria-labelledby="key-light-intensity-slider"
          />
          <TextField
            type="number"
            InputProps={{ inputProps: { min: -10, max: 10, step: 0.1 } }}
            value={keyLightIntensity}
            onChange={(e) => setKeyLightIntensity(parseFloat(e.target.value))}
            variant="outlined"
          />
        </Control>

        <Control>
          <Typography>Fill Light Intensity:</Typography>
          <Slider
            min={0}
            max={10}
            step={0.1}
            value={fillLightIntensity}
            onChange={(e, newValue) => setFillLightIntensity(newValue)}
            aria-labelledby="fill-light-intensity-slider"
          />
          <TextField
            type="number"
            InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
            value={fillLightIntensity}
            onChange={(e) => setFillLightIntensity(parseFloat(e.target.value))}
            variant="outlined"
          />
        </Control>
      </ControlGroup>

      <ColorPickerContainer>
        <Typography variant="h6">Background Color</Typography>
        <Box>
          <ChromePicker color={color} onChangeComplete={handleColorChange} />
        </Box>
      </ColorPickerContainer>

      <ButtonGroup>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleResetCamera}
        >
          Reset Camera
        </Button>
        <Button variant="contained" color="primary" onClick={handleCapture}>
          Capture
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default LightingControlPanel;
