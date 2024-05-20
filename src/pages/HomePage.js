import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import openSocket from "socket.io-client";

import { contentSliceActions } from "../store/contentSlice";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => {
    return state.authSlice.auth;
  });
  const userData = useSelector((state) => {
    return state.authSlice.userData;
  });
  const posts = useSelector((state) => {
    return state.contentSlice.posts;
  });
  const getPosts = useSelector((state) => {
    return state.contentSlice.getPosts;
  });

  const [clickNewPost, setClickNewPost] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [postIdEdit, setPostIdEdit] = useState(null);

  useEffect(() => {
    const socket = openSocket("https://lab-23-1-server.onrender.com");
    // const socket = openSocket("http://localhost:5000");
    socket.on("posts", (data) => {
      if (data.action === "create") {
        getPostsHandle();
      } else if (data.action === "update") {
        getPostsHandle();
      } else if (data.action === "delete") {
        getPostsHandle();
      }
    });
  }, [getPosts]);

  const newPostButton = () => {
    setClickNewPost(true);
    setTitle("");
    setContent("");
    setPostIdEdit(null);
  };

  const cancelButton = () => {
    setTitle(null);
    setContent(null);
    setPostIdEdit(null);
    setClickNewPost(false);
  };
  const accepButton = () => {
    postHandle();
  };

  const viewButton = (postId) => {
    console.log("postId:", postId);
    navigate(`/view/${postId}`);
  };

  const editButton = (title, content, postId) => {
    setTitle(title);
    setContent(content);
    setClickNewPost(true);
    // console.log("postId editButton:", postId);
    setPostIdEdit(postId);
  };

  const titleHandle = (event) => {
    setTitle(event.target.value);
  };
  const contentHandle = (event) => {
    setContent(event.target.value);
  };
  const imageHandle = (event) => {
    setImageFile(event.target.files[0]);
    setImageUrl(URL.createObjectURL(event.target.files[0]));
  };

  const getPostsHandle = async () => {
    const response = await fetch(
      // "http://localhost:5000/getPosts"
      "https://lab-23-1-server.onrender.com/getPosts"
    );
    const data = await response.json();
    if (!response.ok) {
      console.log("Cannot get posts from server!");
    } else {
      dispatch(contentSliceActions.getPostsUpdate(data));
    }
  };

  useEffect(() => {
    try {
      getPostsHandle();

      const cookie = Cookies.get()["connect.sid"]
        ? Cookies.get()["connect.sid"].split(":")[1].split(".")[0]
        : null;

      console.log("cookie:", cookie);
    } catch (err) {
      console.log("Error get posts:", err);
    }
  }, []);

  const postHandle = async () => {
    // const serverUrl = postIdEdit
    //   ? "http://localhost:5000/editPost"
    //   : "http://localhost:5000/post";
    const serverUrl = postIdEdit
      ? "https://lab-23-1-server.onrender.com/editPost"
      : "https://lab-23-1-server.onrender.com/post";

    const currentCookie =
      auth && Cookies.get()["connect.sid"]
        ? Cookies.get()["connect.sid"].split(":")[1].split(".")[0]
        : null;
    console.log("currentCookie:", currentCookie);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("user", userData._id);
    formData.append("email", userData.email);
    formData.append("imageFile", imageFile);
    formData.append("sessionId", currentCookie);
    formData.append("postId", postIdEdit);
    const response = await fetch(serverUrl, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      console.log(
        data && data.message
          ? data.message
          : data && data.msg
          ? data.msg
          : "Somthing went wrong when post the post!"
      );
      setErrorMessage(
        data && data.message
          ? data.message
          : data && data.msg
          ? data.msg
          : "Somthing went wrong when post the post!"
      );
    } else {
      console.log("postHandle data:", data);
      dispatch(contentSliceActions.postUpdate(data && data.post));
      getPostsHandle();
      setImageFile(null);
      setImageUrl(null);
      setClickNewPost(false);
      setErrorMessage(null);
    }
  };

  const deletePostHandle = async (postId) => {
    const response = await fetch(
      // "http://localhost:5000/deletePost",
      "https://lab-23-1-server.onrender.com/deletePost",
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
      setErrorMessage(
        data && data.message ? data.message : "Cannot delete the post!"
      );
    } else {
      setErrorMessage(null);
      getPostsHandle();
    }
  };

  useEffect(() => {
    console.log("auth:", auth);
  }, [auth]);
  useEffect(() => {
    console.log("userData:", userData);
  }, [userData]);
  useEffect(() => {
    console.log("clickNewPost:", clickNewPost);
  }, [clickNewPost]);

  useEffect(() => {
    console.log("title:", title);
  }, [title]);
  useEffect(() => {
    console.log("content:", content);
  }, [content]);
  useEffect(() => {
    console.log("imageFile:", imageFile);
  }, [imageFile]);
  useEffect(() => {
    console.log("posts:", posts);
  }, [posts]);
  useEffect(() => {
    console.log("getPosts:", getPosts);
  }, [getPosts]);
  useEffect(() => {
    console.log("imageUrl:", imageUrl);
  }, [imageUrl]);
  useEffect(() => {
    console.log("postIdEdit:", postIdEdit);
  }, [postIdEdit]);

  return (
    <div
      style={{
        maxWidth: "1200px",
        // border: "1px solid green ",
        margin: "1em auto",
        marginLeft: "3em",
      }}
    >
      {auth && (
        <div>
          <form style={{ marginLeft: "3em" }}>
            <input type="text" />
            <button>Update</button>
          </form>
          <div style={{ marginLeft: "3em" }}>
            <button style={{ cursor: "pointer" }} onClick={newPostButton}>
              New Post
            </button>
          </div>
          {clickNewPost && (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgb(200 200 200)",
                position: "fixed",
                marginTop: "-3em",
                marginLeft: "-3em",
              }}
            >
              <div
                style={{
                  border: "1px solid rgb(150 150 150)",
                  // marginTop: "3em",
                  width: "360px",
                  padding: "1em",
                  margin: "3em auto",
                  // position: "absolute",
                  // width: "100%",
                }}
              >
                <form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1em",
                  }}
                >
                  {errorMessage && <div>{errorMessage}</div>}
                  <h2>New Post</h2>
                  <div style={{ display: "flex", gap: "1em" }}>
                    <label>Title</label>
                    <input type="text" onChange={titleHandle} value={title} />
                  </div>
                  <div style={{ display: "flex", gap: "1em" }}>
                    <label>Image</label>
                    <input
                      type="file"
                      style={{ cursor: "pointer" }}
                      onChange={imageHandle}
                    />
                  </div>

                  <img
                    src={imageUrl}
                    style={{ width: "100px", height: "100px" }}
                  />

                  <div style={{ display: "flex", gap: "1em" }}>
                    <label>Content</label>
                    <textarea onChange={contentHandle} value={content} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "1em",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      style={{ cursor: "pointer" }}
                      type="button"
                      onClick={cancelButton}
                    >
                      Cancel
                    </button>
                    <button
                      style={{ cursor: "pointer" }}
                      type="button"
                      onClick={accepButton}
                    >
                      Accept
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
      <div
        style={{
          border: "1px solid green",
          maxWidth: "600px",
          margin: "3em auto",
        }}
      >
        {getPosts &&
          getPosts.length > 0 &&
          getPosts.map((post) => {
            return (
              <div key={post._id}>
                <p>Posted by {post.date}</p>
                <h3>{post.title}</h3>

                {auth && (
                  <div
                    style={{
                      display: "flex",
                      gap: "1em",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      style={{ cursor: "pointer" }}
                      onClick={() => viewButton(post._id)}
                    >
                      View
                    </button>
                    <button
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        editButton(post.title, post.content, post._id)
                      }
                    >
                      Edit
                    </button>
                    <button
                      style={{ cursor: "pointer" }}
                      onClick={() => deletePostHandle(post._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default HomePage;
