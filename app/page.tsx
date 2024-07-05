import React from 'react'
import Link from 'next/link'
export default function Home() {
  

  return (
    <>
      <h1 className='flex justify-center'>Home</h1>
      <hr />
      <Link className="flex justify-center p-2" href="/posts">Posts</Link> 
      <Link className="flex justify-center p-2" href="/posts/add-post">Add Post</Link> 
      <Link className="flex justify-center p-2" href="/posts/delete-post">Delete Post</Link> 
      <Link className="flex justify-center p-2" href="/posts/multiple-post-modify">Multiple Post Modify</Link> 
    </>
  )
}
