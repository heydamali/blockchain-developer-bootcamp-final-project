// import { useEffect } from 'react';
import useBetting from '../../hooks/useBetting';

const CreateAccountPrompt = () => {
  const { signInUser } = useBetting();

  const onSubmit = (e) => {
    e.preventDefault();
    signInUser();
  };

  // useEffect(() => {
  //   fetchSignInStatus();
  // }, []);

  return (
    <section className="pt-20 flex flex-col items-center">
      <h2 className="text-center">New MetaMask account address? Create an account in one click!</h2>
      <div className="px-5">
        <form
          onSubmit={onSubmit}
          className="w-1/2 px-8 pt-6 my-0 mx-auto mb-4 flex flex-col items-center">
          <button
            className="bg-transparent hover:bg-gray-500 text-black hover:text-white py-2 px-3 border border-black hover:border-transparent rounded w-max"
            type="submit">
            Create Account
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateAccountPrompt;
