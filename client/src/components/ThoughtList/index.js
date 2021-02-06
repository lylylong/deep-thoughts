// 21.3.5 建立
import React from "react";

// 21.4.4
import { Link } from "react-router-dom";
// ------- //

// instruct that the ThoughtList component will receive two props:
// props.title and props.thoughts 通过母层级／throughout the JSX code
const ThoughtList = ({ thoughts, title }) => {
  if (!thoughts.length) {
    return <h3>No Thoughts Yet</h3>;
  }

  // What purpose does the key prop serve?
  // It helps React internally track which data needs to be re-rendered if something changes.
  // 21.4.4 给 card-header 和 card-body 安排上 <Link>
  //
  return (
    <div>
      <h3>{title}</h3>
      {thoughts &&
        thoughts.map((thought) => (
          <div key={thought._id} className="card mb-3">
            <p className="card-header">
              <Link
                to={`/profile/${thought.username}`}
                style={{ fontWeight: 700 }}
                className="text-light"
              >
                {thought.username}
              </Link>{" "}
              thought on {thought.createdAt}
            </p>
            <div className="card-body">
              <Link to={`/thought/${thought._id}`}>
                <p>{thought.thoughtText}</p>
                <p className="mb-0">
                  Reactions: {thought.reactionCount} || Click to{" "}
                  {thought.reactionCount ? "see" : "start"} the discussion!
                </p>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ThoughtList;
