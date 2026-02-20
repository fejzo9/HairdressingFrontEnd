import { useState } from 'react';
import PropTypes from 'prop-types';
import API_BASE_URL from '../config/api';

function ResendVerificationModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/resend-verification-email?email=${encodeURIComponent(email)}`,
        { method: 'POST' }
      );

      if (response.ok) {
        setSuccessMessage('Verification email sent again. Please check your inbox.');
      } else {
        const text = await response.text();
        setErrorMessage(text || 'Failed to resend verification email. Please try again.');
      }
    } catch {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resendModalLabel"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="resendModalLabel">Resend Verification Email</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            {!successMessage && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="resendEmail" className="form-label">
                    Email address
                  </label>
                  <input
                    id="resendEmail"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Sending...
                    </>
                  ) : (
                    'Send Verification Email'
                  )}
                </button>
              </form>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ResendVerificationModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ResendVerificationModal;
