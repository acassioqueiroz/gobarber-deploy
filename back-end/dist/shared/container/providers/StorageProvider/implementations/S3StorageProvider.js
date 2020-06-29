"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _mime = _interopRequireDefault(require("mime"));

var _upload = _interopRequireDefault(require("../../../../../config/upload"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DiskStorageProvider {
  constructor() {
    this.client = void 0;
    this.client = new _awsSdk.default.S3({
      region: 'us-east-1'
    });
  }

  async saveFile(file) {
    const originalPath = _path.default.resolve(_upload.default.tmpFolder, file);

    const fileContent = await _fs.default.promises.readFile(originalPath);

    const contentType = _mime.default.getType(originalPath);

    if (!contentType) {
      throw new Error("It was not possible get the file's content type.");
    }

    await this.client.putObject({
      Bucket: _upload.default.config.S3.bucket,
      Key: file,
      ACL: 'public-read',
      Body: fileContent,
      ContentType: contentType
    }).promise();
    await _fs.default.promises.unlink(originalPath);
    return file;
  }

  async deleteFile(file) {
    await this.client.deleteObject({
      Bucket: _upload.default.config.S3.bucket,
      Key: file
    }).promise();
  }

}

var _default = DiskStorageProvider;
exports.default = _default;