import React from 'react'
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import './Dropzone.css'

const MyDropzone = (props) => {
  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }
  
  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }
  
  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(file => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const binaryStr = reader.result;
        console.log(binaryStr);
        let base64Str = btoa(String.fromCharCode(...new Uint8Array(binaryStr)));
        const awaitClarifai = async () => {
          const output = await props.runClarifaiModel(base64Str);
          await console.log(output);
          const primaryColor = await props.getPrimaryColor(output)
          const currentState = await props.getState();
          await props.pushImageToState(
            currentState.images.length + 1,
            "data:image/png;base64," + base64Str, // need to correct to accept all, also to createUrlObject
            primaryColor,
            null
          )
        }
        awaitClarifai();
      }
      reader.readAsArrayBuffer(file.file)
      
      file.remove()
    })
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept="image/*"
    />
  )
}

export default MyDropzone