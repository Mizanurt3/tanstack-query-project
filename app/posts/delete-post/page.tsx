"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function DeletePostPage() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (postId) => {
      return axios.delete(`https://full-stack-intro-livid.vercel.app/api/post/${postId}`);
    },
    onMutate: (deletedPostId) => {
      // Optimistic UI update (optional)
      // - Remove the deleted post from local state (if applicable)
      // - Show a temporary success message
      console.log("Deleting post...", deletedPostId);
      queryClient.setQueryData(["posts"], (oldData :any) => {
        if (oldData?.posts ) {
          return {
            posts: oldData.posts.filter((post :any) => post.id !== deletedPostId),
          };
        }
        return oldData;
      });
    },
    onError: (error, variables, context) => {
      console.log("Error deleting post:", error.message);
      // Revert optimistic UI update (if applicable)
      queryClient.invalidateQueries({queryKey:["posts"]}); // Refetch posts on error
    },
    onSuccess: (data, variables, context) => {
      console.log("Post deleted successfully:", data);
      // Update UI to reflect successful deletion
      // - Show a confirmation message
      // - Refetch posts or update local state (if applicable)
      queryClient.invalidateQueries({queryKey:["posts"]}); // Refetch posts on success
    },
  });

  const { data: posts, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["posts"],
    queryFn: () => {
      return fetch("https://full-stack-intro-livid.vercel.app/api/post").then((res) =>
        res.json()
      );
    },
  });

 const handleDeletePost = async (postId:any) => {
    mutation.mutate(postId);
  };

  return (
    <>
      <h1 className="flex justify-center items-center">Delete Post</h1>

      {isLoading ? (
        <h1 className="flex justify-center items-center">Loading posts...</h1>
      ) : isError ? (
        <div>Error loading posts: </div>
      ) : isSuccess && posts?.posts.length > 0 ? (
        <ul>
          {posts.posts.map((post:any) => (
            <li key={post.id}>
              {post.title}
              <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <div>No posts found.</div>
      )}

      {mutation.isPending && (
        <div>Deleting post... Please wait.</div>
      )}

      {/* {mutation.isSuccess && (
        <div className="success-message">Post deleted successfully!</div>
      )} */}

      {mutation.isError && (
        <div className="error-message">Error deleting post: {mutation.error.message}</div>
      )}
    </>
  );
}
