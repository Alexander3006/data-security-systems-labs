const refresh = async ({connection}, context) => {
  const {
    services: {
      [interfaces.IUser]: user,
      [interfaces.IQuestion]: questionService,
      [interfaces.ILogger]: logger,
    },
  } = context;
  try {
    const {id, answer} = await connection.receiveBody().then((res) => JSON.parse(res));
    const user_s = await connection.getSession();
    if (!user_s) {
      connection.error(403);
      return;
    }
    const isTrue = await questionService.compare({
      id: id,
      answer: answer,
    });
    const token = connection.getSessionToken();
    if (!isTrue) {
      await user.incAttempts(user_s.id);
      await connection.deleteSession(token);
      connection.error(400);
      return;
    }
    await connection.updateSession(token, user_s);
    connection.send({
      message: 'Session has been refreshed =}',
      token: await connection.getSessionToken(),
    });
  } catch (err) {
    logger.error(`Login error`, err);
    connection.error(500);
  }
};

new adapters.HttpEndpoint({
  method: 'POST',
  url: '/auth/refresh',
  handler: refresh,
});
