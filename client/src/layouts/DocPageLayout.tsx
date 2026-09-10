
import HeaderDocPage from '#components/docpage/HeaderDoc'
import React from 'react'
import { Outlet } from 'react-router'

function DocPageLayout() {
  return (
    <>

    <main><Outlet/></main>
    </>
  )
}

export default DocPageLayout