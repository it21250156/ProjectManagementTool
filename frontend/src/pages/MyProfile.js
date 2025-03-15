import React from 'react'
import Header from '../components/Header'
import UserInfo from '../components/UserInfo'

const MyProfile = () => {
    return (
        <div>
            <Header />
            <div className='m-4'>
                <h1>My Profile</h1>
                <p>Welcome, John Doe!</p>
                <UserInfo />
            </div>

        </div>
    )
}

export default MyProfile