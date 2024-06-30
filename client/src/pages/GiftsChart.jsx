import React, { useEffect, useState ,useContext} from 'react';
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
            console.log("ghgh",response)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
    
            if (data.length === 0) {
                throw new Error('Empty data received');
            }
    
            const labels = data.map(item => item.fundraiser_name);
            const quantities = data.map(item => item.people_fundraised);
    
            const backgroundColors = [
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ];
            const borderColors = [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(201, 203, 207, 1)'
            ];
    
            const barsCount = quantities.length;
            while (backgroundColors.length < barsCount) {
                backgroundColors.push(...backgroundColors);
                borderColors.push(...borderColors);
            }
    
            setFundraiserChartData({
                labels: labels,
                datasets: [{
                    label: 'Total Funds Raised',
                    data: quantities,
                    backgroundColor: backgroundColors.slice(0, barsCount),
                    borderColor: borderColors.slice(0, barsCount),
                    borderWidth: 1
                }]
            });
        } catch (err) {
            setError(err.message);
        }
    };
    

    useEffect(() => {
        fetchGiftsData();
        fetchFundraiserData();
    }, []);

    const toggleChart = () => {
        setShowFundraiserChart(!showFundraiserChart);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='canvas'>
            <h2>Gifts Order Quantity</h2>
            {user.role=='admin'&&<button onClick={toggleChart}>
                {showFundraiserChart ? 'Show Gifts Chart' : 'Show Fundraiser Chart'}
            </button>}
            {showFundraiserChart ? (
                <Bar
                    data={fundraiserChartData}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true
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
                />
            )}
        </div>
    );
};

export default GiftsChart;
