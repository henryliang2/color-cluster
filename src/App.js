import React, { Component } from 'react';
import ImageCard from './ImageCard/ImageCard';
import MyDropzone from './Dropzone/Dropzone';
import './App.css';
const DummyVariables = require('./DummyVariables.js');
const Clarifai = require('clarifai');
const { PCA } = require('ml-pca');
const tinycolor = require('tinycolor2');

const clarifaiApp = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API_KEY
});

class App extends Component {
  constructor(){
    super();
    this.state = {
      images: []
    }
  }

  pushImageToState = (id, url, primaryColor, pcaIndex) => {
    this.setState(prevState => ({
      images: [...prevState.images, {
        id,
        url,
        primaryColorHex: primaryColor,
        primaryColorHSV: tinycolor(primaryColor).toHsv(),
        pcaIndex
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
      nCompNIPALS: 1,
      center: true,
      scale: true,
    });
    
    // Project each image's HSV values into PCA space
    const pcaModel = pca.predict(dataset)
    
    // Push results to array and sort by PCA index
    let imageArray = { 
      images: []
    };
    this.state.images.forEach( (image, i) => {
      imageArray.images.push({ 
        id: image.id, 
        url: image.url, 
        primaryColorHex: image.primaryColorHex,
        primaryColorHSV: image.primaryColorHSV,
        pcaIndex: pcaModel.data[i][0]})
    });
    imageArray.images.sort((a, b) => { return a.pcaIndex - b.pcaIndex });

    // Replace Old State with new one
    this.setState(imageArray)
  }

  getState = () => {
    console.log(this.state)
    return this.state
  }

  runClarifaiModel = (urls) => {
    // COLOR_MODEL is the model that accesses Color data for Clarifai
    const COLOR_MODEL = "eeed0b6733a644cea07cf4c60f87ebb7";
    const outputs = clarifaiApp.models.predict(COLOR_MODEL, urls)
      .then(response => { return response.outputs });
    return outputs
  }

  componentDidMount() {
    const setInitialState = async () => {
      // Get Clarifai Model on initial dummy images
      const outputs = await this.runClarifaiModel(DummyVariables.dummyColors);
      // Get primary colors of each dummy image from Clarifai Models
      const primaryColorArray = outputs.map( output => {
        const sortedColors = output.data.colors.sort((a, b) => { 
          return b.value - a.value })
        return sortedColors[0].raw_hex
      })
      // push images to initial state
      await outputs.forEach((output, i) => {
        this.pushImageToState(
          i,
          output.input.data.image.url,
          primaryColorArray[i],
          null)
      })
    }

    setInitialState();
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <MyDropzone 
            runClarifaiModel={this.runClarifaiModel}
            pushImageToState={this.pushImageToState}
            getPrimaryColor={this.getPrimaryColor}
            getState={this.getState}
          />
        </div>
        <div>{
          this.state.images.map( (image, i) => {
            return <ImageCard
                    key={i}
                    id={image.id}
                    url={image.url}
                  />
            })}
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
