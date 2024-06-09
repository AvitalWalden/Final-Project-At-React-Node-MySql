import React from 'react';
import { IoMdAdd } from "react-icons/io";

function Lottery({ gift }) {

    const getOrder = (gift_id) => {
        const url = `http://localhost:3000/orders/gift/${gift_id}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.length > 0) {
                    const winner = data[Math.floor(Math.random() * data.length)];
                    console.log(`The winner is user_id: ${winner.user_id}`);
                    alert(`The winner is user_id: ${winner.user_id}`);
                } else {
                    console.log('No orders found for this gift.');
                    alert('No orders found for this gift.');
                }
            }).catch(error => {
                console.log(error);
                alert('An error occurred while fetching orders.');
            });
    }

    const handleLottery = (gift_id) => {
        getOrder(gift_id);
    };

    return (
        <div className="gift-card">
            <img src={`/images/${gift.image_url}`} alt={gift.name} />
            <h1>{gift.name}</h1>
            <h1>{gift.price}</h1>
            <button className="btnLottery" onClick={() => handleLottery(gift.gift_id)}>Lottery</button>
        </div>
    );
}

export default Lottery;
