import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { loginUser } from "../../features/user/userSlice";
import styles from "../../styles/CustomBank.module.css";

const LoginUser = ({ onSubmit, onFailure }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: 'slav@mail.com',
    password: 'Qwerty!123',
  });
  const [error, setError] = useState('');
  const [isLoginClicked, setLoginClicked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOk = async () => {
    setLoginClicked(true);
    const { email, password } = formData;
    if (email === '' || password === '') {
      setError('Please fill in all fields.');
      setLoginClicked(false);
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)) {
        onSubmit(result.payload);
      } else {
        setError('Login failed.');
        setLoginClicked(false);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        setError('Network error occurred.');
      }
      setLoginClicked(false);
    }
  };

  const handleClose = () => {
    onFailure();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.worktBox}>
        <div className={styles.titleBar}>
          <button className={styles.closeBtn} onClick={handleClose}>&times;</button>
        </div>
        <div className={styles.contentArea}>
          <h2 className={styles.alertText}>Login to Your Account</h2>
          <form>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </form>
          {error && <p className={styles.errorText}>{error}</p>}
          <div className={styles.buttonGroup}>
            {!isLoginClicked && (
              <button className={styles.okBtn} onClick={handleOk}>Login</button>
            )}
            <button className={styles.cancelBtn} onClick={handleClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginUser.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
};

export default LoginUser;