import React, { useEffect, useState, useRef } from 'react';
import { parseJwt, getUserInverters, getComparisonDataForSingleInvertor, updateInverterVisibility } from '../utils/service';
import { useNavigate } from 'react-router-dom';
import { Table } from 'antd';

const MyInverters = () => {
    const [inverters, setInverters] = useState([]);
    const [comparisonData, setComparisonData] = useState(null);
    const [comparisonPesId, setComparisonPesId] = useState(null);
    const [error, setError] = useState('');
    const mapRef = useRef(null);
    const infoWindowRef = useRef(null);
    const markersRef = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const decodedToken = parseJwt(token);

                if (!decodedToken || !decodedToken.userId) {
                    console.error('User ID is not set or invalid token');
                    return;
                }

                const userInverters = await getUserInverters(decodedToken.userId);
                setInverters(userInverters);
                await initMap(userInverters, decodedToken.userId);
            } catch (err) {
                setError('Failed to fetch data');
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const initMap = async (inverterData, userId) => {
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        const map = new Map(document.getElementById('map'), {
            zoom: 13,
            center: { lat: 47.6573, lng: 23.5681 },
            mapId: '51f3d46cdbaab1df'
        });

        mapRef.current = map;

        const legend = document.createElement('div');
        legend.innerHTML = `
            <div style="background-color: white; padding: 10px; margin: 10px; border: 1px solid #ccc;">
                <h3>Legend</h3>
                <p><img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" /> Your Inverters</p>
                <p><img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" /> Other Inverters</p>
            </div>
        `;
        map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);

        inverterData.forEach((inverter, index) => {
            const markerContent = document.createElement('div');
            markerContent.innerHTML = `<div style="background-image: url('http://maps.google.com/mapfiles/ms/icons/blue-dot.png'); width: 32px; height: 32px; background-size: cover;"></div>`;

            const marker = new AdvancedMarkerElement({
                map: map,
                position: { lat: inverter.latitude, lng: inverter.longitude },
                title: `${inverter.marca.nume} ${inverter.serie.nume}`,
                content: markerContent
            });

            markersRef.current[index] = { marker, inverter };

            marker.addListener('click', async () => {
                markersRef.current.forEach(({ marker }) => {
                    marker.content.innerHTML = `<div style="background-image: url('http://maps.google.com/mapfiles/ms/icons/blue-dot.png'); width: 32px; height: 32px; background-size: cover;"></div>`;
                });

                marker.content.innerHTML = `<div style="background-image: url('http://maps.google.com/mapfiles/ms/icons/green-dot.png'); width: 32px; height: 32px; background-size: cover;"></div>`;

                const handleVisibilityToggle = async () => {
                    try {
                        await updateInverterVisibility(inverter.id, !inverter.visible);
                        const updatedInverters = inverters.map(inv => inv.id === inverter.id ? { ...inv, visible: !inv.visible } : inv);
                        setInverters(updatedInverters);
                        marker.content.innerHTML = `<div style="background-image: url('http://maps.google.com/mapfiles/ms/icons/${inverter.visible ? 'red' : 'blue'}-dot.png'); width: 32px; height: 32px; background-size: cover;"></div>`;
                    } catch (err) {
                        setError('Failed to update inverter visibility');
                        console.error(err);
                    }
                };

                const contentString = `
                    <div>
                        <h2>${inverter.marca.nume} ${inverter.serie.nume}</h2>
                        <p>Latitudine: ${inverter.latitude}</p>
                        <p>Longitudine: ${inverter.longitude}</p>
                        <p>Azimut: ${inverter.azimut}</p>
                        <p>Proprietar: ${inverter.user.nume} ${inverter.user.prenume}</p>
                        <button onclick="window.viewStatistics(${inverter.pesId})">View Statistics</button>
                        <button onclick="window.viewComparisonData(${inverter.pesId})">View Comparison Data</button>
                        <button onclick="window.handleVisibilityToggle(${inverter.id})">${inverter.visible ? 'Make Private' : 'Make Visible'}</button>
                    </div>
                `;

                window.handleVisibilityToggle = handleVisibilityToggle;

                if (infoWindowRef.current) {
                    infoWindowRef.current.close();
                }

                const infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });

                infoWindowRef.current = infoWindow;
                infoWindow.open(map, marker);
            });
        });

        map.addListener('click', () => {
            if (infoWindowRef.current) {
                infoWindowRef.current.close();
            }
            markersRef.current.forEach(({ marker }) => {
                marker.content.innerHTML = `<div style="background-image: url('http://maps.google.com/mapfiles/ms/icons/blue-dot.png'); width: 32px; height: 32px; background-size: cover;"></div>`;
            });
        });
    };

    window.viewStatistics = pesId => {
        navigate(`/statistics/${pesId}`);
    };

    window.viewComparisonData = async (pesId) => {
        try {
            const data = await getComparisonDataForSingleInvertor(pesId);
            console.log('Comparison Data:', data);
            if (data.error) {
                setError(data.error);
            } else {
                setComparisonData(data);
                setComparisonPesId(pesId);
            }
        } catch (err) {
            setError('Failed to fetch comparison data');
            console.error(err);
        }
    };

    const formatNumber = (number, unit) => {
        if (number === null || number === undefined) {
            return number;
        }
        const formattedNumber = number % 1 === 0 ? number.toString() : number.toFixed(2).replace(/\.?0+$/, '');
        return `${formattedNumber} ${unit}`;
    };

    const columns = [
        {
            title: 'Metric',
            dataIndex: 'metric',
            key: 'metric',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            render: (text, record) => formatNumber(text, record.unit),
        },
    ];

    const dataSource = comparisonData ? [
        {
            key: '1',
            metric: 'Max Energy',
            value: comparisonData.maxEnergy,
            unit: 'MWh'
        },
        {
            key: '2',
            metric: 'Total Hours',
            value: comparisonData.totalHours,
            unit: 'hours'
        },
        {
            key: '3',
            metric: 'Total Energy',
            value: comparisonData.totalEnergy,
            unit: 'MWh'
        },
        {
            key: '4',
            metric: 'Median Energy',
            value: comparisonData.medianEnergy,
            unit: 'MWh'
        },
        {
            key: '5',
            metric: 'Average Energy',
            value: comparisonData.averageEnergy,
            unit: 'MWh'
        },
        {
            key: '6',
            metric: 'Capacity Factor',
            value: comparisonData.capacityFactor,
            unit: ''
        },
    ] : [];

    return (
        <div>
            <h1>My Inverters</h1>
            <div id="map" style={{ height: '500px', width: '100%' }}></div>
            {comparisonData && (
                <div style={{ marginTop: 20 }}>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        bordered
                        title={() => 'Comparison Results'}
                    />
                </div>
            )}
            {error && <div className="error">{error}</div>}
        </div>
    );
}

export default MyInverters;
