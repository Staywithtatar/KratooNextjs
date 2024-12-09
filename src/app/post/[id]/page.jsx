import { Suspense } from 'react'
import PostDetail from './PostDetail'

export default function Page({ params }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PostDetail postId={params.id} />
        </Suspense>
    )
}