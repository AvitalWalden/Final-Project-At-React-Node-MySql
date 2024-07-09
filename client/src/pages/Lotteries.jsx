import React, { useEffect, useState } from 'react';
import '../css/Gift.css';
import Lottery from '../components/Lottery';
import '../css/Lottery.css'

function Lotteries() {
    const [gifts, setGifts] = useState([]);
    
    useEffect(() => {
        fetch(`http://localhost:3000/gifts`, {
            method: "GET",
            credentials: "include"
        })
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
