import React from 'react';
import ImageCard from '../ImageCard/ImageCard';
import Dropzone from '../Dropzone/Dropzone';
import Popup from 'reactjs-popup';
import '../App.css'
import './ImageList.css'

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
        <Popup trigger={<button>Add More Images</button>} 
          modal
          closeOnDocumentClick
          overlayStyle={ { width: '100%', height: '100%' }}
          contentStyle={ { width: 600, height: 600 , padding: 24}}
        >
          {close => (
            <React.Fragment>
              <button className="close" onClick={close}>
                &times;
              </button>
              <Dropzone 
                runClarifaiModel={props.runClarifaiModel}
                pushImageToState={props.pushImageToState}
                getPrimaryColor={props.getPrimaryColor}
                getState={props.getState}
                onRouteChange={ close }
              />
            </React.Fragment>
          )}
        </Popup>
      
      </div>
    </React.Fragment>
  );
  
}

export default ImageList