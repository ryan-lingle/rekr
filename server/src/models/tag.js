'use strict';
module.exports = (sequelize, DataTypes) => {
  const tag = sequelize.define('tag', {
    rekId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        async isUnique(val) {
          const { rekId, hashtagId } = this;

          const exists = await tag.findOne({ where: { rekId, hashtagId } })

          if (exists) {
            throw new Error('Duplicate Hashtag')
          }
        }
      }
    },
    hashtagId: DataTypes.INTEGER
  }, {});
  tag.associate = function(models) {

  };
  return tag;
};
