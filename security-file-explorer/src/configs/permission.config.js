export const ADMIN = Symbol('ADMIN');
export const USER = Symbol('USER');

export const CREATE = Symbol('CREATE');
export const READ = Symbol('READ');
export const SAVE = Symbol('SAVE');

export const user_config = {
  roles: {
    admin_secret_token: ADMIN,
    user_secret_token: USER,
  },

  permissions: {
    [ADMIN]: [CREATE, READ, SAVE],
    [USER]: [READ],
  },
};
