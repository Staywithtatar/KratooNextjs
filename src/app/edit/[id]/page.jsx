// app/edit/[id]/page.jsx
import { Suspense } from 'react'
import EditForm from '@/app/components/EditForm'
import { use } from 'react'

export default function Page({ params }) {
  const id = use(Promise.resolve(params.id))
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditForm postId={id} />
    </Suspense>
  )
}