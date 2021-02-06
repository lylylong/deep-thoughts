///////////////// 21.1.4 ///////////////// 此文件是全新建立的 this file are actions!
// import the gql tagged template function
const { gql } = require("apollo-server-express");
// 可以用新的import格式引入

// create our typeDefs
// with GraphQL, we access our API through two passages: queries and mutations
// To define a query, use the type Query {} data type
// you can define your different types of queries by naming them 就像你给函数起名字一样！
// 这里的 helloWorld 是 a query name，而且 data to be returned by this query 一定得是 string
// const typeDefs = gql`
//   type Query {
//     helloWorld: String
//   }
// `;

// Just like a GET request for /api/thoughts, get all thoughts
// 告诉 query we'll return an array, by the [] square brackets
// create our own custom types that define what we want to have returned from this query
// so each thought returns can include _id, thoughtText, username, and reactionCount fields
// ID is essentially the same as String except that it is looking for a unique identifier
// the Reaction custom type 是 nested array
// 我们截止21.1.5 是有三个tpye：a Thought type, a Reaction type, and a Query type
// 21.1.6 上部加多一个tpye：a User type，define a user can return all data in their Mongoose model
// 21.2.3 开始添加新tpye：a Mutation type，内容是--登录和新用户，Both will return a User object
// the ! character in indicates a required argument
// 21.2.4 开始添加新tpye：an Auth type，并修改 type Mutation，让其包含 Auth
// 意味着 Auth type must return a token and optionally include any other user data
// 21.2.5 在type Query 里添加 me: User
// 21.2.6 给type Mutation添加新 method：addThought，addReaction，addFriend
// 注意：addReaction() will return the parent Thought instead of the newly created Reaction
// 因为front end will ultimately track changes on the thought level, not the reaction level
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
  }

  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }

  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addThought(thoughtText: String!): Thought
    addReaction(thoughtId: ID!, reactionBody: String!): Thought
    addFriend(friendId: ID!): User
  }

  type Auth {
    token: ID!
    user: User
  }
`;

// export the typeDefs
module.exports = typeDefs;
