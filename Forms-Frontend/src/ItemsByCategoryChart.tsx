import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CategorySummary {
  category: string;
  count: number;
}

interface ItemsByCategoryChartProps {
  data: CategorySummary[];
}

const ItemsByCategoryChart = ({
  data,
}: ItemsByCategoryChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 10,
          right: 20,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="category" />

        <YAxis allowDecimals={false} />

        <Tooltip />

        <Bar
          dataKey="count"
          fill="#4CAF50"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ItemsByCategoryChart;