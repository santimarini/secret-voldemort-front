import React, { useState } from 'react';
import {
  Accordion, Button, Card, Form, Image,
} from 'react-bootstrap';
import axios from 'axios';
import { getToken } from '../../Util/HelperFunctions';

function UploadPhoto() {
  const [fileInputState, setFileInputState] = useState('');
  const [previewSource, setPreviewSource] = useState('');
  const [selectedFile, setSelectedFile] = useState();
  let [imageUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dsmdvuj2y/image/upload';
  const CLOUDINARY_UPLOAD_PRESET = 'h2panuf3';
  const CLOUDINARY_API_KEY = '633493237248468';

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setSelectedFile(file);
    setFileInputState(e.target.value);
  };

  async function uploadToCloudinary() {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', CLOUDINARY_API_KEY);

    await axios({
      url: CLOUDINARY_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-urlencoded',
      },
      data: formData,
    })
      .then((response) => {
        imageUrl = response.data.url;
      })
      .catch((err) => {
        alert(err);
      });
  }

  const uploadImage = async () => {
    // send image url to backend
    try {
      await uploadToCloudinary();
      await axios.post(
        `http://localhost:8000/upload_image?photo=${imageUrl}`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      setFileInputState('');
      setPreviewSource('');
      setSuccessMsg('Photo uploaded successfully!');
      setTimeout(() => {
        window.location.href = '/profile';
      }, 2000);
    } catch (err) {
      setErrMsg('Something went wrong!');
    }
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();

    if (!selectedFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      uploadImage(reader.result);
    };
    reader.onerror = () => {
      setErrMsg('something went wrong!');
    };
  };

  return (
    <div>
      <Accordion defaultActiveKey="1">
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Upload an Image
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Form
                style={{ 'margin-top': '45px' }}
                onSubmit={handleSubmitFile}
                className="form"
              >
                <input
                  id="fileInput"
                  type="file"
                  name="image"
                  onChange={handleFileInputChange}
                  value={fileInputState}
                  className="form-input"
                />
                <Button id="btn-form" className="btn" type="submit">
                  Upload Photo
                </Button>
              </Form>
              {previewSource ? (
                <div>
                  <Image
                    style={{ 'margin-top': '80px' }}
                    height="160px"
                    width="160px"
                    src={previewSource}
                    alt="chosen"
                    roundedCircle
                  />
                  <h6 style={{ 'margin-top': '25px' }}>
                    {' '}
                    <small> Preview</small>
                    {' '}
                  </h6>
                </div>
              ) : (
                !successMsg
                && !errMsg && (
                  <div>
                    <h6 style={{ 'margin-top': '40px', color: '#FF0000' }}>
                      <small>
                        It is recommended that profile photo be 160px x 160px.
                      </small>
                    </h6>
                    <h6 style={{ 'margin-top': '10px', color: '#8b0000' }}>
                      <small>
                        If the selected photo is larger than indicated, it will
                        be cropped to that size!
                        {' '}
                        <span style={{ 'font-size': '18px' }}>&#128556;</span>
                      </small>
                    </h6>
                  </div>
                )
              )}

              {successMsg && (
                <h6 style={{ 'margin-top': '45px', color: '#008000' }}>
                  {' '}
                  {successMsg}
                  {' '}
                </h6>
              )}
              {errMsg && (
                <h6 style={{ 'margin-top': '45px', color: '#FF0000' }}>
                  {' '}
                  {errMsg}
                  {' '}
                </h6>
              )}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}

export default UploadPhoto;
