"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class FakeMailTemplateProvider {
  async parse({
    file,
    variables
  }) {
    return `template: ${file} variables: ${variables}`;
  }

}

exports.default = FakeMailTemplateProvider;