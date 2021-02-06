///////////////// 21.2.4 /////////////////
const jwt = require("jsonwebtoken");

// tokens can be given an expiration date and a secret to sign the token with
// 注：secret 和 encoding／编码 没关系，他只是让 server to verify whether it recognizes this token
// 注：secret 太重要了，不能简单放在js文件里，应该放在 environment variable.
const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  // 这个signToken() function expects a user object
  // and will add that user's username, email, and _id properties to the token
  signToken: function ({ username, email, _id }) {
    // payload：有效载荷
    const payload = { username, email, _id };
    // to create a token use .sign()
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  ///////////////// 21.2.5 /////////////////
  // verifying the JWT 并用来输出，就不用长篇幅的 verify in every resolver
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // separate "Bearer" from "<tokenvalue>"
    // pop() method removes the last element (from an array) and returns that removed element!
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // if no token, return request object as is
    // Users without valid token should still be able to request and see all thoughts
    if (!token) {
      return req;
    }
    // try...catch statement, to mute the error
    try {
      // decode(解码，破译) and attach user data to request object
      // If the secret on jwt.verify() doesn't match the secret that was used with jwt.sign(),
      // the object won't be decoded. When the JWT verification fails, an error is thrown.
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    // return updated request object
    return req;
  },
  //--**--//--**--//--**--//--**--//--**--//
};
