import React, { useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup, Image, Alert } from "react-bootstrap";
import { CloudUpload, Save, Person, Trash } from "react-bootstrap-icons";
import axiosInstance from '../common/axiosInstance';
import Popup from '../Popup/Popup'; // Ensure Popup component is correctly imported

const User = () => {
  const [employeeCode, setEmployeeCode] = useState("");
  const [fullname, setFullname] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState(""); // New state for image path
  const [dobError, setDobError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [employeeCodeError, setEmployeeCodeError] = useState("");
  const [isEmployeeCodeValid, setIsEmployeeCodeValid] = useState(true);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [popup, setPopup] = useState({ show: false, title: '', message: '' }); // Fixed the Popup state naming
 
 
  const handleGetData = () => {
    if (employeeCode) {
      axiosInstance.get(`/api/employee/${employeeCode}`)
        .then(response => {
          const data = response.data;
          if (data) {
            setFullname(data.fullname || "");
            setMobile(data.mobile || "");
            setEmail(data.email || "");
            const dobFormatted = data.dob ? new Date(data.dob).toISOString().substr(0, 10) : "";
            setDob(dobFormatted);
            setPassword(data.password || "");
            setConfirmPassword(data.password || "");
            setStatus(data.status || "active");
  
            // Assuming 'data.image' already contains the correct URL or relative path
            const imageUrl = data.image ? data.image : null;
            console.log('Image URL:', imageUrl); // Debugging
            setImage(imageUrl); // Set image path for display
            setIsEmployeeCodeValid(true);
            setEmployeeCodeError("");
            setIsDataFetched(true);
          } else {
            setIsEmployeeCodeValid(false);
            setEmployeeCodeError("Employee code not found.");
            setIsDataFetched(false);
          }
        })
        .catch(() => {
          setEmployeeCodeError("Employee data is not available.");
          setIsDataFetched(false);
        });
    } else {
      setEmployeeCodeError("Please enter an employee code.");
      setIsEmployeeCodeValid(false);
    }
  };
  
  
    const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const response = await axiosInstance.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        const uploadedImagePath = response.data.path; // Get the full path from the response
        setImagePath(uploadedImagePath); // Store the full path
        setImage(URL.createObjectURL(file)); // Display the image locally
      } catch (error) {
        console.error('Error uploading the image:', error);
        setPopup({ show: true, title: 'Error', message: 'Image upload failed.' });
      }
    }
  };
    

  const handleImageDelete = () => {
    setImage(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword || (password === "" && confirmPassword === "")) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordError("");
  
    try {
      await axiosInstance.post('/user/update', {
        employeeCode,
        fullname,
        mobile,
        email,
        dob,
        password,
        status,
        imagePath // Ensure this is included in the update request
      });
      setPopup({ show: true, title: 'Success', message: 'Data saved successfully!' });
    } catch {
      setPopup({ show: true, title: 'Error', message: 'There was an error updating the data.' });
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

  return (
    <Container fluid>
      <Row className="align-items-center m-3">
        <Col>
          <h4>User Registration</h4>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleSubmit} disabled={dobError !== "" || !isEmployeeCodeValid || !isDataFetched}>
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
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Enter Employee Code"
                      value={employeeCode}
                      onChange={(e) => setEmployeeCode(e.target.value)}
                      isInvalid={!isEmployeeCodeValid}
                    />
                    <Button variant="outline-primary" onClick={handleGetData}>
                      Get Data
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {employeeCodeError}
                    </Form.Control.Feedback>
                  </InputGroup>
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
                    readOnly={!isDataFetched}
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
                    readOnly={!isDataFetched}
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
                    readOnly={!isDataFetched}
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
                    readOnly={!isDataFetched}
                  />
                  {dobError && (
                    <Alert variant="danger" className="mt-2">
                      {dobError}
                    </Alert>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    readOnly={!isDataFetched}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {passwordError && (
                    <Alert variant="danger" className="mt-2">
                      {passwordError}
                    </Alert>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <div>
                    <Form.Check
                      type="radio"
                      id="active"
                      name="status"
                      label="Active"
                      checked={status === "active"}
                      onChange={() => setStatus("active")}                      
                    />
                    <Form.Check
                      type="radio"
                      id="inactive"
                      name="status"
                      label="Inactive"
                      checked={status === "inactive"}
                      onChange={() => setStatus("inactive")}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <Button variant="primary" onClick={handleSubmit} disabled={dobError !== "" || !isEmployeeCodeValid || !isDataFetched}>
                  <Save className="me-2" />
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col md={4} className="d-flex flex-column align-items-center">
          {image ? (
            <>
              <Image
                src={image}
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
                  <Form.Control type="file" onChange={handleImageUpload} />
                  <InputGroup.Text>
                    <CloudUpload />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </>
          )}
        </Col>
      </Row>

      {/* Popup component usage */}
      <Popup 
        show={popup.show}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup({ ...popup, show: false })}
      />
    </Container>
  );
};

export default User;
