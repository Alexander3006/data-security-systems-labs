const addQuestion = async ({connection}, context) => {
  const {
    services: {[interfaces.IQuestion]: questionService, [interfaces.ILogger]: logger},
  } = context;
  try {
    const user = await connection.getSession();
    if (!user) {
      logger.silly({
        message: 'Trying to access without a session',
        grade: 3,
      });
      connection.error(403);
      return;
    }
    const {id: user_id} = user;
    const questions = await questionService.find({
      user: user_id,
    });
    connection.send(questions.map(({id, question}) => ({id, question})));
  } catch (err) {
    logger.error('Get question error', err);
    connection.error(500);
  }
};

new adapters.HttpEndpoint({
  method: 'GET',
  url: '/question',
  handler: addQuestion,
});
