import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const emailHandle = (event) => {
    setEmail(event.target.value);
  };
  const nameHandle = (event) => {
    setName(event.target.value);
  };
  const passwordHandle = (event) => {
    setPassword(event.target.value);
  };

  const postSignup = async () => {
    const response = await fetch(
      // "http://localhost:5000/signup",
      "https://lab-23-1-server.onrender.com/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          name: name,
          password: password,
        }),
      }
    );

    const data = await response.json();

    console.log("data post signup:", data);

    if (!response.ok) {
      console.log(
        data && data.message
          ? data.message
          : data && data.msg
          ? data.msg
          : "Signup !response.ok"
      );
      setErrorMessage(
        data && data.message
          ? data.message
          : data && data.msg
          ? data.msg
          : "Signup !response.ok"
      );
    } else {
      console.log("Signup ok data:", data);
      setEmail(null);
      setName(null);
      setPassword(null);
      setErrorMessage(null);
      navigate("/login");
    }
  };

  const signupHandle = (event) => {
    event.preventDefault();
    postSignup();
  };

  useEffect(() => {
    console.log("email:", email);
  }, [email]);
  useEffect(() => {
    console.log("name:", name);
  }, [name]);
  useEffect(() => {
    console.log("password:", password);
  }, [password]);
  useEffect(() => {
    console.log("errorMessage:", errorMessage);
  }, [errorMessage]);

  return (
    <div
      style={{
        maxWidth: "1200px",
        // border: "1px solid green ",
        margin: "1em auto",
        marginLeft: "3em",
      }}
    >
      <form style={{ marginLeft: "3em" }} onSubmit={signupHandle}>
        {errorMessage && <p>{errorMessage}</p>}
        <div>
          <label>Your Email</label>
          <input type="email" onChange={emailHandle} />
        </div>
        <div>
          <label>Your Name</label>
          <input type="text" onChange={nameHandle} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" onChange={passwordHandle} />
        </div>
        <button style={{ cursor: "pointer" }} type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
