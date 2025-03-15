import React from 'react'
import Header from '../components/Header'
import UserInfo from '../components/UserInfo'

const MyProfile = () => {
    return (
        <div>
            <Header />
            <div className='m-4'>

                <UserInfo />
            </div>

        </div>
    )
}

export default MyProfile