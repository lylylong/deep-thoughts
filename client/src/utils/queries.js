// 21.3.5
// This file will store all GraphQL query requests !!!
// inclass：这个文件是用来call the function --》back end server的
// inclass: send qustions to resolvers in the server side
import gql from "graphql-tag";

// used similar syntax from the test query we wrote using the GraphQL Playground earlier
// 是要 import this query function by name and use it throughout the front end of the application
export const QUERY_THOUGHTS = gql`
  query thoughts($username: String) {
    thoughts(username: $username) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }
`;

// 21.4.5
export const QUERY_THOUGHT = gql`
  query thought($id: ID!) {
    thought(_id: $id) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }
`;
// ------- //

// 21.4.6
export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      friendCount
      friends {
        _id
        username
      }
      thoughts {
        _id
        thoughtText
        createdAt
        reactionCount
      }
    }
  }
`;
// ------- //

// 21.5.6
// conditionally render data that's specific to the logged-in user
// we aren't passing any variables, we can simply name the query, and GraphQL will handle the rest
// this query -- retrieve essentially all data related to the logged-in user
export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      friendCount
      thoughts {
        _id
        thoughtText
        createdAt
        reactionCount
        reactions {
          _id
          createdAt
          reactionBody
          username
        }
      }
      friends {
        _id
        username
      }
    }
  }
`;
// create one more using the me query that returns less data
// requesting significantly less data to be returned over HTTP
// look up how to use something called "Directives"! 指令!
export const QUERY_ME_BASIC = gql`
  {
    me {
      _id
      username
      email
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;
// ----------- //
