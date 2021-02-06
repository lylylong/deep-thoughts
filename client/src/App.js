import React from "react";

///////////////// 21.3.4 /////////////////
// add these two library import statements
// ApolloProvider是 special type of React component 用来 provide data to all other components
// 它是 a specialized use case of a built-in React tool
import { ApolloProvider } from "@apollo/react-hooks";
// get data???
import ApolloClient from "apollo-boost";
//--**--//--**--//--**--//--**--//--**--//

///////////////// 21.4.3 /////////////////
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//--**--//--**--//--**--//--**--//--**--//

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";

///////////////// 21.4.3 /////////////////
import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import SingleThought from "./pages/SingleThought";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
//--**--//--**--//--**--//--**--//--**--//

///////////////// 21.3.4 /////////////////
// Add the following code right above the App function
// 21.3.6 将 uri: "/graphql" 去换掉 uri: "http://localhost:3001/graphql"
const client = new ApolloClient({
  // 21.5.4 retrieve the token from localStorage before each request !!!
  request: (operation) => {
    const token = localStorage.getItem("id_token");
    // use the .setContext() method to set the HTTP request headers
    // every request will include the token
    // if the request doesn't need the token, our server-side resolver function won't check for it
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
  // ------------ //

  // establish the connection to the back-end server's /graphql endpoint, using Apollo
  uri: "/graphql",
});
//--**--//--**--//--**--//--**--//--**--//

// 21.3.4 添加 <ApolloProvider client={client}>。。。</ApolloProvider>
// passing the client variable -- the client prop in the provider
// everything between the JSX tags will have access to the server's API data through the client var
function App() {
  // 21.4.3
  // update the App functional component: 加入 <Router> 和 <Route>
  // wrap <Router> component -- which makes all of the child components on the page aware of the client-side routing
  // several <Route> components -- signify these content will change according to the URL route 内容随着URL的变化而变！
  // 举例子1：当 route is /, the Home component will render
  // 举例子2：当 route is /login, the Login component will render
  // wrap <Switch> -- 如果 route 不 match any of the preceding paths (e.g., /about) then users 收到 NoMatch - 404 msg
  // 21.4.4 update path profile 和 path thought，目的是 enable url parameters
  // The ? means this parameter is optional,so /profile and /profile/myUsername will both render Profile component
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/profile/:username?" component={Profile} />
              <Route exact path="/thought/:id" component={SingleThought} />

              <Route component={NoMatch} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
