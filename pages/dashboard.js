import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('/api/health')
      .then((res) => setHealth(res.data))
      .catch((err) => setError(err.toString()));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p>Error: {error}</p>}
      {health ? (
        <pre>{JSON.stringify(health, null, 2)}</pre>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
}
