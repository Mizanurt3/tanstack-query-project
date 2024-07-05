"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { strict } from "assert";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Posts() {
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSelectPost = (postId:any) => {
    setSelectedPostId(postId);
    getInitialPostData(postId);
  };

  const getInitialPostData = async (postId:any) => {
    if (!postId) return;

    const response = await axios.get(
      `https://full-stack-intro-livid.vercel.app/api/post/${postId}`
    );
    const post = response.data;

    if (post) {
      setSelectedPostId(postId);
      setTitle(post.title);
      setContent(post.content);
    }
  };

  const {
    data: posts,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => {
      return fetch("https://full-stack-intro-livid.vercel.app/api/post").then(
        (res) => res.json()
      );
    },
  });

  useEffect(() => {
    if (posts?.posts.length > 0) {
      setSelectedPostId(posts?.posts[0].id);
      setTitle(posts?.posts[0].title);
      setContent(posts?.posts[0].content);
    }
  }, [posts]);

  const queryClient = useQueryClient();
  const mutation: any = useMutation({
    mutationFn: (updatePostData) => {
      return axios.put(
        `https://full-stack-intro-livid.vercel.app/api/post/${selectedPostId}`,
        updatePostData
      );
    },
    onMutate: (data) => {
      console.log("onmutade", data);
    },
    onError: (error, vaiables, context) => {
      console.log("There is ans ERor ", error.message);
    },
    onSuccess: (data, vaiables, context) => {
      console.log("Succesed", data);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleUpdatePost = async (event: any) => {
    event.preventDefault();

    mutation.mutate({
      selectedPostId,
      title,
      content,
    });

    console.log({ title, content });

    setTitle("");
    setContent("");
  };

  return (
    <>
      <h1 className="flex justify-center items-center">Modify Post</h1>

      {isLoading ? (
        <h1 className="flex justify-center items-center">Loading posts...</h1>
      ) : isError ? (
        <div>Error loading posts</div>
      ) : isSuccess && posts?.posts.length > 0 ? (
        <>
          {mutation.isPending ? (
            <div>Deleting post... Please wait.</div>
          ) : mutation.isError ? (
            <div className="error-message">
              Error deleting post: {mutation.error.message}
            </div>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Content</th>
                    <th>ID</th>
                    <th>Modify</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.posts.map((post:any) => (
                    <tr key={post.id}>
                      <td>{post.title}</td>
                      <td>{post.content}</td>
                      <td>{post.id}</td>
                      <td>
                        <button onClick={() => handleSelectPost(post.id)}>
                          Modify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {selectedPostId && (
                <form>
                  <label htmlFor="title">Title:</label>
                  <input
                    id="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                  <label htmlFor="content">Content:</label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                  />
                  <button onClick={handleUpdatePost}>Update Post</button>
                </form>
              )}
            </>
          )}
        </>
      ) : (
        <div>No posts found.</div>
      )}
    </>
  );
}
