import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginCard from '../components/Login/LoginCard';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch(
        'http://localhost/hris/backend/auth/login.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,         // reuse email as username
            password
          }),
          credentials: 'include' // 🔑 IMPORTANT (sessions)
        }
      );

      const data = await res.json();

      if (data.success) {

        // Fetch session permissions
        const sessionRes = await fetch(
          'http://localhost/hris/backend/auth/get_session.php',
          { credentials: 'include' }
        );

        const sessionData = await sessionRes.json();

        if (sessionData.success) {
          localStorage.setItem('permissions', JSON.stringify(sessionData.permissions));
          localStorage.setItem('role', sessionData.role);
        }

        localStorage.setItem('user', JSON.stringify(data.user));

        navigate('/dashboard', { replace: true });
      }
      else {
              setError(data.message || 'Invalid email or password');
            }

          } catch (err) {
            console.error(err);
            setError('Server error. Please try again.');
          } finally {
            setLoading(false);
          }
        };

  return (
    <div className="container">
      <div className="login-container">
        <LoginCard
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onLogin={handleLogin}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Login;
