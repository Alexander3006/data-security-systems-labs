'use strict';

const cookieParser = require('cookie');
const configuration = require('../../../config');
const BaseConnection = require('../BaseConnection');
//this class will be supplemented so far it is just a stub
class HttpConnection extends BaseConnection {
  constructor(services, req, res) {
    super(services);
    this.request = req;
    this.response = res;
  }

  getSessionToken() {
    const {token} = this.getCookies();
    return token;
  }

  setSessionToken(token) {
    super.setSessionToken(token);
    this.setCookie('token', token);
    return this;
  }

  deleteSessionToken(token) {
    super.deleteSessionToken();
    this.deleteCookie('token', token);
    return this;
  }

  async receiveBody() {
    const {request} = this;
    const chunks = [];
    for await (const chunk of request) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks).toString();
    return buffer;
  }

  getEndpointPath() {
    const {
      request: {url: pathname, method},
    } = this;
    return {method, pathname};
  }

  setCookie(name, value, params = configuration.httpCookies) {
    const {response} = this;
    const cookie = cookieParser.serialize(name, value, params ?? {});
    response.setHeader('Set-Cookie', cookie);
    return;
  }

  getCookies() {
    const {request} = this;
    const {cookie} = request.headers;
    return cookie ? cookieParser.parse(cookie) : {};
  }

  deleteCookie(name, value) {
    const {httpCookies} = configuration;
    const params = Object.assign({}, httpCookies ?? {}, {maxAge: 0});
    this.setCookie(name, value, params);
  }

  redirect(path) {
    const {response} = this;
    response.writeHead(301, {
      Location: path,
    });
    response.end();
  }

  error(code, err) {
    const {response} = this;
    response.writeHead(code);
    response.end(JSON.stringify(err));
    return;
  }

  setHeaders(headers) {
    const {response} = this;
    Object.keys(headers).map((headerType) => {
      response.setHeader(headerType, headers[headerType]);
    });
    return this;
  }

  send(data) {
    const {response} = this;
    const json = JSON.stringify(data);
    response.writeHead(200);
    response.end(json);
  }

  destroy() {
    const {response} = this;
    response.destroy();
    return;
  }
}
module.exports = HttpConnection;
