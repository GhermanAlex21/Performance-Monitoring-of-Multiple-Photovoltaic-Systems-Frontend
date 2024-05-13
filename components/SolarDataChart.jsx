import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { Select, Button } from 'antd'; // Assuming Ant Design is used for the Select and Button components

const SolarDataChart = () => {
    const [data, setData] = useState({ labels: [], datasets: [] });
    const [selectedData, setSelectedData] = useState('daily');
    const [pesId, setPesId] = useState(null);
    const [pesOptions, setPesOptions] = useState([
        { label: 'PES ID 0', value: 0 },
        { label: 'PES ID 10', value: 10 },
        // Add other PES IDs here
    ]);
    const [recordLimit, setRecordLimit] = useState(14); // New state for limiting records

    useEffect(() => {
        if (pesId !== null) {
            fetchData(selectedData);
        }
    }, [pesId, selectedData, recordLimit]);

    const fetchData = (period) => {
        const url = `http://localhost:8000/${period}/${pesId}?limit=${recordLimit}`;
        axios.get(url)
            .then(response => {
                const periods = response.data ? Object.keys(response.data) : [];
                const values = periods.map(period => response.data[period]).slice(-recordLimit); // Apply limit to data
                const labels = periods.map(periodKey => periodKeyFormatting(period, periodKey)).slice(-recordLimit);
                setData({
                    labels,
                    datasets: [{
                        label: `${period.charAt(0).toUpperCase() + period.slice(1)} Average Generation (MW)`,
                        data: values,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                });
            })
            .catch(error => console.error(`Error fetching ${period} data:`, error));
    };

    const periodKeyFormatting = (period, periodKey) => {
        if (period === 'weekly') {
            const [startDate, endDate] = periodKey.split(' to ');
            return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
        } else if (period === 'monthly') {
            return new Date(periodKey + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });
        } else {
            return new Date(periodKey).toLocaleDateString();
        }
    };

    const handleSelectPeriod = (period) => {
        setSelectedData(period);
        setRecordLimit(14); // Reset the record limit when changing period
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'category',
                ticks: {
                    autoSkip: false
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 100
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y.toFixed(2)} MW`;
                    }
                }
            }
        }
    };

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <Select
                style={{ width: 200 }}
                options={pesOptions}
                value={pesId}
                onChange={setPesId}
                placeholder="Select PES ID"
            />
            <div>
                <button onClick={() => handleSelectPeriod('daily')}>Daily</button>
                <button onClick={() => handleSelectPeriod('weekly')}>Weekly</button>
                <button onClick={() => handleSelectPeriod('monthly')}>Monthly</button>
                <Button onClick={() => setRecordLimit(recordLimit + 14)}>Show More</Button> {/* Button to increase record limit */}
                <Button onClick={() => setRecordLimit(14)}>Reset</Button> {/* Button to reset record limit */}
            </div>
            <h2>{`${selectedData.charAt(0).toUpperCase() + selectedData.slice(1)} Solar Generation Averages`}</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default SolarDataChart;