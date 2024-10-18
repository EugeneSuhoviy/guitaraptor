'use client';
import { useFormStatus } from 'react-dom'

export default function LoadingBtn({ name, loadingPlaceholder, className }: { name: string, loadingPlaceholder: string, className?: string }) {
    const { pending } = useFormStatus()

    return <button type="submit" className={className} disabled={pending}>
        {pending ?
            <><span className="loading loading-spinner"></span><span>{loadingPlaceholder}...</span></> :
            <span>{name}</span>
        }
    </button>
}