import { useState } from 'react';
import useBetting from '../../hooks/useBetting';

const AddGame = () => {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const { addGame } = useBetting();

  const onSubmit = async (e) => {
    e.preventDefault();
    await addGame(teamA, teamB, startTime, endTime);
  };

  return (
    <section className="pt-20 flex flex-col items-center">
      <h2 className="pb-5">New Game</h2>
      <div className="border-2 rounded border-gray-400 pt-3 w-3/4 flex flex-col">
        <div className="px-5">
          <form
            onSubmit={onSubmit}
            className="w-1/2 px-8 pt-6 my-0 mx-auto mb-4 flex flex-col items-center">
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white mb-2"
              id="teamA"
              type="text"
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
              placeholder="Team A"
            />
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white mb-2"
              id="teamB"
              type="text"
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              placeholder="Team B"
            />
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white mb-2"
              id="teamB"
              type="date"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="Team B"
            />
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white mb-2"
              id="teamB"
              type="date"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="Team B"
            />
            <button
              className="bg-transparent hover:bg-gray-500 text-black hover:text-white py-2 px-3 border border-black hover:border-transparent rounded w-1/2"
              type="submit">
              Add Game
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddGame;
