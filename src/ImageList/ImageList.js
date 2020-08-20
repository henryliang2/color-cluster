import React, { useEffect } from 'react';
import ImageCard from '../ImageCard/ImageCard';
import Dropzone from '../Dropzone/Dropzone';
import Popup from 'reactjs-popup';
import '../App.css'
import './ImageList.css'

const ImageList = (props) => {

  const { images, expectedImages } = props.state;

  /*
  * if expected images is greater than images.length,
  * show loading bar
  */
  if (expectedImages !== images.length) {

    // Calculate Loading Bar
    const fractionLoaded = (images.length / expectedImages);
    const barWidth = Math.floor(500 * fractionLoaded);

    return (
      <React.Fragment>
        <div className='title-container'>
          <h1>Images</h1>
        </div>
        <div className='image-container analyzing'>
          <h1>Analyzing</h1>
          <div className='loading-bar-container'>
            <div className='loading-bar' style={{width: barWidth}}></div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  /* 
  * if expectedimages (from loading) is equal to images currently in array,
  * then render the component 
  */
  else {
    return (
      <React.Fragment>
        <div className='title-container'>
          <h1>Images</h1>
        </div>
        <div className='image-container'>
          { 
            images.map( (image, i) => {
              return <ImageCard
                      key={i}
                      id={image.id}
                      url={image.url}
                    />
              })
          }
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
                  state={props.state}
                  expectedImages={props.state.expectedImages}
                  setExpectedImages={props.setExpectedImages}
                  onRouteChange={ close }
                  accept="image/*"
                  inputContent={(files, extra) => (
                    extra.reject ? 'Images Only' : 'Drop Images Here or Click to Browse'
                  )}
                />
              </React.Fragment>
            )}
          </Popup>
        
        </div>
      </React.Fragment>
    );
  }
}

export default ImageList