const ErrorState = ({ message }) => {
  return <div className="state error">{message || 'Something went wrong'}</div>;
};

export default ErrorState;
