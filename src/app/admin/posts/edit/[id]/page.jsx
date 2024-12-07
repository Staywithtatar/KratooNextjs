// app/admin/posts/edit/[id]/page.jsx
import { Suspense } from 'react'
import EditComponent from './EditComponent'

export default function Page({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditComponent postId={params.id} />
    </Suspense>
  )
}