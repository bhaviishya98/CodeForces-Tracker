import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const RatingGraph = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-muted-foreground">No rating data available.</p>;
  }

  return (
    <div>
      <h3 className="md:text-lg font-semibold mb-2">Solved Problems by Rating</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="rating"
            label={{ value: "Rating", position: "bottom", offset: 2 }}
            tickFormatter={(val) => `${val}`}
          />
          <YAxis
            label={{ value: "Count", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value) => [value, "Problems"]}
            labelFormatter={(label) => `Rating: ${label}`}
          />
          <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingGraph;
