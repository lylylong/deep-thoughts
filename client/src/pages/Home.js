import React from "react";
// 21.3.5
import ThoughtList from "../components/ThoughtList";
// -------- //

// 21.6.4
import ThoughtForm from "../components/ThoughtForm";
// -------- //

///////////////// 21.3.5 /////////////////
// 首先，useQuery 是 Hook！！！ from Apollo's React Hooks library
// useQuery能让我们发 requests to 已连接的 GraphQL server，并能让整个app使用App.js里的 <ApolloProvider> component
// 目前ApolloProvider在App.js 传递的是 client 的 uri
// inclass: useQuery is fetch call
import { useQuery } from "@apollo/react-hooks";
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from "../utils/queries";
//--**--//--**--//--**--//--**--//--**--//

// 21.5.6
// import { QUERY_THOUGHTS, QUERY_ME_BASIC } from "../utils/queries";
// because we need to check the logged-in status of a user
import Auth from "../utils/auth";
import FriendList from "../components/FriendList";
// ---------- //

const Home = () => {
  // 21.3.5 增加的
  // use useQuery hook to make query request
  // useQuery is asynchronous, just like using fetch(),
  // Apollo's react-hooks library provides a loading property to indicate: the request isn't done yet
  // 当加载完时我们就 have data returned from the server, 那信息就放在这个 data property里 ！！！
  // inclass: pull out loading & data fns, data is the data in response
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // 21.5.6 放在 useQuery() Hook for thought data 之下
  // use object destructuring to extract `data` from the `useQuery` Hook's response
  // and rename it `userData` to be more descriptive 将data改名为userData
  const { data: userData } = useQuery(QUERY_ME_BASIC);
  // ----------- //

  // 分离出thoughts：get the thought data out of the query's response／GraphQL response／a big data object
  // if data exists, store it in the thoughts. If data is undefined, then save an empty array
  // 我的理解：如果存在 data，读取 data.thoughts，如果没有data，则 thoughts 为 []。
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  // 21.5.6
  // because we need to check the logged-in status of a user
  // If you're logged in, the loggedIn variable will be true; otherwise, it will be false
  const loggedIn = Auth.loggedIn();
  // ---------- //

  // 21.3.5 加上ThoughtList -- update the returning JSX data
  // 21.5.6 更新包裹<ThoughtList> 的<div>，加入验证loggedIn
  // If the user isn't logged in, it'll span the full width of the row
  // if the user is logged in, it'll only span eight columns, leaving four-column space for 朋友列表
  // 21.5.6 if the value of loggedIn is true and there is data in the userData variable (created from useQuery() Hook)
  // we'll render a righthand column <div> that holds our <FriendList> component!
  // 21.6.4 add <ThoughtForm />
  return (
    <main>
      <div className="flex-row justify-space-between">
        {loggedIn && (
          <div className="col-12 mb-3">
            <ThoughtForm />
          </div>
        )}
        <div className={`col-12 mb-3 ${loggedIn && "col-lg-8"}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
        </div>
        {loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3">
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
