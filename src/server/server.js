
const path = require('path');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const fs = require('fs')

// 允许跨域请求
app.use(cors());
// app.all('*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", req.headers.origin);
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header("X-Powered-By", ' 3.2.1');
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });
app.use(express.static('public/uploadImages'));
app.use(express.static('public/uploadFiles'));
app.use(express.json());
// 配置 multer 上传文件的存储路径和文件名
const storageImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploadImages/'); // 上传图片存储的路径
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const fileName = Buffer.from(file.originalname, "latin1").toString("utf-8"); // 指定字符编码为 utf-8
        cb(null, `${timestamp}-${fileName}`); // 上传图片的文件名
    }

});

const storageFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploadFiles/'); // 指定字符编码为 utf-8
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const fileName = Buffer.from(file.originalname, "latin1").toString("utf-8");
        cb(null, `${timestamp}-${fileName}`);
    }
});

// 创建 multer 实例，配置上传文件的参数
const uploadImage = multer({
    storage: storageImage,
    limits: {
        fileSize: 50000000 // 限制上传文件大小为 5MB
    },
    fileFilter: (req, file, cb) => {
        // 只接受Image 类型文件
        if (!file.originalname.match(/.(jpg|jpeg|png|PNG|JPG)$/)) {
            return cb(new Error('只能上传图片文件'));
        }
        cb(null, true);
    }
});

const uploadFiles = multer({
    storage: storageFile,
    limits: {
        fileSize: 50000000
    },
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

// 处理 POST 请求 /api/uploadImage 的路由
app.post('/api/uploadImage', uploadImage.single('file'), (req, res) => {
    const filePath = req.file.filename; // 获取上传图片的路径
    const fullPath = `http://192.168.50.178:3002/${filePath}`; // 构造完整的网络请求地址
    console.log(fullPath);
    try {
        res.json({ fullPath }); // 返回上传成功的文件路径
    } catch (err) {
        res.status(500).json({ message: err.message }); // 返回上传失败的错误信息
    }
});

// 处理 POST 请求 /api/uploadFile 的路由
app.post('/api/uploadFile', uploadFiles.single('file'), (req, res) => {
    const filePath = req.file.filename; // 获取上传图片的路径
    const fullPath = `http://192.168.50.178:3002/${filePath}`; // 构造完整的网络请求地址
    try {
        res.json({ fullPath }); // 返回上传成功的文件路径
    } catch (err) {
        res.status(500).json({ message: err.message }); // 返回上传失败的错误信息
    }
});

// 删除
app.post('/api/deleteFile', (req, res) => {
    const filePath = req.body.filePath;
    const url = new URL(filePath);
    const fileName = url.pathname.split('/').pop();
    const type = req.body.type;

    var path = `public/uploadImages/${fileName}`;
    if (type === 'file') {
        path = `public/uploadFiles/${fileName}`;
    }
    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
            console.log('image not found');
            return;
        }
    })
    fs.unlink(path, (err) => {
        if (err) {
            return;
        }
        res.json({ status: 'success', message: 'Image Deleted' })
    })
});


app.get('/api/test', function (req, res) {
    res.send('wwwwww');
});

// 启动服务器，监听 3002 端口
app.listen(3002, () => {
    console.log('Server started on port 3002');
});
