export default (sequelize, DataTypes) => {
  const Book = sequelize.define(
    "Book",
    {
      isbn: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pages: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      published: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
    },
    {},
  );

  Book.associate = (models) => {
    Book.belongsToMany(models.Author, {
      through: "BookAuthors",
      as: "authors",
      foreignKey: "bookId",
    });
  };

  return Book;
};
