export default (sequelize, DataTypes) => {
  const BookAuthors = sequelize.define(
    "BookAuthors",
    {
      bookId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Books",
          key: "id",
        },
      },
      authorId: {
        type: DataTypes.UUID,
        references: {
          model: "Authors",
          key: "id",
        },
      },
    },
    {},
  );

  return BookAuthors;
};
