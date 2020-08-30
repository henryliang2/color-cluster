import './App.css'
import React, { Component } from 'react'
import Header               from './Header/Header'
import Footer               from './Footer/Footer'
import ImageList            from './ImageList/ImageList'
import MyDropzone           from './Dropzone/Dropzone'
import Graphs               from './Graphs/Graphs'
import ModelDescription     from './ModelDescription/ModelDescription'
import ReactTooltip         from 'react-tooltip';
const Models = require('./Models/Models.js')
const Clarifai  = require('clarifai')
const tinycolor = require('tinycolor2')
const examples = require('./examples.json')

const clarifaiApp = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API_KEY
});

class App extends Component {

  render() {
    return (
      <React.Fragment>
        <Header />
        <Content />
        <Footer />
      </React.Fragment>
    )
  }
}

class Content extends Component {
  constructor(){
    super();
    this.state = { 
      images: [],
      model: '',
      numOfClusters: 1,
      route: 'input',
      expectedImages: 0
    }
  }

  resetState = () => {
    this.setState({ 
      images: [],
      model: '',
      numOfClusters: 1,
      route: 'input',
      expectedImages: 0
    })
  }

  pushImageToState = (id, url, primaryColor, index) => {
    if (this.state.images.length >= 30) {
      return null
    }
    this.setState(prevState => ({
      images: [...prevState.images, {
        id,                            // unique identifier
        url,                           // url or base64 string of image
        primaryColorHex: primaryColor, // primary color of image in hexidecimal notation
        primaryColorHSV: tinycolor(primaryColor).toHsv(), // primary color of image in HSV notation
        index, // analyzed index of HSV color (reduced to one single dimension)
      }]
    }));
  }

  setExpectedImages = (num) => {
    /*
    * Adds expected images that are currently loading to existing
    * expected images. Used for Loading Screen if images.length() 
    * !== expectedImages 
    */
    let expectedImages = (num >= 30 ? 30 : num)

    this.setState(prevState => {
      return { 
        ...prevState, 
        expectedImages
      }
    })
  }

  useExampleImages = () => {
    this.setState(examples);
    this.onRouteChange();
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
    /* ----- Input Route ----- */
    if (this.state.route === 'input') {
      return (
        <React.Fragment>
          <div className='container' >

            <div className='welcome-text-container'>
              <h2 className='welcome-text'>This tool extracts the dominant colors of your image gallery
              and then sorts the images using machine-learning techniques.</h2>

              <div className='button-list'>
                <button className='welcome-button' 
                  onClick={this.useExampleImages}>
                  Show me an example!
                </button>
              </div>
            </div>
        
            <div className='column right-column'>

              { /* ----- Dropzone Component ----- */ }
              <MyDropzone 
                runClarifaiModel={this.runClarifaiModel}
                pushImageToState={this.pushImageToState}
                getPrimaryColor={this.getPrimaryColor}
                onRouteChange={this.onRouteChange}
                expectedImages={this.state.expectedImages}
                setExpectedImages={this.setExpectedImages}
                state={this.state}
                accept="image/*"
                maxFiles={30}
              />
              {/* 
              <div className='button-list'>
                <button onClick={this.onRouteChange}>Analysis Page</button>
              </div>
              */}

            </div>
          </div>
        </React.Fragment>
      );
    }

    /* ----- Analysis Route ----- */
    else if (this.state.route === 'analysis') {
      return (
        <React.Fragment>
          <div className='container'>

            { /* ----- Left Column ----- */ }
            <div className='column left-column'>

              { /* ----- ImageList Componenet ----- */}
              <ImageList 
                runClarifaiModel={this.runClarifaiModel}
                pushImageToState={this.pushImageToState}
                getPrimaryColor={this.getPrimaryColor}
                setExpectedImages={this.setExpectedImages}
                onRouteChange={this.onRouteChange}
                resetState={this.resetState}
                state={this.state}
                />
            </div>

            { /* ----- Right Column ----- */ }
            <div className='column right-column'>

              { /* ----- Graphs Component ----- */ }
              <Graphs 
                state={this.state}
                width='560'
                height='420'
                returnGraphsOnly={false}
                />

              { /* ----- Analysis Buttons ----- */ }
              <ReactTooltip place="top" type="dark" effect="solid">
                Add more images for<br />a more meaningful analysis!
              </ReactTooltip>

              <div className='title-container'>
                <h1>Choose an Analysis Method:</h1>
              </div>

              <div className='button-list'>
                <button 
                  onClick={() => { 
                    this.setState(Models.runModel('pca', this.state)) 
                  }}
                  data-tip='React-tooltip'
                  data-tip-disable={this.state.images.length > 4 && true
                  }> 
                    Principal Component Analysis
                </button>
                
                <button 
                  onClick={() => { 
                    this.setState(Models.runModel('kmeans', this.state)) 
                  }}
                  data-tip='React-tooltip'
                  data-tip-disable={this.state.images.length > 4 && true
                  }> 
                    K-Means Clustering
                </button>
              </div>

              {/* 
              <div className='button-list'>
                <button onClick={this.getState}>Log State</button>
              </div>
              */}

              { /* ----- ModelDescription Component ----- */ }
              <ModelDescription model={this.state.model}/>

            </div>
          </div>
        </React.Fragment>
      )
    }
  }
}

export default App;
