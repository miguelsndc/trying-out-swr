import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { api } from '../services/api';
import { format } from 'date-fns';

type User = {
  country: string;
  description: string;
  id: number;
  joining_date: string;
  name: string;
  picture: string;
};

const getKey = (pageIndex: number, previousPageData: User[]) => {
  console.log(pageIndex);

  if (previousPageData && !previousPageData.length) return null;
  return `/users?_page=${pageIndex}&_limit=10`;
};

const Home: NextPage = () => {
  const { data, size, setSize } = useSWRInfinite<User[]>(getKey, url =>
    api.get(url).then(r => r.data)
  );

  if (!data) return <div>Loading....</div>;

  return (
    <div className='container'>
      {(data || []).map((users, index) => {
        return users.map(user => {
          return (
            <div key={user.id} className='user'>
              <div>
                <Image
                  src={user.picture}
                  width={50}
                  height={50}
                  alt={user.name}
                />
                <div>
                  <h1>
                    {user.name} | {user.country}
                  </h1>
                  <span>
                    {format(new Date(user.joining_date), 'dd MMM yyyy')}
                  </span>
                </div>
              </div>
              <p>{user.description}</p>
              <Link href={`/users/${user.id}`}>see more</Link>
            </div>
          );
        });
      })}
      <button onClick={() => setSize(size + 1)}>load more</button>
    </div>
  );
};

export default Home;
