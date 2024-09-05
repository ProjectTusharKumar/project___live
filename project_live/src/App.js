import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // For Bootstrap Icons
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './component/Login/Login'
import Registration from './component/Registration/Registration';
import User from './component/User/User'
function App() {
  return (
  <>    
  <Router>
    <Routes>
      <Route path="/Login" element={<Login />} />
       <Route path="/" element={<Registration />} />
       <Route path="/User" element={<User />} />
       </Routes>
</Router>
  </>
  );
}
export default App;
