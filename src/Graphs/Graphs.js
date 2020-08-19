import React, { Component } from 'react';
import Plotly from 'plotly.js-dist';

class Graphs extends Component {
  constructor(props) {
    super(props)
  }

  drawGraph = (model) => {

    const { numOfClusters } = this.props.state;

    let traceData = [];

    for (let i=0; i < numOfClusters; i++) {
      traceData.push({
        x: [], 
        y: [], 
        z: [],
        mode: 'markers',
        type: 'scatter3d',
      })
    }

    // map h => x, s => y, v => z
    this.props.state.images.forEach((image, i) => {
      const idx = (
        model === 'kmeans' 
          ? image.index // multiple clusters for K-Means model
          : 0 // single cluster for pre-analysis plot or PCA model
      )

      traceData[idx].x.push(image.primaryColorHSV.h);
      traceData[idx].y.push(image.primaryColorHSV.s);
      traceData[idx].z.push(image.primaryColorHSV.v);
    })
    
    let title = 'Hue, Saturation, and Brightness';
    if (model === 'pca') { title = 'Principal Component Analysis' };
    if (model === 'kmeans') { title = 'K-Means Clustering Analysis' };

    const layout = {
      title,
      scene: {
        xaxis: { title: 'Hue' },
        yaxis: { title: 'Saturation' },
        zaxis: { title: 'Brightness' }
      }
    }

    Plotly.newPlot('graph-output', traceData, layout)
  }

  componentDidUpdate() {
    if (this.props.state.images.length) {
      this.drawGraph(this.props.state.model);
    }
  }

  render() {
    return (
      ''
    );
  }
}

export default Graphs