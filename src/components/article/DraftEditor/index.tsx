'use client'

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function DraftEditor({ id, baseUrl, children }: { id: string, baseUrl: string, children: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isFetching, setIsFetching] = useState(false);
    const [content, setContent] = useState('');

    const isMutating = isFetching || isPending;

    async function uploadContent() {
        setIsFetching(true);
        await fetch(`${baseUrl}/api/admin/draft`, {
            method: 'PUT',
            body: JSON.stringify({ key: id, content: content }),
        });
        setIsFetching(false);

        startTransition(() => {
            router.refresh();
        });
    }

    return (
        <div>
            <h1>{id}</h1>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={uploadContent} disabled={isMutating}>update</button>
            {children}
        </div>
    )
}