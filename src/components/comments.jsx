import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

const Comments = () => {
    const { postId } = useParams();
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:4000/comments?postId=${postId}`)
            .then(response => response.json())
            .then(commentsArr => setComments(commentsArr))
            .catch(error => alert(`Error: ${error.message}`));
    }, []);

    return <div>
        <h1>comments:</h1>
        <ul>
            {comments.map(comment => <li key={comment.id}>{comment.body}</li>)}
        </ul>
    </div>
}

export default Comments