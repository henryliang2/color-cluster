import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import FadeIn from 'react-fade-in';
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
          text: [],
          mode: 'markers',
          type: 'scatter3d',
          marker: { 
            opacity: 0.7, 
            line: {
              color: 'rgb(204, 204, 204)',
              width: 1
            },
          }
          
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
        traceData[idx].text.push(image.id);
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

      Plotly.newPlot('graph-output', traceData, layout);

      const modelPlot = document.getElementById('graph-output');

      modelPlot.on('plotly_hover', function(data){
        const id = `image${data.points[0].text}`; // text stores the image id 
        const highlightImage = document.getElementById(id);
        highlightImage.style.border = '8px solid #2585cf';
      })
      .on('plotly_unhover', function(data){
        const allImages = document.querySelectorAll('img');
        allImages.forEach(image => {
          image.style.border = '8px solid white';
          image.onmouseover = () => { image.style.border = '8px solid #2585cf' }
          image.onmouseout = () => { image.style.border = '8px solid white' }
        })
      })
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
      <FadeIn wrapperTag={'span'}>
        <div id='graph-output'></div>
      </FadeIn>
    </React.Fragment>
  );

}

export default Graphs