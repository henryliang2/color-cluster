import React from 'react';
import './ImageCard.css';


const ImageCard = (props) => {

  const { url, id, dimension } = props

  return (
      <React.Fragment>
        <img
          className='image-card' 
          src={url} 
          id={"image" + id}
          alt={"image " + id}
          width={dimension}
          height={dimension}
        />
      </React.Fragment>
  );
} 


export default ImageCard;