"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { strict } from "assert";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Posts() {

  const {modifyPostID}=useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");



  // const getInitialPostData = async (postId) => {
  //   if (!postId) return;

  //   const response = await axios.get(
  //     `https://full-stack-intro-livid.vercel.app/api/post/${postId}`
  //   );
  //   const post = response.data;

  //   if (post) {
  //     setTitle(post.title);
  //     setContent(post.content);
  //   }
  // };

  const {
    data: singelPost,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["singelPost"],
    queryFn: () => {
      return fetch(`https://full-stack-intro-livid.vercel.app/api/post/${modifyPostID}`).then(
        (res) => res.json()
      );
    },
  });

  useEffect(() => {
    if (singelPost) {
      setTitle(singelPost?.title);
      setContent(singelPost?.content);
    };
  }, [singelPost]);
console.log(singelPost?.title)
  const queryClient = useQueryClient();
  const mutation: any = useMutation({
    mutationFn: (updatePostData) => {
      return axios.put(
        `https://full-stack-intro-livid.vercel.app/api/post/${modifyPostID}`,
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
      queryClient.invalidateQueries({ queryKey: ["singelPost"] });
    },
  });

  const handleUpdatePost = async (event: any) => {
    event.preventDefault();

    mutation.mutate({
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
        <h1 className="flex justify-center items-center">Loading singelPost...</h1>
      ) : isError ? (
        <div>Error loading singelPost</div>
      ) : isSuccess && singelPost ? (
        <>
          {mutation.isPending ? (
            <div>Deleting post... Please wait.</div>
          ) : mutation.isError ? (
            <div className="error-message">
              Error deleting post: {mutation.error.message}
            </div>
          ) : (
            <>
             

              {modifyPostID && (
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
        <div>No singelPost found.</div>
      )}
    </>
  );
}
