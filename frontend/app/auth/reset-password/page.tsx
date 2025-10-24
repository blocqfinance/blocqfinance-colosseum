'use client'
import ResetPassword from '@/components/reset-password/ResetPassword'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
          <div><ResetPassword /></div>
    </Suspense>

  )
}

export default page