import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { api } from './services/api';
import { format } from 'date-fns';

type User = {
  country: string;
  description: string;
  id: number;
  joining_date: string;
  name: string;
  picture: string;
};

const Home: NextPage = () => {
  const { data, isValidating, error } = useSWR<User[]>('/users', url =>
    api.get(url).then(r => r.data)
  );

  if (isValidating) return <div>Loading...</div>;

  if (error) return <div>Error...</div>;

  return (
    <div className='container'>
      {data &&
        data.map(user => {
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
        })}
    </div>
  );
};

export default Home;
