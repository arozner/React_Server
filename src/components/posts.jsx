import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";

const Posts = () => {
    const { userId } = useParams();
    const [posts, setPosts] = useState([]);
    const [numOfPosts, setNumOfPosts] = useState(0)
    const [extendedShow, setExtendedShow] = useState(-1);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:4000/posts`)
            .then(response => response.json())
            .then(postsArr => {
                setPosts(postsArr);
                setNumOfPosts(Math.min(5, postsArr.length));
            })
            .catch(error => alert(`Error: ${error.message}`));
    }, []);

  const displayPosts = () => {
        return posts.slice(0, numOfPosts)
    }

    const handleExtendedShow = postId => {
        if (postId === extendedShow) {
            setExtendedShow(-1);
        }
        else { setExtendedShow(postId) }
    }

    return (
        <div>
            <h1>Posts:</h1>
            <ul>
                {displayPosts().map((post) => (
                    <li key={post.id}>
                        {post.userId === parseInt(userId) && <button><MdDelete /></button>}
                        <button onClick={() => navigate(`/user/${userId}/posts/${post.id}/comments`)}>comments</button>
                        < h3
                            onClick={() => handleExtendedShow(post.id)}
                            style={{ cursor: "pointer", backgroundColor: post.userId === parseInt(userId) ? "rgb(209, 209, 207)" : "", display: "inline" }}>
                            {post.title}
                        </h3>
                        {extendedShow === post.id && <p style={{ backgroundColor: post.userId === parseInt(userId) ? "rgb(209, 209, 207)" : "" }}>{post.body}</p>}
                    </li>))}
            </ul >
            {numOfPosts < posts.length && <button onClick={() => setNumOfPosts(Math.min(numOfPosts + 5, posts.length))}>show more</button>}
        </div >
    );
};
export default Posts;