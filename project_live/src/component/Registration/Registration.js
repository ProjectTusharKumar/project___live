import React, { useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup, Image, Alert } from "react-bootstrap";
import { Save, Person, Trash } from "react-bootstrap-icons";
import Popup from '../Popup/Popup';
import { v4 as uuidv4 } from 'uuid';
import { saveRegistration } from "../../services/registration.data";

const RegistrationForm = () => {
  const [regObj, setRegObj] = useState({
    employeeCode:'',
    fullname:'',
    mobile:'',
    email:'',
    dob:'',
    image:'',
    imagePath:'',
    dobError: ''
  })
   
  const [popup, setPopup] = useState({ show: false, title: '', message: '' });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRegObj((prev)=>{
        let prevObj ={...prev};
        prevObj.image = file;
        prevObj.imagePath = URL.createObjectURL(file);
        return prevObj;
      });
    }
  };

  const handleImageDelete = () => {
    setRegObj((prev)=>{
      let prevObj ={...prev};
      prevObj.image = null;
      prevObj.imagePath = "";
      return prevObj;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUuid = uuidv4();

    if (regObj.dobError) return; // Prevent submission if there are errors

    const formData = new FormData();
    let __keys = Object.keys(regObj);
    let __keyName = ''
    for(let i = 0; i < __keys.length; i++) {
      __keyName = __keys[i];
      formData.append(__keyName, regObj[__keyName]);
    }
    formData.append("Uuid", newUuid);

    if (regObj.image) {
      formData.append("image", regObj.image); // Append the image if present
    }

    saveRegistration(formData).then((reponse) =>{
      setPopup({ show: true, title: 'Success', message: 'Data saved successfully!' });
    }).catch((error) => {
      console.error('Error:', error);
      setPopup({ show: true, title: 'Error', message: 'User already exists or another issue occurred.' });
    });
  }

  const handleDobChange = (e) => {
    const inputDate = new Date(e.target.value);
    const today = new Date();
    const age = today.getFullYear() - inputDate.getFullYear();
    let __dobError = ""
    if (age < 18 || (age === 18 && today < new Date(today.getFullYear(), inputDate.getMonth(), inputDate.getDate()))) {
      __dobError = "You must be 18 years or older.";
    } 
    setRegObj((prev)=>{
      let prevObj ={...prev};
      prevObj.dob = e.target.value;
      prevObj.dobError = __dobError
      return prevObj;
    });
  };

  const handleOnChange = (key, value) => {
    setRegObj((prev)=>{
      let prevObj ={...prev};
      prevObj[key] = value;
      return prevObj;
    });
  }

  const handleClosePopup = () => {
    setPopup({ show: false, title: '', message: '' });
  };

  return (
    <Container fluid>
      <Popup 
        show={popup.show} 
        onClose={handleClosePopup} 
        title={popup.title} 
        message={popup.message} 
      />

      <Row className="align-items-center m-3">
        <Col>
          <h4>Employee Registration</h4>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleSubmit} disabled={regObj.dobError !== ""}>
            <Save className="me-2" />
            Save
          </Button>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Employee Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Employee Code"
                    value={regObj.employeeCode}
                    onChange={(e) => handleOnChange('employeeCode', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Fullname</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Fullname"
                    value={regObj.fullname}
                    onChange={(e) => handleOnChange('fullname', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Mobile Number"
                    value={regObj.mobile}
                    onChange={(e) => handleOnChange('mobile', e.target.value)}
                    pattern="^\d{10}$"
                    title="Please enter a valid 10-digit mobile number"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={regObj.email}
                    onChange={(e) => handleOnChange('email', e.target.value)}
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    title="Please enter a valid email address"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={regObj.dob}
                    onChange={handleDobChange}
                    required
                  />
                  {regObj.dobError && (
                    <Alert variant="danger" className="mt-2">
                      {regObj.dobError}
                    </Alert>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col md={4} className="d-flex flex-column align-items-center">
          {regObj.image ? (
            <>
              <Image 
                src={regObj.imagePath}  // Use image path to display image
                roundedCircle 
                fluid 
                style={{ width: '150px', height: '150px', marginBottom: '20px' }} 
              />
              <Button variant="danger" onClick={handleImageDelete}>
                <Trash /> Remove Image
              </Button>
            </>
          ) : (
            <>
              <Person 
                className="mb-3" 
                style={{ fontSize: '150px', color: '#6c757d' }} 
              />
              <Form.Group>
                <Form.Label>Profile Image</Form.Label>
                <InputGroup>
                  <Form.Control type="file" onChange={handleImageChange} />
                </InputGroup>
              </Form.Group>
            </>
          )}
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <Button variant="primary" onClick={handleSubmit} disabled={regObj.dobError !== ""}>
            <Save className="me-2" />
            Save
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationForm;
