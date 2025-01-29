import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function NewAccountPage() {
    // Obtener la sesión del usuario
    const session = await auth.api.getSession({
        headers: headers(),
    });

    // Redirigir si no hay sesión
    if (!session) {
        return redirect('/');
    }

    const user = session.user;

    // Función para manejar el envío del formulario
    async function handleCreateAccount(formData: FormData) {
        "use server"; // Indicar que esta función se ejecuta en el servidor

        const accountName = formData.get("accountName") as string;
        const accountDescription = formData.get("accountDescription") as string;

        // Validar que el campo no esté vacío
        if (!accountName.trim()) {
            alert("El nombre de la cuenta no puede estar vacío.");
            return;
        }

        // Crear el objeto JSON
        const newAccount = {
            accountName: accountName.trim(),
            description: accountDescription.trim(),
            holders: [{
                id: user.id, // ID del usuario
                name: user.name, // Nombre del usuario
            },], // Array con el ID del usuario
            actions: [], // Array vacío
        };
        try {
            const response = await fetch('https://2jn4t45vda.execute-api.sa-east-1.amazonaws.com/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAccount),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { error: errorData.message || "Error al crear la cuenta" };
            }

            return { success: "Cuenta creada exitosamente" };
        } catch (error) {
            console.error('Error:', error);
            return { error: "Hubo un error al intentar crear la cuenta" };
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Crear Nueva Cuenta</h1>

                {/* Mostrar información del usuario */}
                <div className="mb-6">
                    <p className="text-gray-700"><strong>Nombre:</strong> {user.name}</p>
                    <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
                </div>

                {/* Formulario para crear la cuenta */}
                <form action={handleCreateAccount}>
                    <div className="mb-4">
                        <label htmlFor="accountName" className="block text-gray-700 font-medium mb-2">
                            Nombre de la Cuenta
                        </label>
                        <input
                            type="text"
                            id="accountName"
                            name="accountName"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingresa el nombre de la cuenta"
                            required
                        />
                        <label htmlFor="accountDescription" className="block text-gray-700 font-medium mb-2">
                            Descripción
                        </label>
                        <input
                            type="text"
                            id="accountDescription"
                            name="accountDescription"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingresa una descripción"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Crear Cuenta
                    </button>
                </form>
            </div>
        </div>
    );
}