import { PieLabelRenderProps } from "recharts";

const RADIAN = Math.PI / 180;

export default function StatusPercentage({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) {
  if (!percent || percent === 0 || midAngle === undefined) return null;

  const inner = typeof innerRadius === "number" ? innerRadius : 0;
  const outer = typeof outerRadius === "number" ? outerRadius : 0;
  const radius = inner + (outer - inner) * 0.5;

  const centerX = typeof cx === "number" ? cx : 0;
  const centerY = typeof cy === "number" ? cy : 0;

  const x = centerX + radius * Math.cos(-midAngle * RADIAN);
  const y = centerY + radius * Math.sin(-midAngle * RADIAN);

  const percentageText = `${(percent * 100).toFixed(0)}%`;

  return (
    <g>
      {/* Background */}
      <rect
        x={x - 16}
        y={y - 10}
        width={32}
        height={20}
        rx={6}
        fill="#f4f4f5"
      />

      {/* Text */}
      <text
        x={x}
        y={y}
        fill="#18181b"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {percentageText}
      </text>
    </g>
  );
}
