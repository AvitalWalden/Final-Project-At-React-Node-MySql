import React from 'react';
import { IoMdAdd } from "react-icons/io";

function Lottery({ gift }) {
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function updateWinner(gift_id, id) {
        const url = `http://localhost:3000/gifts/${id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gift_id: gift_id,
                winner_id: id
            })
        };
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
               console.log(data);
            })
            .catch(error => {
                console.log('Error');
            });
    }


    const getOrder = (gift_id) => {
        const url = `http://localhost:3000/orders/gift_id/${gift_id}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.length > 0) {
                    const usersEntered = [];
                    data.forEach(order => {
                        for (let i = 0; i < order.quantity; i++) {
                            usersEntered.push(order.user_id);
                        }
                    });
                    shuffle(usersEntered); // ערבב את המערך
                    const winnerIndex = Math.floor(Math.random() * usersEntered.length);
                    const winnerUserID = usersEntered[winnerIndex];
                    updateWinner(gift_id, winnerUserID);
                    console.log(`The winner is user_id: ${winnerUserID}`);
                } else {
                    console.log('No orders found for this gift.');
                    alert('No orders found for this gift.');
                }
            }).catch(error => {
                console.log(error);
                alert('An error occurred while fetching orders.');
            });
    };

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
