'use client'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import ThemeToggle from "@/app/components/ui/theme-toggle";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();

    let isEditPage = false;

    if (pathname.includes('login')) return

    if (pathname.includes('edit') || pathname.includes('create')) {
        isEditPage = true
    }

    return <>
        <div className="p-5 flex items-center max-w-3xl mx-auto">
            <div>
                {isEditPage ? <label className="btn btn-circle"><ChevronLeftIcon className="size-8" onClick={() => { router.back() }} /></label> : <label className="btn btn-circle swap swap-rotate">
                    {/* this hidden checkbox controls the state */}
                    <input type="checkbox" />
                    <svg
                        className="swap-off fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 512 512">
                        <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                    </svg>
                    <svg
                        className="swap-on fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 512 512">
                        <polygon
                            points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                    </svg>
                </label>}
            </div>
            <Link href={'/'} className="mx-auto"><h1 className="mx-auto font-bold text-3xl">GUITARAPTOR</h1></Link>
            <div>
                <ThemeToggle />
            </div>
        </div>

    </>
}