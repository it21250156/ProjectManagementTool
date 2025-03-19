import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
      <div className='bg-[#4a90e2] h-16'>
        <h1>PM Tool</h1>
        <div>
          <Link to={'/deadline-prediction'}>
            <button>
              Predictions
            </button>
          </Link>

        </div>
      </div>
    </>
  )
}

export default Header