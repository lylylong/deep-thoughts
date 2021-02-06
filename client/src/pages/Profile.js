import React from "react";

// 21.6.4
import ThoughtForm from "../components/ThoughtForm";
// -------- //

// 21.5.6
import { QUERY_USER, QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";
// Redirect will allow us to redirect the user to another route, 很像 location.replace()
// 而且Redirect还能 leverages React Router's ability to not reload the browser!
import { Redirect, useParams } from "react-router-dom";
// ------- //

// 21.6.3
import { ADD_FRIEND } from "../utils/mutations";
// ------- //

// 21.4.6
// import { useParams } from "react-router-dom";
import ThoughtList from "../components/ThoughtList";
// 21.6.3 import useMutation as well
import { useQuery, useMutation } from "@apollo/react-hooks";
// ------- //
// import { QUERY_USER } from "../utils/queries";
import FriendList from "../components/FriendList";
// ------- //

const Profile = () => {
  // 21.6.3 at the top of the Profile component
  const [addFriend] = useMutation(ADD_FRIEND);
  // ------- //

  // 21.4.6
  // The useParams Hook retrieves the username from the URL,
  // 然后把username 传递给 useQuery Hook
  const { username: userParam } = useParams();
  // 加入条件性的 fetch for QUERY_ME
  // 如果有userParam 存在，那就QUERY_USER，没有userParam 存在，那就QUERY_ME，记住me的url是 path="/profile
  // 换句话说：if there's a value in userParam that we got from the URL bar, we'll use that value to run the QUERY_USER query
  // If there's no value in userParam, like if we simply visit /profile as a logged-in user, we'll execute the QUERY_ME query instead
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });
  // The user object that is created here is used to populate the JSX
  // 此user object 会传递 props to the ThoughtList component to render 该user的想法
  // 21.5.6 handle each type of response,加多了查询是否有 data?.me
  // 记住：当我们运行 QUERY_ME, the response will return with our data in the me property;
  // but if it runs QUERY_USER instead, the response will return with our data in the user property
  const user = data?.me || data?.user || {};
  if (loading) {
    return <div>Loading...</div>;
  }
  // ------- //

  // 21.5.6 Add the following code below the const user declaration
  // redirect to personal profile page if username is the logged-in user's
  // 查的是 if the username stored in the JSON Web Token is the same as the userParam value
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to="/profile" />;
  }
  // ------- //

  // 21.4.6 如果用户没登录，显示这个
  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links
        above to sign up or log in!
      </h4>
    );
  }
  // ------- //

  // 21.6.3
  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id },
      });
    } catch (e) {
      console.error(e);
    }
  };
  // ------------ //

  // 21.4.6 加入user object 和 <ThoughtList> 并把 user object 在其中 pass as props
  // 加入 <FriendList> 并把 user object 在其中 pass as props
  // 21.6.3  include a <button> : Add Friend
  // 添加 userParam，只在有 userParam 时 才渲染 添加朋友按钮
  // the button won't display when the route is simply /profile
  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : "your"} profile.
        </h2>

        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList
            thoughts={user.thoughts}
            title={`${user.username}'s thoughts...`}
          />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
      <div className="mb-3">{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
