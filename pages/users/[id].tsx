import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { mutate as mutateGlobal } from 'swr/';
import Image from 'next/image';
import useSWR from 'swr';
import { api } from '../../services/api';
import { FormEvent, useState } from 'react';

type User = {
  country: string;
  description: string;
  id: number;
  joining_date: string;
  name: string;
  picture: string;
};

type Props = {
  initialUser: User;
};

const UserDetails = ({ initialUser }: Props) => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: user,
    mutate,
    error,
  } = useSWR<User>(`/users/${id}`, url => api.get(url).then(r => r.data), {
    fallbackData: initialUser,
  });

  const [name, setName] = useState('');

  const handleNameChange = (id: number, name: string) => {
    api.patch(`/users/${id}`, {
      name,
    });

    mutateGlobal(`/users/${id}`, { ...user!, name });
    mutate({ ...user!, name }, false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    handleNameChange(Number(id), name);
  };

  if (error) return <div>Error...</div>;

  return (
    <>
      {user && (
        <div className='user-detail'>
          <div>
            <Image
              src={user.picture}
              width={180}
              height={180}
              alt={user.name}
            />
            <div>
              <h1>
                {user.name} | {user.country}
              </h1>
              <span>
                Joined at: {format(new Date(user.joining_date), 'dd MMM yyyy')}
              </span>
            </div>
          </div>
          <p>{user.description}</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor='new-name'>new name:</label>
            <input
              type='text'
              id='new-name'
              onChange={e => setName(e.target.value)}
              value={name}
            />
            <button type='submit'>submit</button>
          </form>
          <button onClick={() => router.back()}>go back</button>
        </div>
      )}
    </>
  );
};

export default UserDetails;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { id } = ctx.query;

  const { data } = await api.get(`/users/${id}`);

  return {
    props: {
      initialUser: data,
    },
  };
};
