import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { MonthlyAverage, getMaxPrice } from '@/utils/dataProcessing';
import { City, FuelType } from '@/data/fuelPrices';

interface FuelChartProps {
  data: MonthlyAverage[];
  city: City;
  fuelType: FuelType;
  year: number;
}

// Define colors directly for ECharts (Canvas API can't parse CSS variables)
const CHART_COLORS = {
  petrol: {
    main: '#f97316', // orange-500
    light: '#fb923c', // orange-400
    dark: '#c2410c', // orange-700
  },
  diesel: {
    main: '#0ea5e9', // sky-500
    light: '#38bdf8', // sky-400
    dark: '#0369a1', // sky-700
  },
};

const FuelChart = ({ data, city, fuelType, year }: FuelChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const maxPrice = getMaxPrice(data);
    const isPetrol = fuelType === 'Petrol';
    const colors = isPetrol ? CHART_COLORS.petrol : CHART_COLORS.diesel;

    // Chart configuration
    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: `Monthly Average ${fuelType} Price - ${city} (${year})`,
        left: 'center',
        top: 16,
        textStyle: {
          color: '#1e293b',
          fontSize: 18,
          fontWeight: 600,
          fontFamily: 'inherit',
        },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        textStyle: {
          color: '#1e293b',
          fontFamily: 'inherit',
        },
        formatter: (params: unknown) => {
          const paramData = (params as { name: string; value: number }[])[0];
          return `<div style="font-weight: 500">${paramData.name} ${year}</div>
                  <div style="font-size: 18px; font-weight: 700; color: ${colors.main}">
                    ₹${paramData.value.toFixed(2)}/L
                  </div>`;
        },
      },
      grid: {
        left: 60,
        right: 40,
        top: 80,
        bottom: 60,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        data: data.map((d) => d.month),
        axisLine: {
          lineStyle: {
            color: '#e2e8f0',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#64748b',
          fontSize: 12,
          fontFamily: 'inherit',
          margin: 12,
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: maxPrice,
        interval: 20,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#64748b',
          fontSize: 12,
          fontFamily: 'inherit',
          formatter: (value: number) => `₹${value}`,
        },
        splitLine: {
          lineStyle: {
            color: '#e2e8f0',
            type: 'dashed',
            opacity: 0.5,
          },
        },
      },
      series: [
        {
          name: fuelType,
          type: 'bar',
          data: data.map((d) => d.average),
          barWidth: '60%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors.main },
              { offset: 1, color: colors.dark },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colors.light },
                { offset: 1, color: colors.main },
              ]),
            },
          },
          animationDuration: 800,
          animationEasing: 'cubicOut',
        },
      ],
    };

    chartInstance.current.setOption(option, true);

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, city, fuelType, year]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      className="w-full h-[400px] md:h-[500px]"
      aria-label={`Bar chart showing monthly average ${fuelType} prices in ${city} for ${year}`}
    />
  );
};

export default FuelChart;
