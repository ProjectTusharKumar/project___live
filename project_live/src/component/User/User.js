import React, { useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup, Image, Alert } from "react-bootstrap";
import { CloudUpload, Save, Person, Trash } from "react-bootstrap-icons";
import axiosInstance from '../common/axiosInstance';
import Popup from '../Popup/Popup'; // Ensure Popup component is correctly imported
import { getRegistrationDetails } from "../../services/registration.data";
import { updateUsers } from "../../services/user.data";

const User = () => {
 const [regObj, setRegObj] = useState({})
 
  const [passwordError, setPasswordError] = useState("");
  const [isEmployeeCodeValid, setIsEmployeeCodeValid] = useState(true);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [popup, setPopup] = useState({ show: false, title: '', message: '' }); // Fixed the Popup state naming
 
 
  const handleGetData = () => {
    var employeeCode = "105";
    if (employeeCode) {
      getRegistrationDetails(employeeCode)
        .then(response => {
          const data = response.data;
          if (data) {
            let __regObj = { ...data};
            __regObj['dob']  = data.dob ? new Date(data.dob).toISOString().substr(0, 10) : "";
            __regObj['status'] = data.status || "active";
            setRegObj(__regObj);
            setIsEmployeeCodeValid(true);
            setIsDataFetched(false);
          }
          else {
            setPopup({ show: true, title: 'Error', message: "Employee code not found." });
          } 
        }).catch((err) => {
          setPopup({ show: true, title: 'Error', message: "Employee data is not available." });
          setIsDataFetched(false);
        });
    } else {
      setPopup({ show: true, title: 'Error', message: "Please enter an employee code." });
      setIsEmployeeCodeValid(false);
    }
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    let __passwordErr = "";
    if (regObj.password !== regObj.confirmPassword || (regObj.password === "" && regObj.confirmPassword === "")) {
      __passwordErr = "Passwords do not match.";
      setPasswordError(__passwordErr);
      return;
    }
    updateUsers(regObj).then((res) => {
      setPopup({ show: true, title: 'Success', message: 'Data saved successfully!' })
    }).catch((err) => {
      setPopup({ show: true, title: 'Error', message: 'There was an error updating the data.' });
    })
  };

  const handleOnChange = (key, value) => {
    setRegObj((prev) => {
      let __prevObj = { ...prev };
      __prevObj[key] = value;
      return __prevObj;
    })
  }
  
  
  return (
    <Container fluid>
      <Row className="align-items-center m-3">
        <Col>
          <h4>User Registration</h4>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleSubmit} disabled={!isEmployeeCodeValid || !isDataFetched}>
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
                      value={regObj.employeeCode}
                      isInvalid={!isEmployeeCodeValid}
                    />
                    <Button variant="outline-primary" onClick={handleGetData}>
                      Get Data
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Fullname</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Fullname"
                    value={regObj.fullname} 
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
                    value={regObj.mobile}
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
                    value={regObj.email}
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
                    value={regObj.dob}
                    required
                    readOnly={!isDataFetched}
                  />
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
                    value={regObj.password}
                    onChange={(e) => handleOnChange('password', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={regObj.confirmPassword}
                    onChange={(e) => handleOnChange('confirmPassword', e.target.value)}
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
                      checked={regObj.status === "active"}
                      onChange={() => handleOnChange('status',"active")}                      
                    />
                    <Form.Check
                      type="radio"
                      id="inactive"
                      name="status"
                      label="Inactive"
                      checked={regObj.status === "inactive"}
                      onChange={() => handleOnChange('status',"inactive")}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <Button variant="primary" onClick={handleSubmit} disabled={regObj.password === "" || regObj.confirmPassword === "" }>
                  <Save className="me-2" />
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col md={4} className="d-flex flex-column align-items-center">
          {regObj.image ? (
            <>
              <Image
                src={regObj.image}
                roundedCircle
                fluid
                style={{ width: '150px', height: '150px', marginBottom: '20px' }}
              />
            </>
          ) : (
            <>
              <Person
                className="mb-3"
                style={{ fontSize: '150px', color: '#6c757d' }}
              />
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
