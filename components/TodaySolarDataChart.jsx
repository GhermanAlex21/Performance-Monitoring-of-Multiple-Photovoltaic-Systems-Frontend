import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { useParams } from 'react-router-dom';

const TodaySolarDataChart = () => {
    const [todayData, setTodayData] = useState({});
    const { pesId } = useParams();
    const wsRef = useRef(null);

    useEffect(() => {
        if (pesId !== null) {
            connectWebSocket();
        }
        return () => {
            if (wsRef.current) wsRef.current.close();
        };
    }, [pesId]);

    const connectWebSocket = () => {
        if (wsRef.current) wsRef.current.close();
        const ws = new WebSocket('ws://localhost:8000/sockets');

        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.onmessage = (event) => {
            console.log('WebSocket message received:', event.data);
            const updatedData = JSON.parse(event.data);
            const messageDate = new Date(updatedData.datetimeGMT).toLocaleDateString();
            const todayDate = new Date().toLocaleDateString();

            if (messageDate === todayDate && updatedData.pesId === parseInt(pesId)) {
                setTodayData(prevData => {
                    const newData = { ...prevData };
                    if (!newData[updatedData.pesId]) {
                        newData[updatedData.pesId] = [];
                    }
                    newData[updatedData.pesId] = [...newData[updatedData.pesId], updatedData];
                    newData[updatedData.pesId].sort((a, b) => new Date(a.datetimeGMT) - new Date(b.datetimeGMT));
                    return newData;
                });
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = (event) => {
            console.log('WebSocket connection closed', event);
            setTimeout(() => connectWebSocket(), 5000);
        };

        wsRef.current = ws;
    };

    const todayChartData = {
        labels: (todayData[pesId] || []).map(item => new Date(item.datetimeGMT).toLocaleTimeString()),
        datasets: [{
            label: 'Generation (MW) Today',
            data: (todayData[pesId] || []).map(item => item.generationMW),
            borderColor: '#8BC34A',
            backgroundColor: 'rgba(139, 195, 74, 0.5)',
            tension: 0.1,
            fill: true,
            pointRadius: 3,
            borderWidth: 1.5
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'category',
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 48 // approximately every 30 minutes if data points are every 5 minutes
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 100,
                    callback: function (value) {
                        return value.toFixed(2) + ' MW';
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y.toFixed(2)} MW`;
                    }
                }
            },
            hover: {
                mode: 'nearest',
                intersect: false
            }
        }
    };

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <h2>Today Solar Generation Averages</h2>
            <Line data={todayChartData} options={options} />
        </div>
    );
};

export default TodaySolarDataChart;
