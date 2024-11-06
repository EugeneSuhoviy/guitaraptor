'use client'

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/16/solid'

const LogoutBtn: React.FC<{ classes: string }> = ({ classes }) => {
    const supabase = createClient();
    const router = useRouter();

    async function handleLogout() {
        await supabase.auth.signOut();
        router.replace('/login');
    }

    return (
        <div className={`form-control mt-6 ${classes}`}>
            <button className="btn btn-primary" onClick={handleLogout}>
                <ArrowLeftStartOnRectangleIcon className="size-4" />
                Logout
            </button>
        </div>
    )
}

export default LogoutBtn;