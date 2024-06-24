import React, { useEffect, useState, useRef } from 'react';
import { Select } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../src/styles.css';

const { Option } = Select;

const SolarPanelDataComponent = () => {
    const [solarData, setSolarData] = useState({});
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [selectedInvertor, setSelectedInvertor] = useState(0);
    const [invertorOptions] = useState([0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
    const wsRef = useRef(null);

    useEffect(() => {
        const connectWebSocket = () => {
            const ws = new WebSocket('ws://localhost:8000/sockets');

            ws.onopen = () => {
                console.log('WebSocket connection opened');
                setConnectionStatus('Connected');
            };

            ws.onmessage = (event) => {
                console.log('WebSocket message received:', event.data);
                const updatedData = JSON.parse(event.data);

                setSolarData(prevData => {
                    const newData = { ...prevData };
                    if (!newData[updatedData.pesId]) {
                        newData[updatedData.pesId] = [];
                    }
                    newData[updatedData.pesId] = [...newData[updatedData.pesId].filter(data => data.datetimeGMT !== updatedData.datetimeGMT), updatedData];
                    return newData;
                });
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('Error');
            };

            ws.onclose = (event) => {
                console.log('WebSocket connection closed', event);
                setConnectionStatus('Disconnected');
                setTimeout(() => connectWebSocket(), 5000);
            };

            wsRef.current = ws;
        };

        connectWebSocket();

        return () => {
            if (wsRef.current) wsRef.current.close();
        };
    }, []);

    const handleChange = (value) => {
        setSelectedInvertor(value);
    };

    const dataToDisplay = solarData[selectedInvertor] || [];

    return (
        <div className="container">
            <h2 className="title">Date Panouri Solare</h2>
            <p className="status">Status conexiune: {connectionStatus}</p>
            <div className="select-container">
                <Select
                    value={selectedInvertor}
                    onChange={handleChange}
                    style={{ width: 200 }}
                >
                    {invertorOptions.map(option => (
                        <Option key={option} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>
            </div>
            {dataToDisplay.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={dataToDisplay}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                        <XAxis dataKey="datetimeGMT" tickFormatter={(tick) => new Date(tick).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} />
                        <YAxis />
                        <Tooltip labelFormatter={(label) => new Date(label).toLocaleString('en-GB')} />
                        <Legend verticalAlign="top" height={36} />
                        <Line type="monotone" dataKey="generationMW" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p className="no-data">Nu sunt date disponibile.</p>
            )}
        </div>
    );
};

export default SolarPanelDataComponent;
