import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

const InvertorDataChart = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { pesId } = useParams();
    const [amChart, setAmChart] = useState(null);

    useEffect(() => {
        if (pesId) {
            fetchData();
        }
    }, [pesId]);

    useEffect(() => {
        if (chartData.length > 0) {
            createAmChart();
        }
    }, [chartData]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        const url = `http://localhost:8000/fourHourTotalEnergy/${pesId}`;
        try {
            const response = await axios.get(url);
            if (response.data && Object.keys(response.data).length) {
                const data = Object.entries(response.data)
                    .filter(([_, value]) => value != null)
                    .map(([key, value]) => ({
                        date: new Date(key),
                        value: value
                    }))
                    .sort((a, b) => a.date - b.date);
                setChartData(data);
            } else {
                setError('No data available');
                setChartData([]);
            }
        } catch (error) {
            setError(`Failed to fetch data: ${error.message}`);
        }
        setLoading(false);
    };

    const createAmChart = () => {
        if (amChart) {
            amChart.dispose();
        }

        let chart = am4core.create('chartdiv', am4charts.XYChart);
        setAmChart(chart);

        chart.paddingRight = 20;
        chart.data = chartData;

        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 60;
        dateAxis.baseInterval = { timeUnit: "hour", count: 4 };
        dateAxis.skipEmptyPeriods = true;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.labels.template.adapter.add("text", (text) => text + " MW");

        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = 'date';
        series.dataFields.valueY = 'value';
        series.tooltipText = "Date: {dateX.formatDate('yyyy-MM-dd HH:mm')}\nTotal Energy: {valueY.value} MW";
        series.strokeWidth = 2;
        series.tensionX = 0.8; // Set tension for curved lines
        series.fillOpacity = 0.2; // Set fill opacity
        series.fill = am4core.color("#8BC34A"); // Set fill color

        series.bullets.push(new am4charts.CircleBullet());

        // Schimbăm culoarea liniilor la un verde mai deschis
        series.stroke = am4core.color("#8BC34A");

        chart.cursor = new am4charts.XYCursor();
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);

        chart.events.on('ready', function () {
            if (chartData.length > 30) {
                dateAxis.zoomToDates(
                    chartData[chartData.length - 30].date,
                    chartData[chartData.length - 1].date
                );
            }
        });
    };

    return (
        <div>
            <h2>Four Hour Total Solar Energy</h2>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <div id="chartdiv" style={{ width: '100%', height: '500px' }}></div>
        </div>
    );
};

export default InvertorDataChart;
