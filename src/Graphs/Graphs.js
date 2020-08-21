import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import '../App.css'

const Graphs = (props) => {

  useEffect(() => { 

    const drawGraph = (model) => {

      const { numOfClusters } = props.state;
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
      props.state.images.forEach((image, i) => {
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

    if (props.state.images.length) {
      drawGraph(props.state.model);
    }
  }, [props.state]);

  return (
    <React.Fragment>
      <div className='title-container'>
        <h1>Plot</h1>
      </div>
      <div id='graph-output'></div>
    </React.Fragment>
  );

}

export default Graphs