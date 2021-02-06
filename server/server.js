// 次文件中进行的改变有以下增添，对本来的express等设置无删改
// get our Apollo server hooked into our existing Express.js server
// and set it up with our type definitions and resolvers

const express = require("express");

// 21.2.5
const path = require("path");

///////////////// 21.1.4 /////////////////
// import ApolloServer
const { ApolloServer } = require("apollo-server-express");
// import our typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
//--**--//--**--//--**--//--**--//--**--//

// import the mongoose.connection object
const db = require("./config/connection");
const PORT = process.env.PORT || 3001;
const app = express();

// 21.2.5 ///verifying the JWT 的 middleware 在 auth.js 那输出来用//////
const { authMiddleware } = require("./utils/auth");

///////////////// 21.1.4 /////////////////
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  // provide the type definitions and resolvers
  // so they know what our API looks like and how it resolves requests
  typeDefs,
  resolvers,
  // 21.2.5，解决 resolvers里的 me() method -- how to read the request（加授权的／有token的）headers
  // pass in a context method，return whatever available in the resolvers
  // see the incoming request and return only the headers
  // 在resolver side, those headers would become the context parameter
  // 那怎么 verifying the JWT？建个 middleware 在 auth.js 那输出来用！
  // 这样就保证 every request performs an authentication check！
  // and the updated request object will be passed to the resolvers as the context
  context: authMiddleware,
  // context: ({ req }) => req.headers,
});
// We then connect our Apollo server to our Express.js server
// integrate our Apollo server with the Express application as middleware
// This will create a special /graphql endpoint for the Express.js server
// /graphql endpoint will serve as the main endpoint for accessing the entire API
server.applyMiddleware({ app });
//--**--//--**--//--**--//--**--//--**--//

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

///////////////// 21.3.6 /////////////////
// Serve up static assets 加这些在db.once()上面
// 这两条code -- will only come into effect when we go into production
// First, we check to see if the Node environment is in production
// 如果是，就让 Express.js server to serve any files in the React application's build directory in the client folder
// We don't have a build folder yet—because remember, that's for production only!
// 下面这两条用的时候：it will set us up for later when we deploy to Heroku
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}
// wildcard GET route for the server
// 换句话说，如果make a GET request 但没有明确的route defined, respond with 下面这个index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
//--**--//--**--//--**--//--**--//--**--//

// we listen for that connection to be made
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    ///////////////// 21.1.4 /////////////////
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    //--**--//--**--//--**--//--**--//--**--//
  });
});
