import React, { useEffect, useState, useContext } from 'react';
import '../css/Gift.css';
import { UserContext } from './UserContext';
import Lottery from '../components/Lottery';
import '../css/Lottery.css'

function Lotteries() {
    const [gifts, setGifts] = useState([]);


    useEffect(() => {
        const url = `http://localhost:3000/gifts`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setGifts(data);
            })
    }, []);
    return (
        <>
            <div className="gift-lottery-container">
                {gifts != null &&
                    gifts.map((gift, index) => (
                        <Lottery key={index} gift={gift} gifts={gifts} />
                    ))}
            </div>
        </>
    )
}

export default Lotteries
