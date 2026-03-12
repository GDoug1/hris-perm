type Props = {
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  onLogin: () => void | Promise<void>;
  error?: string;
  loading?: boolean;
};

const LoginCard = ({
  email,
  password,
  setEmail,
  setPassword,
  onLogin,
  error,
  loading = false
}: Props) => {
  return (
    <div className="login-card">
      <div className="logo">
        <img src="/src/assets/ireply.png" alt="Logo" />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <button
        className="login-btn"
        onClick={onLogin}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'LOG IN'}
      </button>
    </div>
  );
};

export default LoginCard;
