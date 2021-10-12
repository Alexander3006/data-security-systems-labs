const Database = () => {
  const {
    pg: {Pool},
  } = node_modules;
  return new Pool(db);
};

({
  imports: [],
  factory: () => {
    const database = Database();
    return database;
  },
});
