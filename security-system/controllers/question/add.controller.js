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
    const {question, answer} = await connection.receiveBody().then((res) => JSON.parse(res));
    await questionService.add({
      user: user_id,
      question: question,
      answer: answer,
    });
    connection.send(true);
  } catch (err) {
    logger.error('Add question error', err);
    connection.error(500);
  }
};

new adapters.HttpEndpoint({
  method: 'POST',
  url: '/question/add',
  handler: addQuestion,
});
