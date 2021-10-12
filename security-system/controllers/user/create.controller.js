const createUserController = async ({connection}, context) => {
  const {
    services: {[interfaces.IUser]: user, [interfaces.ILogger]: logger},
  } = context;
  try {
    const body = await connection.receiveBody().then((res) => JSON.parse(res));
    const {email, password} = body;
    const isValid = user.validate({email, password});
    if (!isValid) {
      connection.error(400);
      return;
    }
    await user.create({email, password});
    connection.send(true);
  } catch (err) {
    logger.error(`Create user error`, err);
    connection.error(500);
  }
};

new adapters.HttpEndpoint({
  method: 'POST',
  url: '/user/create',
  handler: createUserController,
});
