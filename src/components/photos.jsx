import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const Photos = () => {
  const [photosArr, setPhotosArr] = useState([]);
  const { albumId } = useParams();

  useEffect(() => {
    fetch(`http://localhost:4000/photos?albumId=${albumId}`)
      .then(response => response.json())
      .then(photosArr => setPhotosArr(photosArr))
      .catch(error => alert(`Error: ${error.message}`));
  }, []);

  return <div>
    <ul>
      {photosArr.map(photo => <li key={photo.id}>
        <img src={photo.url} />
      </li>
      )}
    </ul>
  </div>

}

export default Photos