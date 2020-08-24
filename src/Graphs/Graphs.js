import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import FadeIn from 'react-fade-in';
import '../App.css'

const Graphs = (props) => {

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
    props.state.images.forEach((image, i) => {
      const idx = (
        model === 'kmeans' 
          ? image.index // using the respective cluster for K-Means model
          : 0 // single cluster for pre-analysis plot or PCA model
      )
      if (model === 'pca') { // one-axis plot for pca model
        traceData[0].type = 'scatter';
        traceData[0].x.push(image.index)
        traceData[0].y.push(0)
        traceData[0].text.push(image.id);
        delete traceData[0].z;
      } else { 
        const { h, s, v } = image.primaryColorHSV;
        traceData[idx].type = 'scatter3d';
        traceData[idx].x.push(h);
        traceData[idx].y.push(s);
        traceData[idx].z.push(v);
        traceData[idx].text.push(image.id);
      }
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
    
    let title = 'Hue, Saturation, and Brightness';
    if (model === 'pca') { title = 'Principal Component Analysis' };
    if (model === 'kmeans') { title = 'K-Means Clustering Algorithm' };

    let layout = {
      title,
      scene: {
        xaxis: { title: 'Hue' },
        yaxis: { title: 'Saturation' },
        zaxis: { title: 'Brightness' }
      },
      margin: { l:36, r:36, t:36, b:36 },
      width: props.width,
      height: (model === 'pca')
        ? 240
        : props.height
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
      const curveNumber = data.points[0].curveNumber;
      const highlightImage = document.getElementById(id);
      if (highlightImage) {
        highlightImage.style.border = `8px solid ${traceColors[curveNumber]}`;
      }
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

  useEffect(() => { 
    if (props.state.images.length) {
      drawGraph(props.state.model);
    }
  }, [props.state, drawGraph]);

  if (props.returnGraphOnly) {
    return <div id='graph-output'></div>
  }

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