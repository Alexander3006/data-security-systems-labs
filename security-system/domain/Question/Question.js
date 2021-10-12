class Question {
  constructor(db) {
    this.db = db;
  }

  add({user, question, answer}) {
    return this.db.query(
      `INSERT INTO "Question"("user_id", "question", "answer") VALUES ($1, $2, $3)`,
      [user, question, answer],
    );
  }

  find({user}) {
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

const {Database} = interfaces;

({
  imports: [Database],
  factory: ({[Database]: db}) => {
    return new Question(db);
  },
});
