const MAX_BAD_ATTEMPTS = 4;

class User {
  constructor(db) {
    this.db = db;
  }

  _bcrypt(data) {
    return node_modules.bcrypt.hash(data, 10);
  }

  validate({email, password}) {
    const v_pass = password.length > 8;
    const v_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email,
    );
    return v_pass && v_email;
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
    return this.db
      .query(
        `UPDATE "User" SET "bad_attempts" = "bad_attempts" + 1 WHERE "id" = $1 RETURNING "bad_attempts"`,
        [id],
      )
      .then(({rows: [attempts]}) => {
        if (!attempts >= MAX_BAD_ATTEMPTS) return true;
        return this.db.query(`UPDATE "User" SET "active" = false WHERE "id" = $1`, [id]);
      });
  }
}

const {Database} = interfaces;

({
  imports: [Database],
  factory: ({[Database]: db}) => {
    return new User(db);
  },
});
