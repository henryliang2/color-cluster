import React from 'react';
import './ImageCard.css'


const ImageCard = (props) => {

  const { url, id } = props

  return (
      <React.Fragment>
        <img 
          src={url} 
          alt={"image " + id}
          width="160" 
          height="160"
        />
      </React.Fragment>
  );
} 


export default ImageCard;