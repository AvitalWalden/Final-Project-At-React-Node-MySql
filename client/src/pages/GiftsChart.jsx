import React, { useEffect, useState, useContext } from 'react';
import '../css/GiftsChart.css';
import { Bar } from 'react-chartjs-2';
import { UserContext } from './UserContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GiftsChart = () => {
    const { user } = useContext(UserContext);
    const [chartData, setChartData] = useState({});
    const [fundraiserChartData, setFundraiserChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFundraiserChart, setShowFundraiserChart] = useState(false);

    const fetchGiftsData = async () => {
        try {
            const response = await fetch('http://localhost:3000/gifts/allGiftsOrderQuantity', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            if (data.length === 0) {
                throw new Error('Empty data received');
            }

            const labels = data.map(item => item.gift_name);
            const quantities = data.map(item => item.total_quantity_ordered);

            const backgroundColors = [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ];
            const borderColors = [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(201, 203, 207, 1)'
            ];

            const barsCount = quantities.length;
            while (backgroundColors.length < barsCount) {
                backgroundColors.push(...backgroundColors);
                borderColors.push(...borderColors);
            }

            setChartData({
                labels: labels,
                datasets: [{
                    label: 'Total Quantity Ordered',
                    data: quantities,
                    backgroundColor: backgroundColors.slice(0, barsCount),
                    borderColor: borderColors.slice(0, barsCount),
                    borderWidth: 1
                }]
            });
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchFundraiserData = async () => {
        try {
            const response = await fetch('http://localhost:3000/fundraisers/fundraiserChartData', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            if (data.length === 0) {
                throw new Error('Empty data received');
            }

            const labels = data.map(item => item.fundraiser_name);
            const peopleFundraised = data.map(item => item.people_fundraised);
            const amountRaised = data.map(item => item.debt); // הוספת סכום ההתרמה

            setFundraiserChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Total Funds Raised',
                        data: peopleFundraised,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'amount raised',
                        data: amountRaised,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        yAxisID: 'y1'
                    }
                ]
            });
        } catch (err) {
            setError(err.message);
        }
    };
    useEffect(() => {
        if (user) {

            fetchGiftsData();
            fetchFundraiserData();
        }
    }, [user]);

    const toggleChart = () => {
        setShowFundraiserChart(!showFundraiserChart);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='canvas'>
            {user.role != 'admin' && (
                <br />)}
            {user.role === 'admin' && (
                <div className='button-container'>
                    <button className='btn btn-primary' onClick={toggleChart}>
                        {showFundraiserChart ? 'Show Gifts Chart' : 'Show Fundraiser Chart'}
                    </button>
                </div>
            )}
            {showFundraiserChart ? (
                <Bar
                    data={fundraiserChartData}
                    options={{
                        responsive: true,
                        scales: {
                            y: {
                                type: 'linear',
                                display: true,
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Total Funds Raised'
                                }
                            },
                            y1: {
                                type: 'linear',
                                display: true,
                                position: 'right',
                                title: {
                                    display: true,
                                    text: 'amount raised'
                                },
                                grid: {
                                    drawOnChartArea: false
                                }
                            }
                        }
                    }}
                />
            ) : (
                <Bar
                    data={chartData}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }}
                />)}


        </div>
    );
};

export default GiftsChart;
