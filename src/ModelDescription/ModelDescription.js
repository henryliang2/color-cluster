import React from 'react';
import FadeIn from 'react-fade-in';
import '../App.css';
import './ModelDescription.css'

const ModelDescription = (props) => {

  console.log(props.model)

  if (props.model !==  'pca' && props.model !== 'kmeans') {
    return ''
  } else {
    const description = props.model === 'pca'

      ? `Principal Component Analysis (PCA) is a technique that reduces the dimensionality 
      of data while retaining the maximum amount of information possible. In 
      this case, the model reduces the three color dimensions of Hue (H), Saturation (S), 
      and Brightness (V) down to a single dimension. This allows comparison and sorting of 
      the primary HSV values of images in one-dimensional space.`

      : `K-Means Clustering is an algorithm that attempts to accurately group the data into 
      a specified number (K) of clusters, with cluster of data described by a centroid 
      (the "mean"). This is accomplished by initializing the centroids, grouping
      the data points based on those centroids, and then cyclically re-assigning centroids
      based on the current clusters. Because of the semi-random way the clusters are 
      initialized, you might get a different result each time you run the algorithm!`

    return (
      <React.Fragment>
        <div className='title-container'>
          <h1>Description</h1>
        </div>
        <FadeIn>
          <p className='model-description-text'>{ description }</p>
        </FadeIn>
      </React.Fragment>
    );
  }

}

export default ModelDescription
