import axiosInstance from "../component/common/axiosInstance";

export function getLoginDetails(employeeCode, password) {
    return axiosInstance.post('/login', {
        employeeCode,
        password,
    });
}