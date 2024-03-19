import  React from "react";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputFileUpload({onFileUpload}) {
  const onFileChange=(event)=>{
    const file=event.target.files[0];
    if(file){
      onFileUpload(file);
    }
  }
  return (
    <Button
      component="label"
      role={undefined}
      className=" w-36"
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput
        type="file"
        onChange={onFileChange}
      />
    </Button>
  );
}
