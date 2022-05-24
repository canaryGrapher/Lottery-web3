import React, { useState, useEffect } from "react";
import web3 from "./web3";
import lottery from "./lottery";

const App = () => {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [value, setValue] = useState("");
  const [prizePool, setPrizePool] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const manager = await lottery.methods.manager().call()
      setManager(manager);
      const players = await lottery.methods.getPlayers().call();
      setPlayers(players);
      const balance = await web3.eth.getBalance(lottery.options.address);
      setBalance(balance);
      const prizePool = await web3.utils.fromWei(balance, "ether");
      setPrizePool(prizePool);
    }
    fetchData();
  }, [])

  const onEnterLottery = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage("Waiting on transaction success...");
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });

    setMessage("You have been entered!");
  };

  const selectWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage("A winner has been picked!");
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}.
        There are currently {players.length} people entered, competing to win {prizePool} ether!

      </p>

      <hr />
      <h4>Want to try your luck?</h4>
      <div>
        <div>
          <label>Amount of ether to enter</label>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <button onClick={onEnterLottery}>Enter</button>
      </div>

      <hr />

      <h4>Ready to pick a winner?</h4>
      <button onClick={selectWinner}>Pick a winner!</button>

      <hr />

      <h1>{message}</h1>
    </div>
  );
}

export default App;
