import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const ViewPage = () => {
  const param = useParams();

  const [errorMessage, setErrorMessage] = useState(null);
  const [post, setPost] = useState(null);

  const getPost = async () => {
    const postId = param.postId;
    console.log("postId:", postId);
    const response = await fetch(
      "https://lab-23-1-server.onrender.com/getPost",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postId,
        }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      setErrorMessage(data && data.message ? data.message : "Cannot get post!");
    } else {
      console.log("data getPost:", data);
      setPost(data);
      setErrorMessage(null);
    }
  };

  useEffect(() => {
    try {
      getPost();
    } catch (err) {
      console.log("err catch getPost():", err);
    }
  }, []);

  useEffect(() => {
    console.log("errorMessage:", errorMessage);
  }, [errorMessage]);
  useEffect(() => {
    console.log("post:", post);
  }, [post]);

  return (
    <div>
      <div style={{ maxWidth: "600px", margin: "3em auto" }}>
        {errorMessage && <p>{errorMessage}</p>}
        {post && (
          <div>
            <h2>{post.title}</h2>
            <p>{post.date}</p>
            <hr />

            <img
              src={`https://lab-23-1-server.onrender.com/${post.imageUrl}`}
              style={{ width: "210px", height: "210px" }}
            />

            <p>{post.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPage;
