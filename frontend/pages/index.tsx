// frontend/pages/index.tsx
import { useEffect, useState } from 'react';

const mockUser = {
  name: 'Captain Marvel',
  role: 'manager',
  country: 'India'
};

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/restaurants', {
      headers: { 'x-user': JSON.stringify(mockUser) }
    })
      .then(res => res.json())
      .then(data => setRestaurants(data));
  }, []);

  return (
    <div>
      <h1>Restaurants ({mockUser.country})</h1>
      <ul>
        {restaurants.map((r: any) => <li key={r.id}>{r.name}</li>)}
      </ul>
    </div>
  );
}
