'use client'

import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client"
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/16/solid'

export default function LogoutBtn() {
    const supabase = createClient();
    const router = useRouter();

    async function handleLogout() {
        await supabase.auth.signOut();
        router.replace('/login');
    }

    return (
        <div className="form-control mt-6">
            <button className="btn btn-primary" onClick={handleLogout}>
                <ArrowLeftStartOnRectangleIcon className="size-4" />
                Logout
            </button>
        </div>
    )
}
