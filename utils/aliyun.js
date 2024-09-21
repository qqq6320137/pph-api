const multer = require('multer'); // 上传文件的 node.js 中间件
const MAO = require('multer-aliyun-oss'); // 用来配合 multer，将文件上传到阿里云 OSS 的
const OSS = require("ali-oss");  // 操作阿里云 OSS 的 SDK
const { BadRequest } = require('http-errors')

// 阿里云配置信息
const config = {
  region: process.env.ALIYUN_REGION,
  accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
  // yourbucketname填写存储空间名称。
  bucket: process.env.ALIYUN_BUCKET,
};

const client = new OSS(config);

// multer 配置信息
const upload = multer({
  storage: MAO({
    config: config,
    destination: 'uploads'  // 自定义上传目录
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制上传文件的大小为：5MB
  },
  fileFilter: function (req, file, cb) {
    // 只允许上传图片
    const fileType = file.mimetype.split('/')[0];
    const isImage = fileType === 'image';

    if (!isImage) {
      return cb(new BadRequest('只允许上传图片。'));
    }

    // 接受这个文件，使用`true`，像这样: `cb(null, true)` 拒绝false
    cb(null, true);
  }
});

// 单文件上传，指定表单字段名为 file
const singleFileUpload = upload.single('file');

module.exports = {
  config,
  client,
  singleFileUpload,
}
