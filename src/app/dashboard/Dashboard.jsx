'use client'
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Upload, FileText, Database, TrendingUp, Users, Activity, Settings, LogOut, Plus, Edit2, Trash2, Download, ChevronDown, Filter, BarChart3, PieChart as PieChartIcon, TrendingDown, Zap, Eye, X, Maximize2 } from 'lucide-react';
import LoadingAnimation from '../Animation/LoadingAnimation';
// import { userDetails } from '../UserDetails/loggedInUserDetails';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SheetModalShow from '@/components/SheetModal/SheetModal';
import { useAuth } from '../AuthPage';
import { useDispatch , useSelector } from 'react-redux';
import { loadUserFromLocalStorage , loadTokenFromLocalStorage } from '@/components/Redux/AuthSlice';

const Dashboard = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [showDatasetSelector, setShowDatasetSelector] = useState(false);
  const [currentViewingDataset, setCurrentViewingDataset] = useState(null);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [generatedCharts, setGeneratedCharts] = useState([]);
  const [showAllCharts, setShowAllCharts] = useState(false);
  const [chartStats, setChartStats] = useState({});
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailChart, setDetailChart] = useState(null);
  const [detailChartData, setDetailChartData] = useState([]);
  const [detailStats, setDetailStats] = useState({});
  const [showRefresh, setShowRefresh] = useState(false);
  const [selectedDataSetId, setSelectedDatasetId] = useState('');
  const [showSheet, setShowSheet] = useState(false);
  
  const router = useRouter();
  const isLoading = useAuth();

  const colorPalettes = {
    primary: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'],
    secondary: ['#A855F7', '#F472B6', '#34D399', '#FBBF24', '#FB7185', '#38BDF8'],
    tertiary: ['#C084FC', '#F9A8D4', '#6EE7B7', '#FCD34D', '#FCA5A5', '#7DD3FC'],
    gradient: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#A855F7', '#F472B6']
  };

  const dispatch = useDispatch();
  const token = useSelector((state)=>state?.userLocalSlice.token)
  const user = useSelector((state)=>state?.userLocalSlice.user)
    
  useEffect(()=>{
      if(!token && !user?.email){
         router.push('/')
      }
  },[dispatch])


  useEffect(()=>{
       dispatch(loadTokenFromLocalStorage())
      dispatch(loadUserFromLocalStorage())
  },[dispatch])


 
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://myprod.onrender.com/api/users/alldatasets', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiData = await response.json();
      
      console.log('response data is ', apiData);
      
      if (!apiData.datasets || !Array.isArray(apiData.datasets)) {
        throw new Error('Invalid API response format');
      }
      
      const transformedDatasets = apiData.datasets.map((dataset, index) => ({
        id: dataset.id || index + 1,
        name: dataset.fileName || `Dataset ${index + 1}`,
        source: dataset.source || 'csv',
        records: dataset.rowCount || (dataset.row && dataset.row.length) || 0,
        lastUpdated: dataset.uploadedAt ? new Date(dataset.uploadedAt).toLocaleDateString() : 'N/A',
        status: 'active',
        rawData: dataset.row || [],
        columns: dataset.row && dataset.row.length > 0 ? Object.keys(dataset.row[0]) : [],
        sheetUrl: dataset?.sheetUrl || '',
        lastSyncedAt: dataset?.lastSyncedAt || ''
      }));
      
      setDatasets(transformedDatasets);

      if (transformedDatasets.length > 0) {
        setCurrentViewingDataset(transformedDatasets[0]);
        setSelectedDatasetId(transformedDatasets[0]);
        generateAllCharts(transformedDatasets[0]);
        
        if (transformedDatasets[0]?.sheetUrl) {
          setShowRefresh(true);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data from API');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const analyzeColumnTypes = (data, columns) => {
    if (!data || !Array.isArray(data) || data.length === 0 || !columns || !Array.isArray(columns)) {
      return [];
    }

    const analysisColumns = columns.slice(1);

    const columnAnalysis = analysisColumns.map(col => {
      const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '');
      const numericValues = values.filter(val => !isNaN(parseFloat(val)) && isFinite(val));
      const uniqueValues = [...new Set(values)];

      return {
        name: col,
        type: numericValues.length > values.length * 0.7 ? 'numeric' : 'categorical',
        uniqueCount: uniqueValues.length,
        totalCount: values.length,
        uniqueValues: uniqueValues.slice(0, 20),
        hasNulls: values.length < data.length,
        numericRatio: values.length > 0 ? numericValues.length / values.length : 0,
        samples: values.slice(0, 5)
      };
    });

    return columnAnalysis;
  };

  const calculateVolatility = (values) => {
    if (!values || values.length < 2) return 0;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
    return Math.sqrt(variance).toFixed(2);
  };

  const generateCompleteChartData = (dataset, chartType, columns, chartId) => {
    if (!dataset || !dataset.rawData || !Array.isArray(dataset.rawData) || dataset.rawData.length === 0) {
      return { data: [], stats: {} };
    }

    const fullData = dataset.rawData;
    let completeData = [];
    let stats = {};

    try {
      switch (chartType) {
        case 'bar':
          if (!columns || columns.length === 0) return { data: [], stats: {} };
          
          const column = columns[0];
          completeData = fullData.map((row, index) => ({
            name: `${index + 1}`,
            value: parseFloat(row[column]) || 0,
            originalValue: row[column],
            rowIndex: index + 1
          }));

          const values = completeData.map(d => d.value);
          stats = {
            total: values.reduce((a, b) => a + b, 0),
            average: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
            maximum: values.length > 0 ? Math.max(...values) : 0,
            minimum: values.length > 0 ? Math.min(...values) : 0,
            count: values.length,
            nonZeroCount: values.filter(v => v !== 0).length
          };
          break;

        case 'pie':
          if (!columns || columns.length === 0) return { data: [], stats: {} };
          
          const categoryColumn = columns[0];
          const categoryCount = {};
          fullData.forEach(row => {
            const value = row[categoryColumn] || 'Unknown';
            categoryCount[value] = (categoryCount[value] || 0) + 1;
          });

          completeData = Object.entries(categoryCount)
            .sort(([, a], [, b]) => b - a)
            .map(([name, count], index) => ({
              name: name,
              value: count,
              percentage: ((count / fullData.length) * 100).toFixed(2),
              color: colorPalettes.primary[index % colorPalettes.primary.length]
            }));

          stats = {
            totalCategories: completeData.length,
            totalRecords: fullData.length,
            mostCommon: completeData[0]?.name || 'N/A',
            leastCommon: completeData[completeData.length - 1]?.name || 'N/A',
            diversity: (completeData.length / fullData.length * 100).toFixed(2)
          };
          break;

        case 'scatter':
          if (!columns || columns.length < 2) return { data: [], stats: {} };
          
          const [col1, col2] = columns;
          completeData = fullData.map((row, index) => ({
            x: parseFloat(row[col1]) || 0,
            y: parseFloat(row[col2]) || 0,
            name: `Point ${index + 1}`,
            rowIndex: index + 1,
            originalX: row[col1],
            originalY: row[col2]
          }));

          const xValues = completeData.map(d => d.x);
          const yValues = completeData.map(d => d.y);

          const n = completeData.length;
          if (n > 1) {
            const sumX = xValues.reduce((a, b) => a + b, 0);
            const sumY = yValues.reduce((a, b) => a + b, 0);
            const sumXY = completeData.reduce((sum, point) => sum + (point.x * point.y), 0);
            const sumX2 = xValues.reduce((sum, x) => sum + (x * x), 0);
            const sumY2 = yValues.reduce((sum, y) => sum + (y * y), 0);

            const correlation = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

            stats = {
              correlation: isNaN(correlation) ? 0 : correlation.toFixed(3),
              xStats: {
                min: Math.min(...xValues),
                max: Math.max(...xValues),
                avg: sumX / n
              },
              yStats: {
                min: Math.min(...yValues),
                max: Math.max(...yValues),
                avg: sumY / n
              },
              totalPoints: n
            };
          } else {
            stats = {
              correlation: 0,
              xStats: { min: 0, max: 0, avg: 0 },
              yStats: { min: 0, max: 0, avg: 0 },
              totalPoints: n
            };
          }
          break;

        case 'groupedBar':
          if (!columns || columns.length < 2) return { data: [], stats: {} };
          
          const [catCol, numCol] = columns;
          const groupedData = {};
          fullData.forEach(row => {
            const category = row[catCol] || 'Unknown';
            const value = parseFloat(row[numCol]) || 0;

            if (!groupedData[category]) {
              groupedData[category] = { values: [], sum: 0, count: 0 };
            }
            groupedData[category].values.push(value);
            groupedData[category].sum += value;
            groupedData[category].count += 1;
          });

          completeData = Object.entries(groupedData)
            .map(([name, data]) => ({
              name: name,
              average: data.sum / data.count,
              total: data.sum,
              count: data.count,
              maximum: Math.max(...data.values),
              minimum: Math.min(...data.values),
              values: data.values
            }))
            .sort((a, b) => b.average - a.average);

          stats = {
            totalGroups: completeData.length,
            overallTotal: completeData.reduce((sum, group) => sum + group.total, 0),
            overallAverage: completeData.length > 0 ? completeData.reduce((sum, group) => sum + group.average, 0) / completeData.length : 0,
            highestGroup: completeData[0]?.name || 'N/A',
            lowestGroup: completeData[completeData.length - 1]?.name || 'N/A'
          };
          break;

        case 'line':
        case 'area':
          if (!columns || columns.length === 0) return { data: [], stats: {} };
          
          const lineColumn = columns[0];
          let cumulative = 0;
          completeData = fullData.map((row, index) => {
            const value = parseFloat(row[lineColumn]) || 0;
            if (chartType === 'area') cumulative += value;

            return {
              index: index + 1,
              value: value,
              cumulative: chartType === 'area' ? cumulative : undefined,
              name: `Point ${index + 1}`,
              originalValue: row[lineColumn]
            };
          });

          const lineValues = completeData.map(d => d.value);
          stats = {
            trend: lineValues.length > 1 ?
              (lineValues[lineValues.length - 1] > lineValues[0] ? 'Increasing' : 'Decreasing') : 'Stable',
            totalChange: lineValues.length > 1 ?
              lineValues[lineValues.length - 1] - lineValues[0] : 0,
            averageValue: lineValues.length > 0 ? lineValues.reduce((a, b) => a + b, 0) / lineValues.length : 0,
            volatility: calculateVolatility(lineValues),
            finalCumulative: chartType === 'area' ? cumulative : undefined
          };
          break;

        default:
          completeData = [];
          stats = {};
        }
    } catch (error) {
      console.error('Error generating chart data:', error);
      completeData = [];
      stats = {};
    }

    return { data: completeData, stats };
  };

  const showChartDetail = (chart) => {
    const columns = getChartColumns(chart);
    const { data, stats } = generateCompleteChartData(currentViewingDataset, chart.type, columns, chart.id);

    setDetailChart(chart);
    setDetailChartData(data);
    setDetailStats(stats);
    setShowDetailModal(true);
  };

  const getChartColumns = (chart) => {
    if (!chart) return [];
    
    try {
      switch (chart.type) {
        case 'bar':
        case 'line':
        case 'area':
          return [chart.dataKey];
        case 'pie':
          const pieMatch = chart.title.match(/^(.+) Categories$/);
          return pieMatch ? [pieMatch[1]] : [''];
        case 'scatter':
          const scatterMatch = chart.title.match(/^(.+) vs (.+)$/);
          return scatterMatch ? [scatterMatch[1], scatterMatch[2]] : ['', ''];
        case 'groupedBar':
          const groupMatch = chart.title.match(/^(.+) by (.+)$/);
          return groupMatch ? [groupMatch[2], groupMatch[1]] : ['', ''];
        case 'multiBar':
          return chart.columns || [];
        default:
          return [];
      }
    } catch (error) {
      console.error('Error getting chart columns:', error);
      return [];
    }
  };

  const generateAllCharts = (dataset) => {
    if (!dataset || !dataset.rawData || !Array.isArray(dataset.rawData) || dataset.rawData.length === 0) {
      setGeneratedCharts([]);
      setAvailableColumns([]);
      setChartStats({});
      return;
    }

    try {
      const columns = dataset.columns || [];
      setAvailableColumns(columns);

      const columnAnalysis = analyzeColumnTypes(dataset.rawData, columns);
      const numericColumns = columnAnalysis.filter(col => col.type === 'numeric');
      const categoricalColumns = columnAnalysis.filter(col => col.type === 'categorical');

      const charts = [];
      let chartId = 1;

      const stats = {
        totalRecords: dataset.rawData.length,
        numericColumns: numericColumns.length,
        categoricalColumns: categoricalColumns.length,
        totalColumns: columnAnalysis.length
      };

      numericColumns.forEach(col => {
        if (charts.length >= 40) return;

        const data = dataset.rawData
          .map(row => ({ name: `${dataset.rawData.indexOf(row) + 1}`, [col.name]: parseFloat(row[col.name]) || 0 }))
          .slice(0, 20);

        charts.push({
          id: chartId++,
          title: `${col.name} Distribution`,
          type: 'bar',
          data: data,
          dataKey: col.name,
          description: `Distribution of values in ${col.name} column`
        });
      });

      // Generate pie charts for categorical columns
      categoricalColumns.forEach(col => {
        if (charts.length >= 40) return;

        const categoryCount = {};
        dataset.rawData.forEach(row => {
          const value = row[col.name] || 'Unknown';
          categoryCount[value] = (categoryCount[value] || 0) + 1;
        });

        const pieData = Object.entries(categoryCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 8)
          .map(([name, count], index) => ({
            name: name.length > 15 ? name.substring(0, 15) + '...' : name,
            value: count,
            color: colorPalettes.primary[index % colorPalettes.primary.length]
          }));

        charts.push({
          id: chartId++,
          title: `${col.name} Categories`,
          type: 'pie',
          data: pieData,
          description: `Category distribution for ${col.name}`
        });
      });

      // Generate scatter plots
      for (let i = 0; i < numericColumns.length && charts.length < 40; i++) {
        for (let j = i + 1; j < numericColumns.length && charts.length < 40; j++) {
          const col1 = numericColumns[i];
          const col2 = numericColumns[j];

          const scatterData = dataset.rawData
            .slice(0, 50)
            .map(row => ({
              x: parseFloat(row[col1.name]) || 0,
              y: parseFloat(row[col2.name]) || 0,
              name: `Point ${dataset.rawData.indexOf(row) + 1}`
            }));

          charts.push({
            id: chartId++,
            title: `${col1.name} vs ${col2.name}`,
            type: 'scatter',
            data: scatterData,
            description: `Correlation between ${col1.name} and ${col2.name}`
          });
        }
      }

      // Generate grouped bar charts
      categoricalColumns.forEach(catCol => {
        numericColumns.forEach(numCol => {
          if (charts.length >= 40) return;

          const groupedData = {};
          dataset.rawData.forEach(row => {
            const category = row[catCol.name] || 'Unknown';
            const value = parseFloat(row[numCol.name]) || 0;

            if (!groupedData[category]) {
              groupedData[category] = { sum: 0, count: 0, avg: 0 };
            }
            groupedData[category].sum += value;
            groupedData[category].count += 1;
            groupedData[category].avg = groupedData[category].sum / groupedData[category].count;
          });

          const chartData = Object.entries(groupedData)
            .sort(([, a], [, b]) => b.avg - a.avg)
            .slice(0, 10)
            .map(([name, data]) => ({
              name: name.length > 12 ? name.substring(0, 12) + '...' : name,
              average: Math.round(data.avg * 100) / 100,
              total: data.sum,
              count: data.count
            }));

          charts.push({
            id: chartId++,
            title: `${numCol.name} by ${catCol.name}`,
            type: 'groupedBar',
            data: chartData,
            description: `Average ${numCol.name} grouped by ${catCol.name}`
          });
        });
      });

      // Generate line charts
      numericColumns.forEach(col => {
        if (charts.length >= 40) return;

        const lineData = dataset.rawData
          .slice(0, 30)
          .map((row, index) => ({
            index: index + 1,
            value: parseFloat(row[col.name]) || 0,
            name: `Point ${index + 1}`
          }));

        charts.push({
          id: chartId++,
          title: `${col.name} Trend`,
          type: 'line',
          data: lineData,
          dataKey: 'value',
          description: `Trend analysis for ${col.name}`
        });
      });

      // Generate area charts
      numericColumns.forEach(col => {
        if (charts.length >= 40) return;

        let cumulative = 0;
        const areaData = dataset.rawData
          .slice(0, 25)
          .map((row, index) => {
            cumulative += parseFloat(row[col.name]) || 0;
            return {
              index: index + 1,
              value: parseFloat(row[col.name]) || 0,
              cumulative: cumulative,
              name: `Point ${index + 1}`
            };
          });

        charts.push({
          id: chartId++,
          title: `${col.name} Cumulative`,
          type: 'area',
          data: areaData,
          description: `Cumulative analysis for ${col.name}`
        });
      });

      // Generate multi-column comparison
      if (numericColumns.length >= 2) {
        const multiData = dataset.rawData
          .slice(0, 15)
          .map((row, index) => {
            const dataPoint = { name: `Item ${index + 1}` };
            numericColumns.slice(0, 4).forEach(col => {
              dataPoint[col.name] = parseFloat(row[col.name]) || 0;
            });
            return dataPoint;
          });

        if (charts.length < 40) {
          charts.push({
            id: chartId++,
            title: 'Multi-Column Comparison',
            type: 'multiBar',
            data: multiData,
            columns: numericColumns.slice(0, 4).map(col => col.name),
            description: 'Comparison across multiple numeric columns'
          });
        }
      }

      // Generate summary statistics
      const summaryData = numericColumns.slice(0, 8).map(col => {
        const values = dataset.rawData
          .map(row => parseFloat(row[col.name]) || 0)
          .filter(val => !isNaN(val));

        const sum = values.reduce((a, b) => a + b, 0);
        const avg = values.length > 0 ? sum / values.length : 0;
        const max = values.length > 0 ? Math.max(...values) : 0;
        const min = values.length > 0 ? Math.min(...values) : 0;

        return {
          name: col.name.length > 10 ? col.name.substring(0, 10) + '...' : col.name,
          average: Math.round(avg * 100) / 100,
          maximum: max,
          minimum: min,
          total: Math.round(sum * 100) / 100
        };
      });

      if (charts.length < 40 && summaryData.length > 0) {
        charts.push({
          id: chartId++,
          title: 'Column Statistics Summary',
          type: 'summaryBar',
          data: summaryData,
          description: 'Statistical summary of numeric columns'
        });
      }

      setGeneratedCharts(charts);
      setChartStats(stats);
    } catch (error) {
      console.error('Error generating charts:', error);
      setGeneratedCharts([]);
      setChartStats({});
    }
  };

  const renderChart = (chart, isDetailed = false) => {
    if (!chart) return <div className="text-gray-400">No chart data available</div>;
    
    const colors = colorPalettes.primary;
    const data = isDetailed ? detailChartData : chart.data;

    if (!data || data.length === 0) {
      return <div className="text-gray-400">No data available for this chart</div>;
    }
     
    try {
      switch (chart?.type) {
      case 'bar':
          return (
            <ResponsiveContainer width="100%" height={isDetailed ? 400 : 300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey={isDetailed ? 'value' : chart.dataKey} fill={colors[0]} />
              </BarChart>
            </ResponsiveContainer>
          );

        case 'pie':
          return (
            <ResponsiveContainer width="100%" style={{ zIndex: 0 }} height={isDetailed ? 400 : 300}>
              <PieChart>
                <Pie
                  data={data?.length > 40 ? data?.slice(0, 20) : data}
                  cx="50%"
                  cy="50%"
                  outerRadius={isDetailed ? 150 : 100}
                  dataKey="value"
                  label={({ name, value, percentage }) =>
                    isDetailed ? `${name?.slice(0, 10)}... :  ${percentage}%` : `${name}: ${value}`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          );

        case 'scatter':
          return (
            <ResponsiveContainer width="100%" height={isDetailed ? 400 : 300}>
              <ScatterChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="x" stroke="#9CA3AF" />
                <YAxis dataKey="y" stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Scatter dataKey="y" fill={colors[2]} />
              </ScatterChart>
            </ResponsiveContainer>
          );

        case 'line':
          return (
            <ResponsiveContainer width="100%" height={isDetailed ? 400 : 300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="index" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey={isDetailed ? 'value' : chart.dataKey} stroke={colors[1]} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          );

        case 'area':
          return (
            <ResponsiveContainer width="100%" height={isDetailed ? 400 : 300}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="index" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="cumulative" stroke={colors[3]} fill={colors[3]} fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          );
      case 'groupedBar':
        return (
          <ResponsiveContainer width="100%" height={isDetailed ? 400 : 300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="average" fill={colors[ 4 ]} />
              {isDetailed && <Bar dataKey="total" fill={colors[ 1 ]} />}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'multiBar':
        return (
          <ResponsiveContainer width="100%" height={isDetailed ? 400 : 300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              {( chart.columns || [] ).map( ( col, index ) => (
                <Bar key={col} dataKey={col} fill={colors[ index % colors.length ]} />
              ) )}
            </BarChart>
          </ResponsiveContainer>
        );

       case 'summaryBar':
        return (
          <ResponsiveContainer width="100%" height={isDetailed ? 400 : 300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="average" fill={colors[ 0 ]} />
              <Bar dataKey="maximum" fill={colors[ 1 ]} />
              <Bar dataKey="minimum" fill={colors[ 2 ]} />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="text-gray-400">Chart type not supported</div>;
     
    }
    } catch (error) {
      
    }
    
}
  
  const handleDatasetSelection = ( dataset ) => {
    setCurrentViewingDataset( dataset );
    if(dataset?.sheetUrl){
      setShowRefresh(true);
    }else {
      setShowRefresh(false)
    }
    setSelectedDatasetId(dataset);
    generateAllCharts( dataset );
    setShowDatasetSelector( false );
  };

  const handleRename = ( dataset ) => {
    setSelectedDataset( dataset );
    setNewName( dataset.name );
    setShowRenameModal( true );
  };

  const handleRefreshSheet = async (datasetId) => {
  setLoading(true);
    try {
    const res = await axios.put(
      `https://myprod.onrender.com/api/users/refresh/${datasetId?.id}`,
      {}, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
      if(res?.data?.success){
         fetchData();
      }
    console.log('Refresh successful:', res.data);
    return res.data;

  } catch (error) {
    console.error('Error refreshing sheet:', error);
  }finally{
    setLoading( false );
  }
};



  const handleDelete = ( id ) => {
    if ( window.confirm( 'Are you sure you want to delete this dataset?' ) ) {
      const newDatasets = datasets.filter( d => d.id !== id );
      setDatasets( newDatasets );

      if ( currentViewingDataset && currentViewingDataset.id === id ) {
        if ( newDatasets.length > 0 ) {
          setCurrentViewingDataset( newDatasets[ 0 ] );
          generateAllCharts( newDatasets[ 0 ] );
        } else {
          setCurrentViewingDataset( null );
          setGeneratedCharts( [] );
        }
      }
    }
  };

  const confirmRename = () => {
    const updatedDatasets = datasets.map( d =>
      d.id === selectedDataset.id ? { ...d, name: newName } : d
    );
    setDatasets( updatedDatasets );

    if ( currentViewingDataset && currentViewingDataset.id === selectedDataset.id ) {
      setCurrentViewingDataset( { ...currentViewingDataset, name: newName } );
    }

    setShowRenameModal( false );
    setSelectedDataset( null );
    setNewName( '' );
  };

  const getSourceIcon = ( source ) => {
    switch ( source ) {
      case 'csv': return <Upload className="w-4 h-4" />;
      case 'uploaded': return <Upload className="w-4 h-4" />;
      case 'sheet': return <FileText className="w-4 h-4" />;
      case 'api': return <Database className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getSourceColor = ( source ) => {
    switch ( source ) {
      case 'csv': return 'bg-blue-500/20 text-blue-300';
      case 'uploaded': return 'bg-blue-500/20 text-blue-300';
      case 'sheet': return 'bg-green-500/20 text-green-300';
      case 'api': return 'bg-purple-500/20 text-purple-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  if ( loading ) {
    return <LoadingAnimation/> 
  }

  if ( error ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
       {(!token && !user?.email) ? <div className='text-white text-[20px] font-semibold '>Not authenticated User Please Login First</div> :   <div className="text-red-400 text-xl">{error}</div>}
      </div>
    );
  }

  return (<>
    {isLoading ? <LoadingAnimation/> :  
     <>
      <>
    {showSheet && selectedDataSetId  && 
       <div onClick={()=>setShowSheet(false)} className='fixed h-[100%] w-[100%] top-0 left-0 backdrop-blur-xl flex justify-center items-center z-50  inset-0'>
        <SheetModalShow sheetData={selectedDataSetId}/> 
      </div>
     }

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <br />
          <br />
          <br />
          <br />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Generated Charts</p>
                  <p className="text-3xl font-bold text-white mt-1">{generatedCharts.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Numeric Columns</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {chartStats.numericColumns || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Categorical Columns</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {chartStats.categoricalColumns || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <PieChartIcon className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Records</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {( chartStats.totalRecords || 0 ).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Toggle */}
          {generatedCharts.length > 0 && (
            <div className="mb-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className='flex flex-row items-center gap-10 '>
                  <h3 className="text-xl font-semibold text-white">Data Visualizations</h3>
                 {showRefresh && 
                  <button
                    onClick={() => handleRefreshSheet(selectedDataSetId)}
                    className="bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  >Refresh Sheet</button>
                  }
                  </div>
                  <button
                    onClick={() => setShowAllCharts( !showAllCharts )}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  >
                    {showAllCharts ? 'Hide Charts' : `Show All ${generatedCharts.length} Charts`}
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="mb-6">
            <div className="bg-gray-800/50  rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-white">Current Dataset:</h2>
                  <div className="relative">
                    <button
                      onClick={() => setShowDatasetSelector( !showDatasetSelector )}
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <span>{currentViewingDataset ? currentViewingDataset.name : 'Select Dataset'}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  
                    {showDatasetSelector && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                        {datasets.map( ( dataset ) => (
                          <button
                            key={dataset.id}
                            onClick={() => handleDatasetSelection( dataset )}
                            className="w-full text-left px-4 py-3 hover:bg-gray-700 text-white border-b border-gray-700 last:border-b-0 transition-colors"
                          >
                            <div className="font-medium">{dataset.name}</div>
                            <div className="text-sm text-gray-400">{dataset.records} records</div>
                          </button>
                        ) )}
                      </div>
                    )}
                  </div>
                   <button onClick={()=>setShowSheet(true)} className='bg-blue-500 px-6 py-2 text-white text-center rounded-[5px] cursor-pointer'>
                       Show Sheet 
                   </button>
                </div>

                {currentViewingDataset && (
                  <div className="text-sm text-gray-400">
                    <span>{currentViewingDataset.records} records</span>
                    <span className="mx-2">•</span>
                    <span>{availableColumns.length} columns</span>
                    <span className="mx-2">•</span>
                    <span>{generatedCharts.length} charts</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showAllCharts && generatedCharts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {generatedCharts.map( ( chart ) => (
                <div key={chart.id} className="bg-gray-800/50 min-w-[320px] min-h-[320px] backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{chart.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                        {chart.type}
                      </span>
                      <button
                        onClick={() => showChartDetail( chart )}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs px-3 py-1 rounded-lg transition-all duration-200 flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{chart.description}</p>
                  {renderChart( chart )}
                </div>
              ) )}
            </div>
          )}

          {/* Quick Preview Charts (Top 6) - Updated with View Details Button */}
          {!showAllCharts && generatedCharts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {generatedCharts.slice( 0, 6 ).map( ( chart ) => (
                <div key={chart.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{chart.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                        {chart.type}
                      </span>
                      <button
                        onClick={() => showChartDetail( chart )}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs px-3 py-1 rounded-lg transition-all duration-200 flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{chart.description}</p>
                  {renderChart( chart )}
                </div>
              ) )}
            </div>
          )}

          {!currentViewingDataset && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center mb-8">
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Dataset Selected</h3>
              <p className="text-gray-400">Select a dataset above to view its visualizations and data analysis.</p>
            </div>
          )}

          {generatedCharts.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Chart Analytics Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-gray-300">Bar Charts</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {generatedCharts.filter( c => c.type.includes( 'bar' ) || c.type === 'groupedBar' || c.type === 'multiBar' || c.type === 'summaryBar' ).length}
                  </p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <PieChartIcon className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-medium text-gray-300">Pie Charts</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {generatedCharts.filter( c => c.type === 'pie' ).length}
                  </p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium text-gray-300">Line/Area Charts</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {generatedCharts.filter( c => c.type === 'line' || c.type === 'area' ).length}
                  </p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    <span className="text-sm font-medium text-gray-300">Scatter Plots</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {generatedCharts.filter( c => c.type === 'scatter' ).length}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Your Datasets</h3>
                <button
                  onClick={fetchData}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-gray-300 font-medium">Dataset Name</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Source</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Records</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Columns</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Charts</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Last Updated</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {datasets.map( ( dataset ) => (
                    <tr
                      key={dataset.id}
                      className={`border-b border-gray-700 hover:bg-gray-700/30 transition-colors ${currentViewingDataset && currentViewingDataset.id === dataset.id ? 'bg-purple-500/10' : ''
                        }`}
                    >
                      <td className="p-4">
                        <div className="font-medium text-white">{dataset.name}</div>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${getSourceColor( dataset.source )}`}>
                          {getSourceIcon( dataset.source )}
                          <span className="capitalize">{dataset.source}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{dataset.records.toLocaleString()}</td>
                      <td className="p-4 text-gray-300">{dataset.columns.length}</td>
                      <td className="p-4 text-gray-300">
                        {currentViewingDataset && currentViewingDataset.id === dataset.id ? generatedCharts.length : '-'}
                      </td>
                      <td className="p-4 text-gray-300">{dataset.lastUpdated}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${dataset.status === 'active'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-orange-500/20 text-orange-300'
                          }`}>
                          {dataset.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDatasetSelection( dataset )}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                            title="Analyze Dataset"
                          >
                            <Activity className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRename( dataset )}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Rename Dataset"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete( dataset.id )}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Dataset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showRenameModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Rename Dataset</h3>
              <input
                type="text"
                value={newName}
                onChange={( e ) => setNewName( e.target.value )}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter new name"
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRenameModal( false )}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRename}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDetailModal && detailChart && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 whitespace-nowrap">
          <div className="bg-gray-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-scroll custom_scrollbar border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-white">{detailChart.title}</h2>
                <p className="text-gray-400 mt-1">{detailChart.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                    {detailChart.type}
                  </span>
                  <span className="text-xs text-gray-400 bg-blue-600 px-2 py-1 rounded">
                    Complete Dataset: {detailChartData.length} data points
                  </span>
                </div>
                {( detailChartData.length > 20 && detailChart.type === 'pie' ) && <p className='bg-amber-50 px-4 py-2 rounded-[4px] mt-4'>We show <span className='text-red-500'> only 20 {detailChart.title.slice( 0, -10 )} details in chart</span>, <span>more you can see in Table</span></p>}
              </div>
              <button
                onClick={() => setShowDetailModal( false )}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {detailChart.type === 'bar' && (
                  <>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Total Sum</h4>
                      <p className="text-xl font-bold text-white">{detailStats.total?.toFixed( 2 ) || 0}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Average</h4>
                      <p className="text-xl font-bold text-white">{detailStats.average?.toFixed( 2 ) || 0}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Maximum</h4>
                      <p className="text-xl font-bold text-white">{detailStats.maximum?.toFixed( 2 ) || 0}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Minimum</h4>
                      <p className="text-xl font-bold text-white">{detailStats.minimum?.toFixed( 2 ) || 0}</p>
                    </div>
                  </>
                )}

                {detailChart.type === 'pie' && (
                  <>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Total Categories</h4>
                      <p className="text-xl font-bold text-white">{detailStats.totalCategories || 0}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Total Records</h4>
                      <p className="text-xl font-bold text-white">{detailStats.totalRecords || 0}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Most Common</h4>
                      <p className="text-sm font-bold text-white truncate">{detailStats.mostCommon || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Diversity %</h4>
                      <p className="text-xl font-bold text-white">{detailStats.diversity || 0}%</p>
                    </div>
                  </>
                )}

                {detailChart.type === 'scatter' && (
                  <>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Correlation</h4>
                      <p className="text-xl font-bold text-white">{detailStats.correlation || 0}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Total Points</h4>
                      <p className="text-xl font-bold text-white">{detailStats.totalPoints || 0}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">X Range</h4>
                      <p className="text-sm font-bold text-white">
                        {detailStats.xStats?.min?.toFixed( 2 )} - {detailStats.xStats?.max?.toFixed( 2 )}
                      </p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Y Range</h4>
                      <p className="text-sm font-bold text-white">
                        {detailStats.yStats?.min?.toFixed( 2 )} - {detailStats.yStats?.max?.toFixed( 2 )}
                      </p>
                    </div>
                  </>
                )}

                {( detailChart.type === 'line' || detailChart.type === 'area' ) && (
                  <>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Trend</h4>
                      <p className="text-xl font-bold text-white">{detailStats.trend || 'Stable'}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Total Change</h4>
                      <p className="text-xl font-bold text-white">{detailStats.totalChange?.toFixed( 2 ) || 0}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Average Value</h4>
                      <p className="text-xl font-bold text-white">{detailStats.averageValue?.toFixed( 2 ) || 0}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Volatility</h4>
                      <p className="text-xl font-bold text-white">{detailStats.volatility || 0}</p>
                    </div>
                  </>
                )}

                {detailChart.type === 'groupedBar' && (
                  <>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Total Groups</h4>
                      <p className="text-xl font-bold text-white">{detailStats.totalGroups || 0}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Overall Total</h4>
                      <p className="text-xl font-bold text-white">{detailStats.overallTotal?.toFixed( 2 ) || 0}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Highest Group</h4>
                      <p className="text-sm font-bold text-white truncate">{detailStats.highestGroup || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Overall Average</h4>
                      <p className="text-xl font-bold text-white">{detailStats.overallAverage?.toFixed( 2 ) || 0}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-gray-700/30 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Complete Data Visualization</h3>
                <div className=''>
                  {renderChart( detailChart, true )}
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Raw Data Table</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-600 text-sm text-gray-300">
                    <thead>
                      <tr className="bg-gray-800 border-b border-gray-600">
                        {detailChartData.length > 0 &&
                          Object.keys( detailChartData[ 0 ] )?.filter(col => col !== 'color')?.map( ( col ) => (
                            <th key={col} className="px-4 py-2 text-left font-medium">
                              {col}
                            </th>
                          ) )}
                      </tr>
                    </thead>
                    <tbody>
                      {detailChartData.map( ( row, idx ) => (
                        <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                          {Object.entries( row )
                            .filter( ( [ key, value ] ) => key !== 'color' )
                            .map( ( [ key, value ], i ) => (
                              <td key={i} className="px-4 py-2">
                                {String( value )}
                              </td>
                            ) )
                          }
                        </tr>
                      ) )}
                    </tbody>
                  </table>
                </div>
              </div>


            </div>
          </div>
        </div>
      )}
          
    </>
     </>
   } 
    </> );
};

export default Dashboard;