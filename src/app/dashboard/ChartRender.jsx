import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  AreaChart,
  PieChart,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
  Area,
  Pie,
  Cell,
  Scatter
} from 'recharts';

const ShowCharts = ({ 
  chart, 
  isDetailed = false, 
  detailChartData = null, 
  colorPalettes
}) => {
  const renderChart = (chart, isDetailed = false) => {
    const colors = colorPalettes.primary;
    const data = isDetailed ? detailChartData : chart.data;

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
              <Bar dataKey="average" fill={colors[4]} />
              {isDetailed && <Bar dataKey="total" fill={colors[1]} />}
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
              {(chart.columns || []).map((col, index) => (
                <Bar key={col} dataKey={col} fill={colors[index % colors.length]} />
              ))}
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
              <Bar dataKey="average" fill={colors[0]} />
              <Bar dataKey="maximum" fill={colors[1]} />
              <Bar dataKey="minimum" fill={colors[2]} />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="text-gray-400">Chart type not supported</div>;
    }
  };

  return (
    <div className="w-full">
      {renderChart(chart, isDetailed)}
    </div>
  );
};

export default ShowCharts;