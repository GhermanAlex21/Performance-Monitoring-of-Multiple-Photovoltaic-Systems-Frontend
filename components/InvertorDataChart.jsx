import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { Select, Button } from 'antd';
import { useParams } from 'react-router-dom';

const InvertorDataChart = () => {
    const [data, setData] = useState({ labels: [], datasets: [] });
    const [selectedData, setSelectedData] = useState('daily');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { pesId } = useParams();
    const [recordLimit, setRecordLimit] = useState(14);

    useEffect(() => {
        if (pesId) {
            fetchData(selectedData);
        }
    }, [pesId, selectedData, recordLimit]);

    const fetchData = async (period) => {
        setLoading(true);
        setError(null);
        const url = `http://localhost:8000/${period}/${pesId}?limit=${recordLimit}`;
        console.log(`Fetching data from URL: ${url}`); // Debugging line
        try {
            const response = await axios.get(url);
            console.log('API response:', response.data); // Debugging line
            if (response.data && Object.keys(response.data).length) {
                const periods = Object.keys(response.data).sort();
                const values = periods.map(period => response.data[period]).slice(-recordLimit);
                const labels = periods.map(periodKey => periodKeyFormatting(period, periodKey)).slice(-recordLimit);
                setData({
                    labels: labels,
                    datasets: [{
                        label: `${period.charAt(0).toUpperCase() + period.slice(1)} Generation (MW)`,
                        data: values,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        fill: true,
                        pointRadius: 3,
                        borderWidth: 1.5
                    }]
                });
            } else {
                setError('No data available');
                setData({ labels: [], datasets: [] });
            }
        } catch (error) {
            setError(`Failed to fetch data: ${error.message}`);
            console.error('Error fetching data:', error);
        }
        setLoading(false);
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
                    label: tooltipItem => `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y.toFixed(2)} MW`
                }
            }
        }
    };

    return (
        <div style={{ height: '400px', width: '100%' }}>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <Select
                style={{ width: 200 }}
                value={selectedData}
                onChange={setSelectedData}
                options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' }
                ]}
            />
            <Button onClick={() => setRecordLimit(r => r + 14)}>Show More</Button>
            <Button onClick={() => setRecordLimit(14)}>Reset</Button>
            <h2>{`${selectedData.charAt(0).toUpperCase() + selectedData.slice(1)} Solar Generation Data for Invertor ${pesId || 'Not specified'}`}</h2>
            {!loading && data.labels.length > 0 ? (
                <Line data={data} options={options} />
            ) : (
                <div>Loading data...</div>
            )}
        </div>
    );
};

export default InvertorDataChart;
