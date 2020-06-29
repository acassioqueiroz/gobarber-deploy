"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class RedisCacheProvider {
  constructor() {
    this.data = {};
  }

  async save(key, value) {
    this.data[key] = JSON.stringify(value);
  }

  async recover(key) {
    const data = this.data[key];

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data);
    return parsedData;
  }

  async invalidate(key) {
    delete this.data[key];
  }

  async invalidatePrefix(prefix) {
    const keys = Object.keys(this.data).filter(key => key.startsWith(`${prefix}:`));
    keys.forEach(key => {
      delete this.data[key];
    });
  }

}

exports.default = RedisCacheProvider;