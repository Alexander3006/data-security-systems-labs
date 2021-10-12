const {ISessionStorage} = interfaces;

class Sessions {
  constructor(sessionStorage) {
    const TOKEN_LEN = 256 / 8;
    this.sessionStorage = sessionStorage;
    this._tokenLength = TOKEN_LEN;
  }

  _generateToken() {
    const {crypto} = node_modules;
    const {_tokenLength} = this;
    return new Promise((res, rej) => {
      crypto.randomBytes(_tokenLength, (err, buf) => {
        err ? rej(err) : res(buf);
      });
    }).then((x) => x.toString('hex'));
  }

  async create(data) {
    const {sessionStorage} = this;
    const token = await this._generateToken();
    await sessionStorage.set(token, data);
    return token;
  }

  async restore(token) {
    const {sessionStorage} = this;
    if (!token) return;
    const session = await sessionStorage.get(token);
    return session;
  }

  async delete(token) {
    const {sessionStorage} = this;
    await sessionStorage.delete(token);
  }
}

({
  imports: [ISessionStorage],
  factory: ({[ISessionStorage]: sessionStorage}) => {
    const sessions = new Sessions(sessionStorage);
    return sessions;
  },
});
