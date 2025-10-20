'use client'
import Admin from '@/components/admin/Admin'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
          <div>
        <Admin />
    </div>
    </Suspense>

  )
}

export default page