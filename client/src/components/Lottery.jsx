import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../pages/UserContext';
import '../css/Lottery.css';

function Lottery({ gift }) {
    const [winner, setWinner] = useState(gift.winner_id);
    const [spinning, setSpinning] = useState(false);
    const { refreshAccessToken } = useContext(UserContext);

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const updateWinner = (gift_id, id) => {
        const url = `http://localhost:3000/gifts/${gift_id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({
                gift_id: gift_id,
                name: gift.name,
                price: gift.price,
                image_url: gift.image_url,
                winner_id: id
            })
        };
        fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        console.log('Refreshing token and retrying...');
                        refreshAccessToken();
                        return updateWinner(); // Retry fetch after token refresh
                    }

                    if (response.status === 403) {
                        console.log('invalid token you cannot do it...');
                        throw response.error;
                    }
                }
            })
            .then(data => {
                setWinner(id);
                setSpinning(true);
                setTimeout(() => {
                    setSpinning(false);
                }, 4000);
            })
            .catch(error => {
                console.error('Error updating winner:', error);
                alert(`Error updating winner: ${error.message}. Please try again later.`);
            });
    };

    const getOrder = (gift_id) => {
        fetch(`http://localhost:3000/orders/gift_id/${gift_id}`, {
            method: "GET",
            credentials: "include"
        })
            .then(async response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        console.log('Refreshing token and retrying...');
                        refreshAccessToken();
                        return getOrder(); // Retry fetch after token refresh
                    }

                    if (response.status === 403) {
                        console.log('invalid token you cannot do it...');
                        throw response.error;
                    }
                    const data = await response.json();
                    if (data.length > 0) {
                        const usersEntered = [];
                        data.forEach(order => {
                            for (let i = 0; i < order.quantity; i++) {
                                usersEntered.push(order.user_id);
                            }
                        });
                        shuffle(usersEntered);
                        const winnerIndex = Math.floor(Math.random() * usersEntered.length);
                        const winnerUserID = usersEntered[winnerIndex];
                        updateWinner(gift_id, winnerUserID);
                        console.log(`The winner is user_id: ${winnerUserID}`);
                    } else {
                        console.log('No orders found for this gift.');
                        alert('No orders found for this gift.');
                    }
                }
            })
            // .then(data => {
            // })
            .catch(error => {
                console.error('Error fetching orders:', error);
                alert(`An error occurred while fetching orders: ${error.message}`);
            });
    };

    const handleLottery = (gift_id) => {
        getOrder(gift_id);
    };

    return (
        <div className={`gift-lottery-card ${winner && !spinning ? 'winner' : spinning ? 'spinning' : ''}`}>
            {winner && !spinning ? (
                <>
                    <img src={`http://localhost:3000/images/${gift.image_url}`} alt={gift.name} />
                    <h1 className="winner-text">{gift.name}</h1>
                    <h1 className="winner-text">The gift was already grilled...check result in here👇</h1>
                    <Link to="/winners" className="winner-link">Winners</Link>
                </>
            ) : spinning ? (
                <div className="spinning-wheel">
                    <div className="wheel"></div>
                </div>
            ) : (
                <>
                    <img src={`http://localhost:3000/images/${gift.image_url}`} alt={gift.name} />
                    <h1>{gift.name}</h1>
                    <h1>{gift.price}</h1>
                    <button className="btnLottery" onClick={() => handleLottery(gift.gift_id)}>Lottery</button>
                </>
            )}
        </div>
    );
}

export default Lottery;
