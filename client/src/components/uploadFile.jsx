import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DoneIcon from "@mui/icons-material/Done";

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

export default function InputFileUpload({ onFileUpload }) {
  const onFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      onFileUpload(files);
    }
  };
  return (
    <Button
      component="label"
      role={undefined}
      className="w-fit"
      variant="contained"
      tabIndex={-1}
      // startIcon={}
    >
      <div className="flex py-2 gap-4 items-center">
        <CloudUploadIcon />
        <div className="font-semibold font-['Dosis']">Upload file</div>
        <VisuallyHiddenInput type="file" multiple onChange={onFileChange} />
      </div>
    </Button>
  );
}
