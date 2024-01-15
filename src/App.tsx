import { ChangeEvent, useState } from "react";
import "./App.css";

function App() {
  const [simulationCount, setCount] = useState(2);
  const [delayTime, setDelayTime] = useState(1);
  const [temp, setTemp] = useState(0);
  const [requestStatus, setRequestStatus] = useState<string>();
  const [requestError, setRequestError] = useState();
  const [loading, setLoading] = useState(false);

  console.log("requestStatus", requestStatus);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const { name, value } = event.target;
    if (name === "simCount") {
      setCount(Number(value));
    } else if (name === "delayTime") {
      setDelayTime(Number(value));
    }
  }

  function garbageCollection() {
    setRequestStatus(undefined);
    setRequestError(undefined);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    garbageCollection();

    let count = 0;
    setLoading(true);
    const intervalId = setInterval(() => {
      count++;
      setTemp(temp + 1);
      fetch(`http://localhost:4000/api/v1/custom/emails`, {
        headers: {
          "x-api-key": "0852b9b3-ee95774f",
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            const body = await response.json();
            throw new Error(body?.message);
          }

          if (count === simulationCount) {
            clearInterval(intervalId);
            setLoading(false);
            setRequestStatus(undefined);
          }

          setRequestStatus(`Request ${count} completed`);
          // handle your response here
        })
        .catch((error) => {
          setLoading(false);
          console.error(`Fetch failed: ${error}`);
          setRequestError(error.message);
          clearInterval(intervalId);
        });
    }, 500 * delayTime);
  }

  return (
    <div className="h-full w-full flex align-center py-40 flex-col">
      <form onSubmit={handleSubmit} className="flex gap-2 justify-center mb-4">
        <div className="flex-col flex text-left gap-1 max-w-[25rem]">
          <label htmlFor="simCount" className=" text-slate-500">Simulation Count</label>
          <input
            type="number"
            name="simCount"
            defaultValue={simulationCount}
            onChange={handleChange}
            placeholder="Enter simulation count"
            className="px-2 border-2"
          />
           <span className=" text-slate-500">This determines how many requests to send per given time  ( the default time  is 500 milliseconds</span>
        </div>
        <div className="flex flex-col text-left gap-1 max-w-[25rem]">
          <label className=" text-slate-500" htmlFor="delayTime">Delay Time</label>
          <input
            type="number"
            name="delayTime"
            defaultValue={delayTime}
            onChange={handleChange}
            className="px-2 border-2"
          />
           <span className=" text-slate-500">This determines the rate at which you send requests ( ideal to test monthly and system wide rate limiting. use 2 or greater to test monthly</span>
        </div>
        <button type="submit" className=" bg-[#2961BC] text-white px-2 mt-[25px] py-1 self-start ">
          Simulate
        </button>
      </form>
      <div>
        <div>{requestStatus}</div>
        <p className=" text-red-500">
          {requestError && <div>{requestError}</div>}
        </p>
        {loading && <div>Loading...</div>}
      </div>

      <div className="text-left p-4 border bg-slate-200 mt-10">
        <p className=" text-blue-700 font-bold">Info -  Default: </p>
         
        <div >
          <code>
            timewindow: 10 seconds, max: 4 requests per client
            <br />
            monthly: 30 days, max 6 requests per client
            <br />
            system: 10 requests 
            <br />
          </code>
           <p className=" border-t mt-4"> You can change this in the backend inside the config.ts apiKeys.js and tokens.js files.
           <br />
            Tips💡: you can delete the entry in redis to try many times <code>DEL 0852b9b3-ee95774f</code></p>
        </div>
      </div>
    </div>
  );
}

export default App;
