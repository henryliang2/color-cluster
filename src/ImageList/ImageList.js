import React from 'react';
import ImageCard from '../ImageCard/ImageCard'
import '../App.css'

const ImageList = (props) => {

  return (
    <React.Fragment>
      <div className='title-container'>
        <h1>Images</h1>
      </div>
      <div className='image-container'>
        { props.state.images.map( (image, i) => {
            return <ImageCard
                    key={i}
                    id={image.id}
                    url={image.url}
                  />
            })}
      </div>
      <div className='button-list'>
        <button onClick={props.onRouteChange}>Add More Images</button>
      </div>
    </React.Fragment>
  );
  
}

export default ImageList