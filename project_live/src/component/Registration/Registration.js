import React, { useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup, Image, Alert } from "react-bootstrap";
import { Save, Person, Trash } from "react-bootstrap-icons";
import axiosInstance from '../common/axiosInstance';
import Popup from '../Popup/Popup';
import { v4 as uuidv4 } from 'uuid';

const RegistrationForm = () => {
  const [employeeCode, setEmployeeCode] = useState("");
  const [fullname, setFullname] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState("");  // Store image path here
  const [dobError, setDobError] = useState("");
  const [popup, setPopup] = useState({ show: false, title: '', message: '' });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set the image file for later submission
      setImagePath(URL.createObjectURL(file)); // Save the image path
    }
  };

  const handleImageDelete = () => {
    setImage(null); // Clear the image when removed
    setImagePath(""); // Clear the image path
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUuid = uuidv4();

    if (dobError) return; // Prevent submission if there are errors

    const formData = new FormData();
    formData.append("employeeCode", employeeCode);
    formData.append("Uuid", newUuid);
    formData.append("fullname", fullname);
    formData.append("mobile", mobile);
    formData.append("email", email);
    formData.append("dob", dob);
    formData.append("imagePath", imagePath);  // Add image path to form data
    if (image) {
      formData.append("image", image); // Append the image if present
    }

    try {
      const response = await axiosInstance.post('/employee/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      
      setPopup({ show: true, title: 'Success', message: 'Data saved successfully!' });
      console.log(imagePath)
    } catch (error) {
      console.error('Error:', error);
      setPopup({ show: true, title: 'Error', message: 'User already exists or another issue occurred.' });
    }
  };

  const handleDobChange = (e) => {
    const inputDate = new Date(e.target.value);
    const today = new Date();
    const age = today.getFullYear() - inputDate.getFullYear();
    if (age < 18 || (age === 18 && today < new Date(today.getFullYear(), inputDate.getMonth(), inputDate.getDate()))) {
      setDobError("You must be 18 years or older.");
    } else {
      setDobError("");
    }
    setDob(e.target.value);
  };

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
          <Button variant="primary" onClick={handleSubmit} disabled={dobError !== ""}>
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
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
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
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
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
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={dob}
                    onChange={handleDobChange}
                    required
                  />
                  {dobError && (
                    <Alert variant="danger" className="mt-2">
                      {dobError}
                    </Alert>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col md={4} className="d-flex flex-column align-items-center">
          {image ? (
            <>
              <Image 
                src={imagePath}  // Use image path to display image
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
          <Button variant="primary" onClick={handleSubmit} disabled={dobError !== ""}>
            <Save className="me-2" />
            Save
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationForm;
