
export async function uploadFile(file: File): Promise<string> {
    console.log("uploadFile");

    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("http://localhost:3002/api/uploadFile", {
        method: "POST",
        body: formData,
    });
    const data = await response.json();
    if (data.fullPath) {
        return data.fullPath;
    } else {
        throw new Error("Failed to upload file.");
    }
};

// 上传图片的函数
export async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('http://localhost:3002/api/uploadImage', {
        method: 'POST',
        headers: {
            // 添加请求头信息
            // 'Content-Type': 'multipart/form-data'
        },
        body: formData
    });
    const data = await response.json();
    if (data.fullPath) {
        return data.fullPath;
    } else {
        throw new Error('Failed to upload file.');
    }
};

// 删除图片
export async function deleteFile(type: string, filePath: string) {
    const params = { type: type, filePath: filePath };
    const response = await fetch('http://localhost:3002/api/deleteFile', {
        method: 'POST',
        headers: {
            // 添加请求头信息
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    });
    const data = await response.json();
    if (data.status) {
        return data.status;
    } else {
        throw new Error('Failed to upload file.');
    }
};


// export default Manager;