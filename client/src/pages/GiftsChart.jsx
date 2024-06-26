import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const GiftsChart = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
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

                setChartData({
                    labels: labels,
                    datasets: [{
                        label: 'Total Quantity Ordered',
                        data: quantities,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                });
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Gifts Order Quantity</h2>
            <Bar
                data={chartData}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }}
            />
        </div>
    );
};

export default GiftsChart;
