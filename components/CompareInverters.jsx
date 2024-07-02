import React, { useState, useEffect } from 'react';
import { getAllInvertors, compareInvertors } from '../utils/service';
import { Select, Table, message } from 'antd';
import { useParams } from 'react-router-dom';
import '../src/CompareInverters.css';

const { Option } = Select;

const CompareInverters = () => {
    const { id1, id2, marca1, serie1, marca2, serie2 } = useParams();
    const [invertors, setInvertors] = useState([]);
    const [invertor1, setInvertor1] = useState(id1 || null);
    const [invertor2, setInvertor2] = useState(id2 || null);
    const [comparisonData, setComparisonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [invertor1Details, setInvertor1Details] = useState({});
    const [invertor2Details, setInvertor2Details] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const invertorData = await getAllInvertors();
            setInvertors(invertorData);

            if (id1) {
                const details1 = invertorData.find(invertor => invertor.id === parseInt(id1));
                setInvertor1Details(details1);
            }
            if (id2) {
                const details2 = invertorData.find(invertor => invertor.id === parseInt(id2));
                setInvertor2Details(details2);
            }
        };

        fetchData();
    }, [id1, id2]);

    useEffect(() => {
        if (invertor1 && invertor2) {
            handleCompare();
        }
    }, [invertor1, invertor2]);

    const handleCompare = async () => {
        if (invertor1 === invertor2) {
            message.error('Please select different inverters for comparison.');
            return;
        }

        if (invertor1 && invertor2) {
            setLoading(true);
            try {
                const data = await compareInvertors(invertor1, invertor2);
                setComparisonData(data);

                const details1 = invertors.find(invertor => invertor.id === parseInt(invertor1));
                const details2 = invertors.find(invertor => invertor.id === parseInt(invertor2));
                setInvertor1Details(details1);
                setInvertor2Details(details2);
            } catch (error) {
                console.error("Error comparing inverters:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const formatNumber = (number, unit) => {
        if (number === null || number === undefined) {
            return number;
        }
        const formattedNumber = number % 1 === 0 ? number.toString() : number.toFixed(3).replace(/\.?0+$/, '');
        return `${formattedNumber} ${unit}`;
    };

    const columns = [
        {
            title: 'Metric',
            dataIndex: 'metric',
            key: 'metric',
        },
        {
            title: `${invertor1Details?.marca?.nume || marca1} ${invertor1Details?.serie?.nume || serie1}`,
            dataIndex: 'inverter1',
            key: 'inverter1',
            render: (text, record) => (
                <div className={record.inverter1 > record.inverter2 ? 'highlight' : ''}>
                    {formatNumber(text, record.unit)}
                </div>
            ),
        },
        {
            title: `${invertor2Details?.marca?.nume || marca2} ${invertor2Details?.serie?.nume || serie2}`,
            dataIndex: 'inverter2',
            key: 'inverter2',
            render: (text, record) => (
                <div className={record.inverter2 > record.inverter1 ? 'highlight' : ''}>
                    {formatNumber(text, record.unit)}
                </div>
            ),
        },
    ];

    const dataSource = comparisonData ? [
        {
            key: '1',
            metric: 'Max Energy',
            inverter1: comparisonData.invertor1.maxEnergy,
            inverter2: comparisonData.invertor2.maxEnergy,
            unit: 'MWh'
        },
        {
            key: '2',
            metric: 'Total Hours',
            inverter1: comparisonData.invertor1.totalHours,
            inverter2: comparisonData.invertor2.totalHours,
            unit: 'hours'
        },
        {
            key: '3',
            metric: 'Total Energy',
            inverter1: comparisonData.invertor1.totalEnergy,
            inverter2: comparisonData.invertor2.totalEnergy,
            unit: 'MWh'
        },
        {
            key: '4',
            metric: 'Median Energy',
            inverter1: comparisonData.invertor1.medianEnergy,
            inverter2: comparisonData.invertor2.medianEnergy,
            unit: 'MWh'
        },
        {
            key: '5',
            metric: 'Average Energy',
            inverter1: comparisonData.invertor1.averageEnergy,
            inverter2: comparisonData.invertor2.averageEnergy,
            unit: 'MWh'
        },
        {
            key: '6',
            metric: 'Capacity Factor',
            inverter1: comparisonData.invertor1.capacityFactor,
            inverter2: comparisonData.invertor2.capacityFactor,
            unit: ''
        },
    ] : [];

    return (
        <div className="compare-inverters">
            <h2 className="compare-header">Compare Inverters</h2>
            <div className="select-inverters">
                <Select
                    value={invertor1}
                    placeholder="Select Inverter 1"
                    onChange={(value) => {
                        setInvertor1(value);
                        const details = invertors.find(invertor => invertor.id === parseInt(value));
                        setInvertor1Details(details);
                    }}
                    style={{ marginRight: 10 }}
                >
                    {invertors.map(invertor => (
                        <Option key={invertor.id} value={invertor.id} title={`${invertor.marca.nume} ${invertor.serie.nume} (ID: ${invertor.id})`}>
                            {invertor.marca.nume} {invertor.serie.nume} (ID: {invertor.id})
                        </Option>
                    ))}
                </Select>
                <Select
                    value={invertor2}
                    placeholder="Select Inverter 2"
                    onChange={(value) => {
                        setInvertor2(value);
                        const details = invertors.find(invertor => invertor.id === parseInt(value));
                        setInvertor2Details(details);
                    }}
                    style={{ marginRight: 10 }}
                >
                    {invertors.map(invertor => (
                        <Option key={invertor.id} value={invertor.id} title={`${invertor.marca.nume} ${invertor.serie.nume} (ID: ${invertor.id})`}>
                            {invertor.marca.nume} {invertor.serie.nume} (ID: {invertor.id})
                        </Option>
                    ))}
                </Select>
            </div>
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
        </div>
    );
};

export default CompareInverters;