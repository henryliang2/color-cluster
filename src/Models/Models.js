const skmeans = require('skmeans');
const { PCA } = require('ml-pca');

const runModel = (model, state) => {
  let dataset = [];
  if (state.images.length < 1) {
    console.log('Must be populated')
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
  let numOfClusters = 1; // default to 1

  if (model === 'pca') {
    // Input into PCA model
    const pca = new PCA(dataset, {
      method: 'NIPALS',
      nCompNIPALS: 1, // reduce to one-dimensional space
    });
    
    // Project each image's HSV values into PCA space
    const pcaModel = pca.predict(dataset)
    modelOutput = pcaModel;
    console.log(pcaModel)
    
  } else if (model === 'kmeans') {
    // input into k-means model with 3 clusters
    numOfClusters = 3;
    const clusters = skmeans(dataset, numOfClusters);
    modelOutput = clusters;
    console.log(clusters);
  }

  let outputArray = [];

  state.images.forEach( (image, i) => {
    outputArray.push({ 
      id: image.id, 
      url: image.url, 
      primaryColorHex: image.primaryColorHex,
      primaryColorHSV: image.primaryColorHSV,
      index: (model === 'pca' ? modelOutput.data[i][0] : modelOutput.idxs[i])})
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

module.exports = { runModel };