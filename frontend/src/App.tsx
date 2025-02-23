import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import UsersPage from './pages/Users/UsersPage';

function App() {
  return (
    <div data-testid="app-container">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/" element={<LoginPage />} />  {/* Redirection par défaut */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;