import React, {useState} from 'react';
import { Accordion, Button, Card } from 'react-bootstrap';
import './UploadPhoto';
import { getToken } from '../../Util/HelperFunctions';
import axios from 'axios';

function UploadPhoto() {

const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [successMsg, setSuccessMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(e.target.value);
    };
    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
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

    const uploadImage = async (base64EncodedImage) => {
        try {
            let file = new FormData();
            file.append('file', selectedFile);
            await axios.post('http://localhost:8000/upload_image', file,
                {headers: { 'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`},
            });
            setFileInputState('');
            setPreviewSource('');
            setSuccessMsg('Photo uploaded successfully!');
            console.log(successMsg)
        } catch (err) {
            setErrMsg('Something went wrong!');
        }
    };
    return (
        <div>
            <Accordion defaultActiveKey="1">
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                     <h5 className="title">Upload an Image</h5>
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
               
                    <form onSubmit={handleSubmitFile} className="form">
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
                    </form>
                    {previewSource && (
                        <img
                            src={previewSource}
                            alt="chosen"
                            style={{ height: '300px' }}
                        />
                    )}
                      {successMsg && <h6 style={{"margin-top":"45px", "color":"#008000"}}> {successMsg} </h6>}
                      {errMsg && <h6 style={{"margin-top":"45px", "color":"#FF0000"}}> {errMsg} </h6>}
                </Card.Body>
              </Accordion.Collapse>
           </Card>
        </Accordion>
        </div>
    );
}

export default UploadPhoto;
