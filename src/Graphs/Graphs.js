import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import FadeIn from 'react-fade-in';
import '../App.css'

const Graphs = (props) => {

  const { state, width, height } = props;

  const drawGraph = (model) => {

    let graphTitle = 'Hue, Saturation, and Brightness';
    if (model === 'pca') { graphTitle = 'Principal Component Analysis' };
    if (model === 'kmeans') { graphTitle = 'K-Means Clustering Algorithm' };

    let layout = {
      graphTitle,
      scene: {
        xaxis: { title: 'Hue' },
        yaxis: { title: 'Saturation' },
        zaxis: { title: 'Brightness' }
      },
      margin: { l:36, r:36, t:36, b:36 },
      width: width,
      height: (model === 'pca') ? 240 : height,
      showlegend: false
    }

    // Create an array within traceData for every cluster
    // each array contains the x, y, and z values of the respective cluster
    const { numOfClusters } = state;
    let traceData = [];

    // for every cluster, create an empty object to hold data points
    // for pre-analysis and PCA model, there will only be one cluster.
    for (let i=0; i < numOfClusters; i++) {
      traceData.push({
        x: [], 
        y: [], 
        z: [],
        text: [],
        mode: 'markers',
        type: '',
        marker: { 
          color: '',
          opacity: 0.7,
          size: 18, 
          line: {
            color: 'rgb(204, 204, 204)',
            width: 1
          },
        }
        
      })
    }

    // map h => x, s => y, v => z, then input into traceData
    state.images.forEach((image, i) => {
      const clusterNumber = (
        model === 'kmeans' 
          ? image.index // using the respective cluster for K-Means model
          : 0 // single cluster for pre-analysis plot or PCA model
      )

      // for pca model, we only need one axis therefore push '0' to all values of y
      if (model === 'pca') { 
        traceData[0].type = 'scatter';
        traceData[0].x.push(image.index)
        traceData[0].y.push(0)
        traceData[0].text.push(image.id);
        delete traceData[0].z;
      } else { 
        const { h, s, v } = image.primaryColorHSV;
        traceData[clusterNumber].type = 'scatter3d';
        traceData[clusterNumber].x.push(h);
        traceData[clusterNumber].y.push(s);
        traceData[clusterNumber].z.push(v);
        traceData[clusterNumber].text.push(image.id);
      }
    })

    // a list of pre-selected colors for each cluster
    const traceColors = [ 
      'rgb(201, 75, 75)',
      'rgb(57, 201, 237)',
      'rgb(59, 217, 77)',
      'rgb(250, 171, 12)',
    ]
    traceData.forEach((trace, i) => { trace.marker.color = traceColors[i]; })

    Plotly.react('graph-output', traceData, layout, { displayModeBar: false });

    const modelPlot = document.getElementById('graph-output');

    ///
    // ---- Sets effect where hovering over a plot point highlights
    // ---- the respective image within ImageList componenet. The
    // ---- data.points[0].text entry stores the image id.
    ///
    modelPlot.on('plotly_hover', function(data){
      const id = `image${data.points[0].text}`; // text stores the image id 
      const curveNumber = data.points[0].curveNumber;
      const highlightImage = document.getElementById(id);
      if (highlightImage) {
        // set image to highlight the color of cluster
        highlightImage.style.border = `8px solid ${traceColors[curveNumber]}`;
      }
    })
    .on('plotly_unhover', function(data){
      const allImages = document.querySelectorAll('img');
      allImages.forEach((image, i) => {
        image.style.border = '8px solid white';
        // re-set image to highlight  primary color of self
        console.log('refresh');
        image.onmouseover = () => { image.style.border = `8px solid ${state.images[i].primaryColorHex}` }
        image.onmouseout = () => { image.style.border = '8px solid white' }
      })
    })
  }

  useEffect(() => { 
    if (state.images.length) {
      drawGraph(state.model);
      const allImages = document.querySelectorAll('img');
      allImages.forEach((image, i) => {
        image.style.border = '8px solid white';
        // re-set image to highlight  primary color of self
        console.log('refresh');
        image.onmouseover = () => { image.style.border = `8px solid ${state.images[i].primaryColorHex}` }
        image.onmouseout = () => { image.style.border = '8px solid white' }
      })
    }
  }, [state]);

  return (
    <React.Fragment>
      <div className='title-container'>
        <h1>Color Space Visualization</h1>
      </div>
      <FadeIn wrapperTag={'span'}>
        <div id='graph-output'></div>
      </FadeIn>
    </React.Fragment>
  );

}

export default Graphs