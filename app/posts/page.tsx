"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { strict } from "assert";
import axios from "axios";
import NewDeletePost from "./deleteBtn";

import Link from "next/link";
export default function Posts() {
  const handleDeleteSuccess = () => {
    console.log("Post deleted successfully!");
    return <h1>Success</h1>;
  };

  const handleDeleteError = (errorMessage) => {
    // Handle deletion errors, such as:
    // - Display an error message to the user
    // - Log the error for debugging
    // - Take any other appropriate actions
    console.error("Error deleting post:", errorMessage);
  };

  const queryClient = useQueryClient();
  const mutation: any = useMutation({
    mutationFn: (newPost) => {
      return axios.post(
        "https://full-stack-intro-livid.vercel.app/api/post",
        newPost
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

  console.log(posts?.posts);

  return (
    <>
      <h1 className="flex justify-center items-center">This is Post Page</h1>
      <br />
      {mutation.isPending ? (
        <h1>Ading tod ......</h1>
      ) : (
        <>
          {mutation.isError ? (
            <div>An error Ocarced : {mutation.error?.message} </div>
          ) : null}

          {mutation.isSuccess ? <div>Todo success</div> : null}
        </>
      )}
      <br />
      <h1 className="flex justify-center items-center">
        Amar Mote Post: ({posts?.posts.length})
      </h1>
      <hr />
      {isLoading ? (
        <h1 className="flex justify-center items-center">Loading......</h1>
      ) : (


        <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Delete</th>
                    <th>Modify</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.posts.map((post) => (
                    <tr key={post.id}>
                      <td>{post.title}</td>
                      <td>{post.content}</td>
                      <td>
                      <NewDeletePost
              postId={post?.id}
              onDeleteSuccess={handleDeleteSuccess}
              onDeleteError={handleDeleteError}
            />
                      </td>
                      <td>
                      <Link className="p-2" href={`/posts/${post.id}`}>Modify</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

        
      )}
    </>
  );
}
