class Logging {
  constructor(db) {
    this.db = db;
  }

  log({message, type = 'silly', userId = null, grade = 0}) {
    return this.db.query(
      'INSERT INTO "Logging"("type", "message", "user_id", "grade") VALUES ($1, $2, $3, $4)',
      [type, message, userId, grade],
    );
  }

  find() {
    return this.db.query('SELECT * FROM "Logging"').then((res) => res.rows);
  }
}

const {Database} = interfaces;

({
  imports: [Database],
  factory: ({[Database]: db}) => {
    const logging = new Logging(db);
    return logging;
  },
});
