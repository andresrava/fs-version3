'use client'
import React, { useEffect, useState } from 'react';

interface UserAccountsProps {
  email: string;
}

// interface Account {
//   id: number;
//   name: string;
//   // Puedes agregar más propiedades según la estructura de tu API
// }

const UserAccounts: React.FC<UserAccountsProps> = ({ email }) => {
  // const [accounts, setAccounts] = useState<Account[]>([]);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`https://2jn4t45vda.execute-api.sa-east-1.amazonaws.com/users?email=${email}`);
        if (!response.ok) {
          throw new Error('Error al obtener las cuentas');
        }
        const data = await response.json();
        setAccounts(data[0].accounts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [email]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Cuentas de {email}</h2>
      <ul>
        {accounts.map((account, index) => (
          <li key={index}>{account}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserAccounts;