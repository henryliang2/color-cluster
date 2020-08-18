import './App.css';
import React, { Component } from 'react';
import ImageCard            from './ImageCard/ImageCard';
import MyDropzone           from './Dropzone/Dropzone';
import Graphs               from './Graphs/Graphs'
const Clarifai  = require('clarifai');
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
      pcaModelExists: false
    }
  }

  pushImageToState = (id, url, primaryColor, pcaIndex) => {
    this.setState(prevState => ({
      images: [...prevState.images, {
        id,                            // unique identifier
        url,                           // url or base64 string of image
        primaryColorHex: primaryColor, // primary color of image in hexidecimal notation
        primaryColorHSV: tinycolor(primaryColor).toHsv(), // primary color of image in HSV notation
        pcaIndex // principle component analysis index of HSV color (reduced to one single dimension)
      }]
    }));
  }

  getPrimaryColor = (clarifaiOutput) => {
    const sortedColors = clarifaiOutput[0].data.colors.sort((a, b) => { 
      return b.value - a.value });
    return sortedColors[0].raw_hex;
  }

  runPcaModel = () => {
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
    // input into PCA model
    const pca = new PCA(dataset, {
      method: 'NIPALS',
      nCompNIPALS: 1, // reduce to one-dimensional space
    });
    // Project each image's HSV values into PCA space
    const pcaModel = pca.predict(dataset)
    // Push results to array and sort by PCA index
    let outputArray = { images: []};
    console.log(pcaModel)
    this.state.images.forEach( (image, i) => {
      outputArray.images.push({ 
        id: image.id, 
        url: image.url, 
        primaryColorHex: image.primaryColorHex,
        primaryColorHSV: image.primaryColorHSV,
        pcaIndex: pcaModel.data[i][0]})
    });
    outputArray.images.sort((a, b) => { 
      return a.pcaIndex - b.pcaIndex 
    });
    // Replace old State with new one
    this.setState(outputArray)
    this.setState(prevState => ({
      pcaModelExists: !prevState.pcaModelExists
    }));
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

  render() {
    return (
      <React.Fragment>
      <div className='container' >
        <div className='drop-column'>
          <MyDropzone 
            runClarifaiModel={this.runClarifaiModel}
            pushImageToState={this.pushImageToState}
            getPrimaryColor={this.getPrimaryColor}
            getState={this.getState}
          />
        </div>
        <div className='image-column'>{
          this.state.images.map( (image, i) => {
            return <ImageCard
                    key={i}
                    id={image.id}
                    url={image.url}
                  />
            })}
        </div>
        <div id='graph-output'>
          <Graphs state = {this.state}/>
        </div>
      </div>
        
      <div>
        <button onClick={this.runPcaModel}>Analyze</button>
        <button onClick={this.getState}> Log State</button>
      </div>
      </React.Fragment>
    );
  }
}

export default App;
