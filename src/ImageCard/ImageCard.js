import React, { Component , Fragment} from 'react';
import './ImageCard.css'


class ImageCard extends Component {

  render () {  
    
    const {url, id} = this.props

    return (
        <Fragment>
          <img 
            src={url} 
            alt={"image " + id} 
            width="120" 
            height="120" 
          />
        </Fragment>
    );
  } 

};

export default ImageCard;