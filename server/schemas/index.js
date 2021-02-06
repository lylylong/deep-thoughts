///////////////// 21.1.4 ///////////////// 此文件是全新建立的
// 此文件的功能：collect typeDefs.js & resolvers.js and export them

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

module.exports = { typeDefs, resolvers };
