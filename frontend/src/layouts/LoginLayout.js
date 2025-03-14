import React from 'react'
import { Outlet } from 'react-router-dom'

const LoginLayout = () => {
  return (
    <div>
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    </div>
  )
}

export default LoginLayout