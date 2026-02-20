import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ResendVerificationModal from './ResendVerificationModal';

function VerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [showResendModal, setShowResendModal] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setErrorMessage('No verification token provided.');
      return;
    }

    fetch(`http://localhost:8080/users/verify?token=${encodeURIComponent(token)}`, {
      method: 'GET',
    })
      .then((res) => {
        if (res.ok) {
          setStatus('success');
        } else {
          return res.text().then((text) => {
            setStatus('error');
            setErrorMessage(text || 'Verification failed. The token may be expired or invalid.');
          });
        }
      })
      .catch(() => {
        setStatus('error');
        setErrorMessage('An error occurred during verification. Please try again.');
      });
  }, [searchParams]);

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Email Verification</h2>

      {status === 'loading' && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Verifying...</span>
          </div>
          <p className="mt-3">Verifying your email, please wait...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="alert alert-success" role="alert">
          <h5 className="alert-heading">Email Verified!</h5>
          <p>Your email has been successfully verified. You can now log in.</p>
          <hr />
          <button
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="alert alert-danger" role="alert">
          <h5 className="alert-heading">Verification Failed</h5>
          <p>{errorMessage}</p>
          <hr />
          <button
            className="btn btn-warning me-2"
            onClick={() => setShowResendModal(true)}
          >
            Resend Verification Email
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      )}

      {showResendModal && (
        <ResendVerificationModal onClose={() => setShowResendModal(false)} />
      )}
    </div>
  );
}

export default VerificationPage;
