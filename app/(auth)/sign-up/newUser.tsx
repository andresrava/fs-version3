interface User {
    name: string;
    email: string;
}

export default async function postUser(user: User): Promise<void> {
    const url = 'https://2jn4t45vda.execute-api.sa-east-1.amazonaws.com/users'; // Reemplaza con la URL de tu API

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
}