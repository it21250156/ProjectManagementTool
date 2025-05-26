import React, { useEffect, useRef } from 'react';
import GlobalLeaderboard from '../components/GlobalLeaderboard';
import Header from '../components/Header';
import '../assets/css/leaderboard.css';

const Leaderboard = () => {
    const imageRef = useRef(null);

    useEffect(() => {
        const imageElement = imageRef.current;

        imageElement.classList.add('floating-image');

        return () => {
            imageElement.classList.remove('floating-image');
        };
    }, []);

    return (
        <div className='relative min-h-screen'>
                        <GlobalLeaderboard />
            
            <img
                ref={imageRef}
                src='https://gallery.yopriceville.com/var/resizes/Free-Clipart-Pictures/Trophy-and-Medals-PNG/Trophy_PNG_Clip_Art_Image.png?m=1629833576'
                alt='Floating Image'
                className='absolute right-20 bottom-96 h-1/3 w-auto z-20 floating-image'
                style={{ transform: 'rotate(15deg)' }}
            />

            {/* <div className='relative z-10'>
                <div className='m-4'>
                    <div className='mx-0 my-2 p-8 rounded-2xl bg-gradient-to-t from-[#f5a623] to-[#fac56f]'>
                        <h1 className='text-white text-4xl font-extrabold italic'>Global Leaderboard</h1>
                    </div>
                    <div className='mx-auto w-2/3'>
                        <GlobalLeaderboard />
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default Leaderboard;