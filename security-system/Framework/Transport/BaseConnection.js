'use strict';

const ISessionService = require('../Services/Sessions/ISessionService');

class BaseConnection {
  constructor(services) {
    this.services = services;
    this.session = null;
    this.sessionToken = null;
  }

  getSessionToken() {
    return this.sessionToken;
  }

  setSessionToken(token) {
    this.sessionToken = token;
    return this;
  }

  deleteSessionToken(token) {
    this.sessionToken = null;
    return this;
  }

  async _restoreSession() {
    const {
      services: {[ISessionService]: sessions},
    } = this;
    if (!sessions) return;
    const token = this.getSessionToken();
    if (!token) return;
    const session = await sessions.restore(token);
    this.sessionToken = token;
    return session;
  }

  async createSession(data) {
    const {
      services: {[ISessionService]: sessions},
    } = this;
    if (!sessions) return;
    const token = await sessions.create(data);
    this.session = data;
    this.setSessionToken(token);
    return this;
  }

  async deleteSession(token) {
    const {
      services: {[ISessionService]: sessions},
    } = this;
    if (!sessions) return;
    await sessions.delete(token);
    this.deleteSessionToken(token);
    this.session = null;
    return this;
  }

  async updateSession(token, data) {
    await this.deleteSession(token);
    await this.createSession(data);
    this.session = data;
    return this;
  }

  async getSession() {
    if (!this.session) {
      this.session = await this._restoreSession();
    }
    return this.session;
  }

  error() {
    throw new Error();
  }

  send() {
    throw new Error();
  }

  destroy() {
    throw new Error();
  }
}

module.exports = BaseConnection;
