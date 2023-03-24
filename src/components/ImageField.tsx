import { uploadImage } from '@/server/manager';
import { Popover } from '@headlessui/react'
import { render } from '@headlessui/react/dist/utils/render';
import { constants } from 'buffer';
import EmojiPicker from 'emoji-picker-react'
import { useState } from "react";

import { useDropzone } from "react-dropzone";

export const ImageField = ({
  // value,
  onChange,
}: {
  // value: string
  onChange: (v: any) => void
}) => {
  const [image, setImage] = useState();
  const onDrop = (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result);
      // 调用上传图片的函数
      onChange(file);
      // uploadImage(file).then((filePath) => {
      //   onChange(filePath);
      // });
    };
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000, // 5000KB limit
  });



  return (
    <div style={{ position: "relative", width: "60px", height: "60px" }}>
      <img src={image || 'https://via.placeholder.com/60x60'}
        alt="Uploaded"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{ position: "absolute", top: 0, left: 0, width: "60px", height: "60px" }}>
        <input {...getInputProps()} style={{ width: "100%", height: "100%", opacity: 0 }} />
      </div>
    </div>

  );
}

