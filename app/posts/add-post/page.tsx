"use client"
import { useQuery, useMutation , useQueryClient } from "@tanstack/react-query"
import { strict } from "assert";
import axios from "axios"
import { useState } from "react";

export default function Posts() {

    

  const queryClient=useQueryClient()
  const mutation:any=useMutation({
    mutationFn:(newPost)=>{
        return axios.post("https://full-stack-intro-livid.vercel.app/api/post",newPost)
    },
    onMutate:(data)=>{
        console.log("onmutade", data)  
    },
    onError: (error,vaiables, context)=>{
        console.log("There is ans ERor ", error.message)
    },
    onSuccess:(data, vaiables, context )=>{
        console.log("Succesed" , data)
        queryClient.invalidateQueries({queryKey:["posts"]})

    }
})

const { data:posts, isLoading, isError, isSuccess } = useQuery({
        queryKey: ["posts"],
        queryFn: () => {
          return fetch("https://full-stack-intro-livid.vercel.app/api/post").then((res) =>
            res.json()
          );
        },
        
 });

    const [title, setTitle]=useState("")
    const [content, setContent]=useState("")
    
    
    const handleSubmit = async (event:any) => {
        event.preventDefault();

        mutation.mutate({
            title,content
        })
    
       console.log({title,content})
    
        setTitle('');
        setContent('');

      };

    return (
        <>
        <h1 className='flex justify-center items-center'>This is Post add Page</h1>
        <form>
            <label htmlFor="title">Title:</label>
            <input
            id="title"
            value={title}
            onChange={(event)=>{
                setTitle(event.target.value)
            }}
            />
            <label htmlFor="content">Content:</label>
            <input
            id="content"
            value={content}
            onChange={(event)=>{
                setContent(event.target.value)
            }}
            />
            <button onClick={handleSubmit}>
                Add Post
            </button>
        </form>
        <br />
        {mutation.isPending ?(
            <h1>Ading tod ......</h1>
        ):(
            <>
            {mutation.isError ?(
                <div>An error Ocarced : {mutation.error?.message} </div>
            ):null}
            
            {mutation.isSuccess ?(<div>Todo success</div>):null}
            
            

            </>

        )}
            <br />
            <h1 className='flex justify-center items-center'>Amar Mote Post: ({posts?.posts.length})</h1>
          <hr/>
        {isLoading ? <h1 className='flex justify-center items-center'>Loading......</h1> : posts?.posts.map((post)=>(
          
            <h1 className="flex justify-center" key={post.id}>  
              {post.title}
            </h1>
          ))}
        </>
    )
}
