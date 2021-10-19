const MAX_BAD_ATTEMPTS = 4;

class User {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }

  _bcrypt(data) {
    return node_modules.bcrypt.hash(data, 10);
  }

  validate({email, password}) {
    const criteria = ['A-Z', 'a-z', '\\d', '!$#%'];
    let minComplexity = 3;
    const complexity = criteria.reduce(
      (acc, criteria) => (RegExp('[' + criteria + ']').test(password) ? (acc += 1) : acc),
      0,
    );
    const v_pass = password.length >= 8;
    const v_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email,
    );
    return v_pass && v_email && complexity >= minComplexity;
  }

  comparePassword(password, hash) {
    return node_modules.bcrypt.compare(password, hash);
  }

  async create({email, password}) {
    const hash = await this._bcrypt(password);
    return this.db.query(`INSERT INTO "User"(email, password) VALUES($1, $2)`, [email, hash]);
  }

  findOne(email) {
    return this.db
      .query(`SELECT * FROM "User" WHERE email = $1`, [email])
      .then((res) => res.rows[0]);
  }

  incAttempts(id) {
    this.logger.warning('Bad attempts', {
      userId: id,
      grade: 5,
    });
    return this.db
      .query(
        `UPDATE "User" SET "bad_attempts" = "bad_attempts" + 1 WHERE "id" = $1 RETURNING "bad_attempts"`,
        [id],
      )
      .then(({rows: [attempts]}) => {
        if (attempts < MAX_BAD_ATTEMPTS) return true;
        this.logger.warning('Max bad attempts', {
          userId: id,
          grade: 8,
        });
        return this.db.query(`UPDATE "User" SET "active" = false WHERE "id" = $1`, [id]);
      });
  }
}

const {Database, ILogger} = interfaces;

({
  imports: [Database, ILogger],
  factory: ({[Database]: db, [ILogger]: logger}) => {
    return new User(db, logger);
  },
});
