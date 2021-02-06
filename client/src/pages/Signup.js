import React, { useState } from "react";

// 21.5.3
// useMutation() 和 useQuery() 都是fetch call
// 前者是post update delete，后者是 get
import { useMutation } from "@apollo/react-hooks";
import { ADD_USER } from "../utils/mutations";
// -------- //

// 21.5.4
import Auth from "../utils/auth";
// -------- //

const Signup = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  // 21.5.3
  // below the useState() statement that declares formState
  // addUser现在是 addUser function，功能就是 useMutation(ADD_USER)
  const [addUser, { error }] = useMutation(ADD_USER);
  // -------- //

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form // submit form (notice the async!)
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // 21.5.3
    // use try/catch instead of promises to handle errors
    // try...catch block 在这里特别好用 with asynchronous code such as Promises
    // 有了try...catch，我们可以用 async/await instead of .then() and .catch()
    try {
      // execute addUser mutation and pass in variable data from form
      const { data } = await addUser({
        // 此时的 formState 是表格里刚填完的，用来fetch
        variables: { ...formState },
      });
      console.log(data);
      // 21.5.4 take the token and set it to localStorage
      Auth.login(data.addUser.token);
    } catch (e) {
      // if something goes wrong, such as a username or email address that isn't unique,
      // the user will be notified
      console.error(e);
    }
    // ------------ //
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-md-6">
        <div className="card">
          <h4 className="card-header">Sign Up</h4>
          <div className="card-body">
            <form onSubmit={handleFormSubmit}>
              <input
                className="form-input"
                placeholder="Your username"
                name="username"
                type="username"
                id="username"
                value={formState.username}
                onChange={handleChange}
              />
              <input
                className="form-input"
                placeholder="Your email"
                name="email"
                type="email"
                id="email"
                value={formState.email}
                onChange={handleChange}
              />
              <input
                className="form-input"
                placeholder="******"
                name="password"
                type="password"
                id="password"
                value={formState.password}
                onChange={handleChange}
              />
              <button className="btn d-block w-100" type="submit">
                Submit
              </button>
            </form>
            {error && <div>Sign up failed</div>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
