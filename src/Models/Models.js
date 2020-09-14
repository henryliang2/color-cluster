const skmeans = require('skmeans');
const { PCA } = require('ml-pca');

const runModel = (model, state) => {
  let dataset = [];
  if (state.images.length < 1) {
    alert("You must have at least one image!")
    return null
  }
  // dataset is an array of arrays of format [h, s, v]
  state.images.forEach( image => {
    dataset.push([
      image.primaryColorHSV.h, 
      image.primaryColorHSV.s, 
      image.primaryColorHSV.v 
    ])
  });

  let modelOutput;
  let outputArray = [];
  let numOfClusters = 1; // default to 1

  // Run PCA model
  if (model === 'pca') {
    const pca = new PCA(dataset, {
      method: 'NIPALS',
      nCompNIPALS: 1, // reduce to one-dimensional space
    });
    
    // Project each image's existing HSV values into PCA space
    const pcaModel = pca.predict(dataset)
    modelOutput = pcaModel;

  } 

  // K-Means Model but with not enough images
  else if (model === 'kmeans' && state.images.length < 3) {

    state.images.forEach( (image, i) => {
      outputArray.push({ 
        id: image.id, 
        url: image.url, 
        colors: image.colors,
        primaryColorHex: image.primaryColorHex,
        primaryColorHSV: image.primaryColorHSV,
      });
    })

    return {
      images: outputArray,
      model: 'notEnoughPoints',
      numOfClusters: 1
    }
    
  }
  
  // Run K-Means Model
  else if (model === 'kmeans') {

    if      (state.images.length  < 4)  { numOfClusters = 1 } 
    else if ( state.images.length < 9)  { numOfClusters = 2 } 
    else if ( state.images.length < 16) { numOfClusters = 3 }
    else                                { numOfClusters = 4 }      

    const clusters = skmeans(dataset, numOfClusters);
    modelOutput = clusters;
  }

  state.images.forEach( (image, i) => {
    outputArray.push({ 
      id: image.id, 
      url: image.url, 
      primaryColorHex: image.primaryColorHex,
      primaryColorHSV: image.primaryColorHSV,
      colors: image.colors,
      index: (model === 'pca' 
        ? modelOutput.data[i][0] // PCA Model index
        : modelOutput.idxs[i]) // K-Means Cluster index
      })
  });
  outputArray.sort((a, b) => { 
    return a.index - b.index 
  });

  return {
    images: outputArray,
    model,
    numOfClusters
  }
}

const Models = {
  runModel: runModel
}

export { Models };