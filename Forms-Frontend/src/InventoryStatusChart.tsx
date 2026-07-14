import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface InventoryStatusChartProps {
  inStock: number;
  lowStock: number;
  outOfStock: number;
  preOrder: number;
}

const COLORS = [
  "#4CAF50", // In Stock
  "#FFC107", // Low Stock
  "#F44336", // Out Of Stock
  "#2196F3", // Pre-order
];

const InventoryStatusChart = ({
  inStock,
  lowStock,
  outOfStock,
  preOrder,
}: InventoryStatusChartProps) => {
  const data = [
    { name: "In Stock", value: inStock },
    { name: "Low Stock", value: lowStock },
    { name: "Out Of Stock", value: outOfStock },
    { name: "Pre-order", value: preOrder },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={95}
          paddingAngle={3}
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />

        <Legend
          verticalAlign="bottom"
          height={36}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default InventoryStatusChart;