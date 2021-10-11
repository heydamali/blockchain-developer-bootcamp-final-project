import React from 'react'
import {Link} from "react-router-dom"

const HistoryList = () => {
  return (
    <section className="pt-10">
      <p className="text-right text-blue-500 hover:text-blue-600 mb-5"><Link to="/">Home</Link></p>
      <table className="table-fixed w-full ">
        <thead className="">
          <tr>
            <th className="w-1/2 text-left">Games</th>
            <th className="text-right" >Date</th>
            <th className="text-right" >Time</th>
            <th className="text-right">Position</th>
          </tr>
        </thead>
        <tbody>
            <tr className="">
            <td className="pt-3">
              <Link to="/games/1">Manchester-United VS Arsenal</Link>
            </td>
              <td className="text-right">12/10/2021</td>
              <td className="text-right">12AM</td>
              <td className="text-right">Won</td>
          </tr>
          <tr className="">
            <td className="pt-3">
              <Link to="/games/1">Manchester-United VS Arsenal</Link>
            </td>
              <td className="text-right">12/10/2021</td>
              <td className="text-right">12AM</td>
              <td className="text-right">Lost</td>
          </tr>
          <tr className="">
            <td className="pt-3">
              <Link to="/games/1">Manchester-United VS Arsenal</Link>
            </td>
              <td className="text-right">12/10/2021</td>
              <td className="text-right">12AM</td>
              <td className="text-right">Won</td>
          </tr>
          <tr className="">
            <td className="pt-3">
              <Link to="/games/1">Manchester-United VS Arsenal</Link>
            </td>
              <td className="text-right">12/10/2021</td>
              <td className="text-right">12AM</td>
              <td className="text-right">Won</td>
          </tr>
          <tr className="">
            <td className="pt-3">
              <Link to="/games/1">Manchester-United VS Arsenal</Link>
            </td>
              <td className="text-right">12/10/2021</td>
              <td className="text-right">12AM</td>
              <td className="text-right">Lost</td>
          </tr>
          <tr className="">
            <td className="pt-3">
              <Link to="/games/1">Manchester-United VS Arsenal</Link>
            </td>
              <td className="text-right">12/10/2021</td>
              <td className="text-right">12AM</td>
              <td className="text-right">Won</td>
          </tr>
          <tr className="">
            <td className="pt-3">
              <Link to="/games/1">Manchester-United VS Arsenal</Link>
            </td>
              <td className="text-right">12/10/2021</td>
              <td className="text-right">12AM</td>
              <td className="text-right">Won</td>
          </tr>
          <tr className="">
            <td className="pt-3">
              <Link to="/games/1">Manchester-United VS Arsenal</Link>
            </td>
              <td className="text-right">12/10/2021</td>
              <td className="text-right">12AM</td>
              <td className="text-right">Lost</td>
          </tr>
          <tr className="">
            <td className="pt-3">
              <Link to="/games/1">Manchester-United VS Arsenal</Link>
            </td>
              <td className="text-right">12/10/2021</td>
              <td className="text-right">12AM</td>
              <td className="text-right">Won</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export default HistoryList;
