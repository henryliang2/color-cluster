import React from 'react';
import FadeIn from 'react-fade-in'
import ImageCard from '../ImageCard/ImageCard'
import Graphs from '../Graphs/Graphs'
import './Demonstration.css'
import '../App.css'
const demoImages = require('./demoimages.json')

class Welcome extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      images: [],
      model: '',
      numOfClusters: 1
    }
  }

  componentDidMount() {
    this.setState(demoImages);
  }

  render() {
    return (
      <React.Fragment>
        <div className='title-container'>
          {/* Intentionally empty for spacing */}
        </div>
          <div className='welcome-image-container'>
            { 
              this.state.images.map( (image, i) => {
                return <ImageCard 
                        key={i}
                        id={image.id}
                        url={image.url}
                        dimension='120'
                      />
                })
            }
          </div>
          <Graphs 
            state={this.state} 
            returnGraphOnly={true}
            width='400'
            height='400'
            />
       
      </React.Fragment>
    );
  }
}

export default Welcome;