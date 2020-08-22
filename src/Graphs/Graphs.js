import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import FadeIn from 'react-fade-in';
import '../App.css'

const Graphs = (props) => {

  useEffect(() => { 

    const drawGraph = (model) => {

      // Create an array within traceData for every cluster
      // each array contains the x, y, and z values
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
            color: '',
            opacity: 0.7, 
            line: {
              color: 'rgb(204, 204, 204)',
              width: 1
            },
          }
          
        })
      }
  
      // map h => x, s => y, v => z, then input into traceData
      props.state.images.forEach((image, i) => {
        const idx = (
          model === 'kmeans' 
            ? image.index // using the respective cluster for K-Means model
            : 0 // single cluster for pre-analysis plot or PCA model
        )
        const { h, s, v } = image.primaryColorHSV;
        traceData[idx].x.push(h);
        traceData[idx].y.push(s);
        traceData[idx].z.push(v);
        traceData[idx].text.push(image.id);
      })

      const traceColors = [
        'rgb(57, 201, 237)',
        'rgb(59, 217, 77)',
        'rgb(250, 171, 12)',
        'rgb(237, 45, 224)'
      ]

      traceData.forEach((trace, i) => {
        trace.marker.color = traceColors[i];
        trace.name = `Cluster ${i + 1}`
      })

      if (model === 'pca') { traceData[0].marker.color = traceColors[3] };
      
      let title = 'Hue, Saturation, and Brightness';
      if (model === 'pca') { title = 'Principal Component Analysis' };
      if (model === 'kmeans') { title = 'K-Means Clustering Algorithm' };
  
      const layout = {
        title,
        scene: {
          xaxis: { title: 'Hue' },
          yaxis: { title: 'Saturation' },
          zaxis: { title: 'Brightness' }
        }
      }

      Plotly.react('graph-output', traceData, layout, { displayModeBar: false });

      const modelPlot = document.getElementById('graph-output');

      /*
      * ---- Sets effect where hovering over a plot point highlights
      * ---- the respective image within ImageList componenet. The
      * ---- data.points[0].text entry stores the image id.
      */
      modelPlot.on('plotly_hover', function(data){
        const id = `image${data.points[0].text}`; // text stores the image id 
        const curveNumber = (model === 'pca' ? 3 : data.points[0].curveNumber);
        const highlightImage = document.getElementById(id);
        highlightImage.style.border = `8px solid ${traceColors[curveNumber]}`;
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