const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('jpacs', 'jpacsdb', 'test@123', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
