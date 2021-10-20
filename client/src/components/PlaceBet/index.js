import React from 'react'

const Game = () => {
  return (
    <section className="pt-20 flex flex-col items-center">
      <h2 className="pb-5">Manchester United vs Arsenal</h2>
      <div className="border-2 rounded border-gray-400 pt-3 w-3/4 flex flex-col">
        <p className="m-0 text-center">Choose Team</p>
        <div className="px-5">
          <form className="w-1/2 px-8 pt-6 my-0 mx-auto mb-4 flex flex-col items-center">
        <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-2" id="grid-state">
                <option>Select team</option>
                <option>Manchester United</option>
                <option>Arsenal</option>
              </select>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white mb-2" id="amount" type="number" placeholder="Ethereum amount" />
            <button className="bg-transparent hover:bg-gray-500 text-black hover:text-white py-2 px-3 border border-black hover:border-transparent rounded w-1/2" type="button">
              Stake
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Game;
