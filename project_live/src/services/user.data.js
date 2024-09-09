import axiosInstance from "../component/common/axiosInstance";

 
export function updateUsers({ employeeCode, password, status }) {
  debugger

    return axiosInstance.post('/api/users/update', {
        employeeCode, 
        password, 
        status
    })
 }