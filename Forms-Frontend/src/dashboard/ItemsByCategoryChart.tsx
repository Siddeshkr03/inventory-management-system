import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface CategorySummary {
  category: string;
  count: number;
}

interface ItemsByCategoryChartProps {
  data: CategorySummary[];
}

const ItemsByCategoryChart = ({ data }: ItemsByCategoryChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="category"
          tick={{ fontSize: 13 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis allowDecimals={false} axisLine={false} tickLine={false} />

        <Tooltip cursor={false} />

        <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={45}>
          {data.map((_, index) => (
            <Cell key={index} fill="#4CAF50" />
          ))}

          <LabelList dataKey="count" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ItemsByCategoryChart;
