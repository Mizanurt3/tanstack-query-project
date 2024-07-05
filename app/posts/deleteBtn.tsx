"use client";
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

export default function NewDeletePost({ postId, onDeleteSuccess, onDeleteError }:any) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (postId) => {
      return axios.delete(`https://full-stack-intro-livid.vercel.app/api/post/${postId}`);
    },
    onSuccess: (data, variables, context) => {
      console.log('Post deleted successfully:', data);
      queryClient.invalidateQueries({queryKey:["posts"]});  // Refetch posts
      onDeleteSuccess && onDeleteSuccess(); // Call optional success callback
    },
    onError: (error, variables, context) => {
      console.error('Error deleting post:', error.message);
      onDeleteError && onDeleteError(error.message); // Call optional error callback
    },
  });

  const handleDelete = async () => {
    try {
      await mutation.mutate(postId);
    } catch (error) {
      console.error('Error deleting post:', mutation.error);
      onDeleteError && onDeleteError(mutation.error); // Call optional error callback
    }
  };

  return (
    <button onClick={handleDelete}>Delete</button>
  );
}
