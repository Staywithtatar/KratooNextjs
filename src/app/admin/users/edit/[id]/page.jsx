import { Suspense } from 'react'
import EditUserForm from './EditUserForm'

export default function Page({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditUserForm userId={params.id} />
    </Suspense>
  )
}