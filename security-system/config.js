'use strict';

const configuration = {
  http: {
    ipAddress: process.env.HOST ?? '0.0.0.0',
    port: process.env.PORT ?? 3000,
    ssl: false,
  },
  controllers: {
    paths: ['./controllers/user', './controllers/auth', './controllers', './controllers/question'],
    supervisor: true,
  },
  httpCookies: {
    maxAge: 30000,
    httpOnly: true,
    path: '/',
  },
  // redis: {
  //   host: process.env.REDIS_HOST ?? '127.0.0.1',
  //   port: process.env.REDIS_PORT ?? 6379,
  // },
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ?? 5432,
    database: process.env.DB_DATABASE ?? 'security_system',
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    init: './init.sql',
  },
  startup: './Startup.js',
  dependencies: './dependencies.js',
};

module.exports = configuration;
