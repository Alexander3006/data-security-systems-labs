class Question {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }

  add({user, question, answer}) {
    this.logger.silly('User add new question', {
      userId: user,
      grade: 0,
    });
    return this.db.query(
      `INSERT INTO "Question"("user_id", "question", "answer") VALUES ($1, $2, $3)`,
      [user, question, answer],
    );
  }

  find({user}) {
    this.logger.silly('User get all questions', {
      userId: user,
      grade: 0,
    });
    return this.db
      .query('SELECT * FROM "Question" WHERE user_id = $1', [user])
      .then((res) => res.rows);
  }

  compare({id, answer}) {
    return this.db
      .query(`SELECT * FROM "Question" WHERE id = $1 AND "answer" = $2`, [id, answer])
      .then((res) => res.rows.length > 0);
  }
}

const {Database, ILogger} = interfaces;

({
  imports: [Database, ILogger],
  factory: ({[Database]: db, [ILogger]: logger}) => {
    return new Question(db, logger);
  },
});
