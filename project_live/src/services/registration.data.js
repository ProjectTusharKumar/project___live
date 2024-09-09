import axiosInstance from "../component/common/axiosInstance";

export function saveRegistration(formData){
   return axiosInstance.post('/registration', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
}

export function getRegistrationDetails(employeeCode){
  return axiosInstance.get(`/api/employee/${employeeCode}`)
}