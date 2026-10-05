import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authApi.register({ username, password, email, fullName });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Registration successful! Redirecting to login...</div>;
  }

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Create Account</h1>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{ padding: '0.5rem' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: '0.5rem' }}
        />
        <input 
          type="email" 
          placeholder="Email (optional)" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <input 
          type="text" 
          placeholder="Full Name (optional)" 
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '0.5rem', cursor: 'pointer' }}>
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
