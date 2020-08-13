import React, { Component } from 'react';
import ImageCard from './ImageCard/ImageCard';
import './App.css';
const DummyVariables = require('./DummyVariables.js');
const Clarifai = require('clarifai');
const { PCA } = require('ml-pca');
const tinycolor = require('tinycolor2');

const clarifaiApp = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API_KEY
});

const COLOR_MODEL = "eeed0b6733a644cea07cf4c60f87ebb7";

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

  principleComponentAnalysis = () => {
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
    let images = [];
    this.state.images.forEach( (image, i) => {
      images.push({ 
        id: image.id, 
        url: image.url, 
        primaryColorHex: image.primaryColorHex,
        primaryColorHSV: image.primaryColorHSV,
        pcaIndex: pcaModel.data[i][0]})
    });
    images.sort((a, b) => { return a.pcaIndex - b.pcaIndex });

    // Replace Old State with new one
    this.setState({ images })
  }

  logState = () => {
    console.log(this.state)
  }

  runClarifaiModel = (urls) => {
    const outputs = clarifaiApp.models.predict(COLOR_MODEL, urls)
      .then(response => { return response.outputs });
    return outputs
  }


  componentDidMount() {

    const setInitialState = async () => {
      const outputs = await this.runClarifaiModel(DummyVariables.dummyColors);
      const primaryColorArray = outputs.map( output => {
        const sortedColors = output.data.colors.sort((a, b) => { 
          return b.value - a.value })
        return sortedColors[0].raw_hex
      })
      await outputs.forEach((output, i) => {
        this.pushImageToState(i,
          output.input.data.image.url,
          primaryColorArray[i],
          null)
        })}

    setInitialState();
  }

  render() {
    return (
      <div>
        <h1>Hello World</h1>

        {
          this.state.images.map( (image, i) => {
            return <ImageCard
                    key={i}
                    id={image.id}
                    url={image.url}
                  />
          })
        }
          <div>
            <button onClick={this.principleComponentAnalysis}>Analyze</button>
            <button onClick={this.logState}> Log State</button>
          </div>
      </div>
      
    );
  }
}

export default App;
