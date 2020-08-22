import React from 'react';
import FadeIn from 'react-fade-in';
import '../App.css';

const ModelDescription = (props) => {

  if (props.model === 'pca') {
    return (
      <React.Fragment>
        <div className='title-container'>
          <h1>Description</h1>
        </div>
        <FadeIn>
          <p>Principal Component Analysis (PCA) is a technique that reduces the dimensionality 
            of data while retaining the maximum amount of information possible. In 
            this case, the model reduces the three color dimensions of Hue (H), Saturation (S), 
            and Brightness (V) down to a single dimension. This allows comparison and sorting of
            the primary HSV values of images in one-dimensional space.</p>
        </FadeIn>
      </React.Fragment>
    );
  }

  else if (props.model === 'kmeans') {
    return (
      <React.Fragment>
        <div className='title-container'>
          <h1>Description</h1>
        </div>
        <FadeIn>
          <p>K-Means Clustering (Description)</p>
        </FadeIn>
      </React.Fragment>
    );
  }

  else { return '' }

}

export default ModelDescription
