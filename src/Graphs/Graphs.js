import React, { Component } from 'react';
import Plotly from 'plotly.js-dist';

class Graphs extends Component {
  constructor(props) {
    super(props)
  }

  drawGraph = () => {
    const trace1 = {
      x: [], 
      y: [], 
      z: [],
      mode: 'markers',
      type: 'scatter3d',
    };

    const layout = {
      title: { text: 'Principal Component Analysis' },
      scene: {
        xaxis: { title: 'Hue' },
        yaxis: { title: 'Saturation' },
        zaxis: { title: 'Brightness' }
      }
    }

    // map h => x, s => y, v => z
    this.props.state.images.forEach((image, i) => {
      trace1.x.push(image.primaryColorHSV.h);
      trace1.y.push(image.primaryColorHSV.s);
      trace1.z.push(image.primaryColorHSV.v);
    })

    Plotly.newPlot('graph-output', [trace1], layout)
  }

  componentDidUpdate() {
    if (this.props.state.modelExists) {
      this.drawGraph();
    }
  }

  render() {
    return (
      ''
    );
  }
}

export default Graphs