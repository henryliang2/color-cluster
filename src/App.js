import './App.css';
import React, { Component } from 'react';
import ImageCard            from './ImageCard/ImageCard';
import MyDropzone           from './Dropzone/Dropzone';
import Graphs               from './Graphs/Graphs'
const Clarifai  = require('clarifai');
const skmeans = require('skmeans');
const { PCA }   = require('ml-pca');
const tinycolor = require('tinycolor2');

const clarifaiApp = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API_KEY
});

class App extends Component {
  constructor(){
    super();
    this.state = { 
      images: [],
      model: '',
      numOfClusters: 1,
      route: 'input'
    }
  }

  pushImageToState = (id, url, primaryColor, index) => {
    this.setState(prevState => ({
      images: [...prevState.images, {
        id,                            // unique identifier
        url,                           // url or base64 string of image
        primaryColorHex: primaryColor, // primary color of image in hexidecimal notation
        primaryColorHSV: tinycolor(primaryColor).toHsv(), // primary color of image in HSV notation
        index // analyzed index of HSV color (reduced to one single dimension)
      }]
    }));
  }

  getPrimaryColor = (clarifaiOutput) => {
    const sortedColors = clarifaiOutput[0].data.colors.sort((a, b) => { 
      return b.value - a.value });
    return sortedColors[0].raw_hex;
  }

  runModel = (model) => {
    let dataset = [];
    if (this.state.images.length < 1) {
      console.log('Must be populated')
      return null
    }
    // dataset is an array of arrays of format [h, s, v]
    this.state.images.forEach( image => {
      dataset.push([
        image.primaryColorHSV.h, 
        image.primaryColorHSV.s, 
        image.primaryColorHSV.v 
      ])
    });

    let modelOutput;
    let numOfClusters = 1; // default to 1

    if (model === 'pca') {
      // input into PCA model
      const pca = new PCA(dataset, {
        method: 'NIPALS',
        nCompNIPALS: 1, // reduce to one-dimensional space
      });
      // Project each image's HSV values into PCA space
      const pcaModel = pca.predict(dataset)
      modelOutput = pcaModel;
      console.log(pcaModel)
      
    } else if (model === 'kmeans') {
      // input into k-means model with 3 clusters
      numOfClusters = 3;
      const clusters = skmeans(dataset, numOfClusters);
      modelOutput = clusters;
      console.log(clusters);
    }

    let outputArray = [];

    this.state.images.forEach( (image, i) => {
      outputArray.push({ 
        id: image.id, 
        url: image.url, 
        primaryColorHex: image.primaryColorHex,
        primaryColorHSV: image.primaryColorHSV,
        index: (model === 'pca' ? modelOutput.data[i][0] : modelOutput.idxs[i])})
    });
    outputArray.sort((a, b) => { 
      return a.index - b.index 
    });
    // Replace old State with new one
    this.setState({
      images: outputArray,
      model,
      numOfClusters
    })
  }

  getState = () => {
    console.log(this.state)
    return this.state
  }

  runClarifaiModel = (urls) => {
    const COLOR_MODEL = "eeed0b6733a644cea07cf4c60f87ebb7";
    const outputs = clarifaiApp.models.predict(COLOR_MODEL, urls)
      .then(response => { return response.outputs });
    return outputs
  }

  onRouteChange = () => {
    this.state.route === 'input'
      ? this.setState({ route: 'analysis' })
      : this.setState({ route: 'input' })
  }

  render() {
    if (this.state.route === 'input') {
      return (
        <React.Fragment>
          <div className='container' >
            <div className='drop-column'>
              <div className='title-container'>
                <h1>Add Images</h1>
              </div>
              <MyDropzone 
                runClarifaiModel={this.runClarifaiModel}
                pushImageToState={this.pushImageToState}
                getPrimaryColor={this.getPrimaryColor}
                getState={this.getState}
                onRouteChange={this.onRouteChange}
              />
              <div className='button-list'>
                <button onClick={this.onRouteChange}>Analysis Page</button>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }

    else if (this.state.route === 'analysis') {
      return (
        <React.Fragment>
          <div className='container'>
            <div className='column left-column'>
              <div className='title-container'>
                <h1>Images</h1>
              </div>
              <div className='image-container'>
                { this.state.images.map( (image, i) => {
                    return <ImageCard
                            key={i}
                            id={image.id}
                            url={image.url}
                          />
                    })}
              </div>
              <div className='button-list'>
                <button onClick={this.onRouteChange}>Add More Images</button>
              </div>
            </div>

            <div className='column right-column'>
              <div className='title-container'>
                <h1>Plot</h1>
              </div>
              <div id='graph-output'>
                <Graphs state={this.state}/>
              </div>
              <div className= 'button-list'>
                <button onClick={() => { this.runModel('pca'); }}>Analyze (PCA Model)</button>
                <button onClick={() => { this.runModel('kmeans'); }}>Analyze (K-Means Model)</button>
                <button onClick={this.getState}>Log State</button>
              </div>
              <div className='title-container'>
                <h1>Explanation</h1>
              </div>
              <div>
                <p>Principal Component Analysis (PCA) is a technique that reduces the dimensionality 
                of data while retaining the maximum amount of information possible. In 
                this case, the model reduces the three color dimensions of Hue (H), Saturation (S), 
                and Brightness (V) down to a single dimension. This allows comparison and sorting of
                the primary HSV values of images in one-dimensional space.</p>
              </div>
            </div>
          </div>
        </React.Fragment>
      )
    }
  }
}

export default App;
