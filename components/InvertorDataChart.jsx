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
        const url = `http://localhost:8000/daily/${pesId}`;
        try {
            const response = await axios.get(url);
            if (response.data && Object.keys(response.data).length) {
                const periods = Object.keys(response.data).sort();
                const data = periods.map(periodKey => ({
                    date: new Date(periodKey),
                    value: response.data[periodKey]
                }));
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
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;

        // Add unit to the labels
        valueAxis.renderer.labels.template.adapter.add("text", function (text) {
            return text + " MW";
        });

        // Ensure all dates are shown, but only show labels every 3 days
        dateAxis.renderer.minGridDistance = 30;
        dateAxis.baseInterval = { timeUnit: "day", count: 1 };
        dateAxis.skipEmptyPeriods = false;
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.fullWidthTooltip = true;
        dateAxis.renderer.labels.template.adapter.add("text", function (text, target) {
            let date = new Date(target.dataItem.value);
            return date.getDate() % 3 === 0 ? text : "";
        });

        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = 'date';
        series.dataFields.valueY = 'value';
        series.tooltipText = 'Date: {dateX.formatDate("yyyy-MM-dd")}\nValue: {valueY.value} MW';
        series.strokeWidth = 2;
        series.minBulletDistance = 15;

        series.tooltip.pointerOrientation = 'vertical';

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;

        let scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        scrollbarX.marginBottom = 20; // Adjust scrollbar margin
        chart.scrollbarX = scrollbarX;

        // Show labels every 3 days in scrollbar
        let sbDateAxis = scrollbarX.scrollbarChart.xAxes.getIndex(0);
        if (sbDateAxis) {
            sbDateAxis.renderer.labels.template.adapter.add("text", function (text, target) {
                let date = new Date(target.dataItem.value);
                return date.getDate() % 3 === 0 ? text : "";
            });
        }

        // Extend the line to the end of the container
        dateAxis.startLocation = 0.5;
        dateAxis.endLocation = 1;

        chart.events.on('ready', function () {
            dateAxis.zoom({ start: 0.79, end: 1 });
        });
    };

    return (
        <div>
            <h2>Daily Solar Generation Data</h2>
            <div id="chartdiv" style={{ width: '100%', height: '500px' }}></div>
        </div>
    );
};

export default InvertorDataChart;
