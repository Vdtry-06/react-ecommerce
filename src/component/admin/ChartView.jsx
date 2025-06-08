import React, { useEffect, useState } from "react";
import { Card, Tabs, Typography, Spin, Alert } from "antd";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSearchParams } from "react-router-dom";
import ApiService from "../../service/ApiService";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const { Title: AntTitle } = Typography;

const ChartView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    hourlyOrders: new Array(24).fill(0),
    hourlyCustomers: new Array(24).fill(0),
    dailyOrders: [],
    dailyCustomers: [],
  });

  const activeTab = searchParams.get("tab") || "hourly-orders";

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "hourly-orders" });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const ordersResponse = await ApiService.Order.getAllOrders();
        const orders = ordersResponse.data || [];

        // Calculate chart data
        const hourlyOrderCounts = new Array(24).fill(0);
        const hourlyCustomerSets = Array.from({ length: 24 }, () => new Set());
        const dailyOrderCounts = {};
        const dailyCustomerSets = {};

        orders.forEach((order) => {
          if (order.status === "PAID" && order.createdDate) {
            const date = new Date(order.createdDate);
            const hour = date.getHours();
            const day = date.toISOString().split("T")[0];

            // Hourly data
            hourlyOrderCounts[hour] += 1;
            hourlyCustomerSets[hour].add(order.userId);

            // Daily data
            dailyOrderCounts[day] = (dailyOrderCounts[day] || 0) + 1;
            dailyCustomerSets[day] = dailyCustomerSets[day] || new Set();
            dailyCustomerSets[day].add(order.userId);
          }
        });

        const sortedDays = Object.keys(dailyOrderCounts).sort();
        setChartData({
          hourlyOrders: hourlyOrderCounts,
          hourlyCustomers: hourlyCustomerSets.map((set) => set.size),
          dailyOrders: sortedDays.map((day) => ({
            day,
            count: dailyOrderCounts[day],
          })),
          dailyCustomers: sortedDays.map((day) => ({
            day,
            count: dailyCustomerSets[day].size,
          })),
        });
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi tải dữ liệu biểu đồ!");
        console.error("Error fetching chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const hourlyOrderChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
    datasets: [
      {
        label: "Số đơn hàng",
        data: chartData.hourlyOrders,
        backgroundColor: "#1890ff",
        borderColor: "#1890ff",
        borderWidth: 1,
      },
    ],
  };

  const hourlyCustomerChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
    datasets: [
      {
        label: "Số khách hàng",
        data: chartData.hourlyCustomers,
        backgroundColor: "#52c41a",
        borderColor: "#52c41a",
        borderWidth: 1,
      },
    ],
  };

  const dailyOrderChartData = {
    labels: chartData.dailyOrders.map((d) => d.day.slice(5)), // MM-DD
    datasets: [
      {
        label: "Số đơn hàng",
        data: chartData.dailyOrders.map((d) => d.count),
        backgroundColor: [
          "#1890ff",
          "#52c41a",
          "#f5222d",
          "#fa8c16",
          "#722ed1",
          "#13c2c2",
          "#eb2f96",
        ],
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const dailyCustomerChartData = {
    labels: chartData.dailyCustomers.map((d) => d.day.slice(5)), // MM-DD
    datasets: [
      {
        label: "Số khách hàng",
        data: chartData.dailyCustomers.map((d) => d.count),
        backgroundColor: [
          "#1890ff",
          "#52c41a",
          "#f5222d",
          "#fa8c16",
          "#722ed1",
          "#13c2c2",
          "#eb2f96",
        ],
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: (context) =>
            context.chart.data.datasets[0].label.includes("khách")
              ? "Số lượng khách hàng"
              : "Số lượng đơn hàng",
        },
      },
      x: {
        title: {
          display: true,
          text: "Giờ trong ngày",
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
  };

  const items = [
    {
      key: "hourly-orders",
      label: "Đơn hàng theo giờ",
      children: (
        <Card>
          <div style={{ height: 400 }}>
            <Bar data={hourlyOrderChartData} options={barChartOptions} />
          </div>
        </Card>
      ),
    },
    {
      key: "daily-orders",
      label: "Đơn hàng theo ngày",
      children: (
        <Card>
          <div style={{ height: 400 }}>
            <Pie data={dailyOrderChartData} options={pieChartOptions} />
          </div>
        </Card>
      ),
    },
    {
      key: "hourly-customers",
      label: "Khách hàng theo giờ",
      children: (
        <Card>
          <div style={{ height: 400 }}>
            <Bar data={hourlyCustomerChartData} options={barChartOptions} />
          </div>
        </Card>
      ),
    },
    {
      key: "daily-customers",
      label: "Khách hàng theo ngày",
      children: (
        <Card>
          <div style={{ height: 400 }}>
            <Pie data={dailyCustomerChartData} options={pieChartOptions} />
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div>
      <AntTitle level={2} style={{ marginBottom: 24 }}>
        Phân tích dữ liệu
      </AntTitle>
      {loading ? (
        <Spin tip="Đang tải dữ liệu biểu đồ..." />
      ) : error ? (
        <Alert message="Lỗi" description={error} type="error" showIcon />
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setSearchParams({ tab: key })}
          items={items}
        />
      )}
    </div>
  );
};

export default ChartView;