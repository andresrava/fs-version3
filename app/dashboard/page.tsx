import { auth } from "@/lib/auth"
import { redirect } from "next/dist/server/api-utils";
import { headers } from "next/headers"
import Link from "next/link";
import UserAccounts from "./userAccounts";

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
            <Link href="/newAccount">
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                    Create a new Account
                </button>
            </Link>
            <UserAccounts email={user.email} />
        </div>
    )

}