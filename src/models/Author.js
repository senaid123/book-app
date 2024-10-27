export default (sequelize, DataTypes) => {
  const Author = sequelize.define(
    "Author",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
    },
    {},
  );

  Author.associate = (models) => {
    Author.belongsToMany(models.Book, {
      through: "BookAuthors",
      as: "books",
      foreignKey: "authorId",
    });
  };

  return Author;
};
