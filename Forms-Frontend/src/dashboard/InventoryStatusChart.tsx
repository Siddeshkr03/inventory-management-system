import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Label,
} from "recharts";

interface InventoryStatusChartProps {
  inStock: number;
  lowStock: number;
  outOfStock: number;
  preOrder: number;
}

interface InventoryStatusChartProps {
  inStock: number;
  lowStock: number;
  outOfStock: number;
  preOrder: number;
  totalItems: number;
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
  totalItems,
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
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label
            value="Total Items"
            position="center"
            dy={-15}
            style={{
              fontSize: "14px",
              fill: "#666",
              fontWeight: 500,
            }}
          />

          <Label
            value={totalItems}
            position="center"
            dy={15}
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              fill: "#2E7D32",
            }}
          />
        </Pie>

        <Tooltip formatter={(value) => [`${value} Items`, "Count"]} />

        <Legend
          verticalAlign="bottom"
          align="center"
          iconType="square"
          wrapperStyle={{
            paddingTop: "15px",
            fontSize: "14px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default InventoryStatusChart;
