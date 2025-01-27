import { auth } from "@/lib/auth"
import { redirect } from "next/dist/server/api-utils";
import { headers } from "next/headers"

export default async function DashboardPage() {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session) {
        return redirect('/')
    }
    
    
    const user = session?.user;
    return (
        <div className="mt-10 text-center">
            <h1 className="text-2xl font-bold underline">Welcome to Dashboard</h1>
            <ul>
                <li>Name: {user.name}</li>
                <li>Email: {user.email}</li>
            </ul>
        </div>
    )

}