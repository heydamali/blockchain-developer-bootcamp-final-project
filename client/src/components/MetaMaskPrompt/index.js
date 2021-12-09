const MetaMaskPrompt = ({ active, MMDetected }) => {
  return (
    <h2 className="text-center">
      {!MMDetected
        ? 'MetaMask wallet not detected.'
        : !active
        ? 'Oops, connect MetaMask wallet.'
        : ''}
    </h2>
  );
};

export default MetaMaskPrompt;
