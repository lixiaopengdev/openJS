import { useState } from "react";

import { useDropzone } from "react-dropzone";
import { uploadFile } from "../server/manager";
export const FileField = ({
  value,
  onChange,
}: {
  value: string
  onChange: (v: any) => void
}) => {
  const [filename, setFilename] = useState<string>("选择文件");
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = async (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    setFilename(file.name);
    setIsUploading(true);

    try {
      // const filePath = await uploadFile(file);
      onChange(file);
    } catch (err) {
      console.error(err);
      setFilename("上传失败，请重试");
      onChange("");
    }

    setIsUploading(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {},
    maxSize: 50000000, // 500KB limit
  });


  return (
    <div style={{ position: "relative", width: "fit-content", maxWidth: "100%", marginTop: "10px" }}>
      <div
        {...getRootProps()}
        style={{
          width: "fit-content",
          display: "inline-block",
          fontSize: "16px",
          color: "#1e90ff",
          cursor: "pointer",
        }}
      >
        {isUploading ? "上传中..." : filename}
      </div>
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        <input {...getInputProps()} style={{ display: "none" }} />
      </div>
    </div>
  );
};
