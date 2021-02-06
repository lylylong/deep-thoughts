import React from "react";

// 21.4.4
// 首先，useParams 是一个新的 React Hook
import { useParams } from "react-router-dom";
// ------- //

// 21.4.5 怎么用的解释看home.js
import { useQuery } from "@apollo/react-hooks";
import { QUERY_THOUGHT } from "../utils/queries";
import ReactionList from "../components/ReactionList";
// ------- //

const SingleThought = (props) => {
  // 21.4.4 增加这些 before the return statement
  // 让我们在后台读取 thoughtId
  // 基于整个文件找不到这里为啥 id: thoughtId ？
  // 我的理解是，在 App.js 设置时 id为url里面的一部分，
  // id 这里用来当key，useParams是分离它出来，给予个新名字叫 thoughtId，
  // 所以 console.log(thoughtId)的结果只是个字串，{ id: thoughtId }只是useParams分离出来的object形式
  const { id: thoughtId } = useParams();
  // console.log(thoughtId);

  // 21.4.5 增加这些 before the return statement
  // 怎么用的解释看home.js
  const { loading, data } = useQuery(QUERY_THOUGHT, {
    // can pass variables to queries that need them
    // id property on the variables object will become the $id parameter in the GraphQL query
    variables: { id: thoughtId },
  });
  const thought = data?.thought || {};
  if (loading) {
    return <div>Loading...</div>;
  }
  // ------- //

  // 21.4.5 现在有了 thought object, update the JSX --
  // 加上{thought.username} {thought.createdAt} {thought.thoughtText}
  // pass the reactions array as a prop
  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{" "}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>

      {thought.reactionCount > 0 && (
        <ReactionList reactions={thought.reactions} />
      )}
    </div>
  );
};

export default SingleThought;
