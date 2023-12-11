import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Albums = () => {
  const [albumsArr, setAlbumsArr] = useState([]);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:4000/albums?userId=${userId}`)
      .then(response => response.json())
      .then(albumsArr => setAlbumsArr(albumsArr))
      .catch(error => alert(`Error: ${error.message}`));
  }, []);

  return (
    <div>
      <ul>
        {albumsArr.map(album => {
         return <li
            key={album.id}
            onClick={() => navigate(`/user/${userId}/albums/${album.id}/photos`)}
            style={{ cursor: "pointer" }}>
            {album.title}
          </li>
        })}
      </ul>
    </div>
  )
}

export default Albums