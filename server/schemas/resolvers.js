///////////////// 21.1.4 ///////////////// 此文件是全新建立的
// 本文件是解析器／the resolver，用来 serve the response for the helloWorld query／typeDefs里定义的
// Resolvers do work in a similar fashion to how a controller file
// Resolvers are just a bit more specific at times
// resolve actions!!!

// import the Mongoose models:
const { User, Thought } = require("../models");
// 21.2.3 import the GraphQL's built-in error handling 功能
// 目的：如果有人试图用错的用户名／错密码登陆, we'll want to return an authentication error.
const { AuthenticationError } = require("apollo-server-express");
// 21.2.4 import the the signToken() function 功能
const { signToken } = require("../utils/auth");

// 这个是对应typeDefs里原本hello world的例子
// const resolvers = {
//   // when we use the query helloWorld,
//   // this helloWorld() method will execute and return the string "Hello world!"
//   Query: {
//     helloWorld: () => {
//       return "Hello world!";
//     },
//   },
// };

// 注意，里面的 parent 参数，不会被用，它只是 placeholder 占据 first parameter's spot
// 这样我们才可以 access the username argument from the second parameter
const resolvers = {
  Query: {
    // 21.2.5 添加 me() method，在typeDef.js里有对应的 type Query { me: User。。。
    // 21.2.5 下部添加 context, 我的感觉。。context是 auth token 过的 req。。。
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("thoughts")
          .populate("friends");

        return userData;
      }
      // If no context.user property exists, then we know that the user isn't authenticated
      throw new AuthenticationError("Not logged in");
    },
    // 这些都是21.2.5之前累积的
    thoughts: async (parent, { username }) => {
      // check if username exists
      // username存在：params 设为{ username }，username key set to that value
      // username不存在：params 设为{}
      const params = username ? { username } : {};
      // We then pass that object, with or without any data in it, to our .find() method
      // If there's data, it'll perform a lookup by a specific username
      // If there's not, it'll simply return every thought!!!!!!!!!!!!!
      return Thought.find(params).sort({ createdAt: -1 });
    },
    // place this inside of the `Query` nested object right after `thoughts`
    // 查找 a single thought by its _id
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },
    // get all users
    users: async () => {
      return User.find()
        .select("-__v -password")
        .populate("friends")
        .populate("thoughts");
    },
    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("friends")
        .populate("thoughts");
    },
  },
  // 21.2.3 添加用户login和signup
  // mutations are intended for any change: creating, updating, or deleting
  // inclass: args is the info you want to pass in, for example, the varibales
  Mutation: {
    addUser: async (parent, args) => {
      // Mongoose User model creates 新用户 in database with whatever is passed in as the args
      const user = await User.create(args);
      // 21.2.4 sign a token
      const token = signToken(user);
      // return 新用户
      // 21.2.4 return an object that combines the token with the user's data
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      // 21.2.4 sign a token and return an object that combines the token with the user's data
      const token = signToken(user);
      return { token, user };
    },
    // 21.2.6
    // 只有登陆的用户可以发表thoughts，这就是为啥 we check for the existence of context.user first
    // 加密的 JWT 只在 verification pass 后才added to context
    // 加密用户信息的token, 会成为context.user，会被用于 Thought.create() 和 User.findByIdAndUpdate() methods
    addThought: async (parent, args, context) => {
      if (context.user) {
        const thought = await Thought.create({
          ...args,
          username: context.user.username,
        });
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          // 保存updated document
          { new: true }
        );
        return thought;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      if (context.user) {
        const updatedThought = await Thought.findOneAndUpdate(
          // updating an existing thought 所以需要 corresponding thoughtId
          { _id: thoughtId },
          // Reactions 以 arrays 的形式存在 Thought model, so you'll use the Mongo $push operator
          {
            $push: {
              reactions: { reactionBody, username: context.user.username },
            },
          },
          { new: true, runValidators: true }
        );
        return updatedThought;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    // look for an incoming friendId, add to current user's friends array
    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          // 同个朋友不能加两次，$addToSet operator instead of $push to prevent duplicate entries
          { $addToSet: { friends: friendId } },
          { new: true }
        ).populate("friends");
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
