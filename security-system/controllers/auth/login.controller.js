const login = async ({connection}, context) => {
  const {
    services: {[interfaces.IUser]: user, [interfaces.ILogger]: logger},
  } = context;
  try {
    const body = await connection.receiveBody().then((res) => JSON.parse(res));
    const {email, password} = body;
    const user_e = await user.findOne(email);
    logger.warning('Try get non exist user', {grade: 5});
    if (!user_e) {
      connection.error(400);
      return;
    }
    if (!user_e.active) {
      connection.error(403);
      return;
    }
    const isValidPass = await user.comparePassword(password, user_e.password);
    if (!isValidPass) {
      logger.warning('Password guessing', {grade: 7, userId: user_e.id});
      connection.error(400);
      return;
    }
    await connection.createSession(user_e);
    const token = connection.getSessionToken();
    connection.send({
      message: `Session has been created =}`,
      token: token,
    });
  } catch (err) {
    logger.error(`Login error`, err);
    connection.error(500);
  }
};

new adapters.HttpEndpoint({
  method: 'POST',
  url: '/auth/login',
  handler: login,
});
