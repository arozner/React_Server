import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const Home = () => {

    const [user, setUser] = useState(null);
    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:4000/users?id=${userId}`)
            .then(response => response.json())
            .then(userData => {
                setUser(userData[0]);
            })
    }, [])

    const handleLogOut = () => {
        navigate('/', { replace: true });
    }

    return <div>
        <button onClick={handleLogOut}>log out</button>
        {user && <h1>hello {user.username}</h1>}
        <Link to={`/user/${userId}/todos`}>todos |</Link>
        <Link to={`/user/${userId}/posts`}>posts |</Link>
        <Link to={`/user/${userId}/albums`}>albums </Link>
    </div>
}

export default Home;