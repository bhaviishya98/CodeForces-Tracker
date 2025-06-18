import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

const SubmissionHeatmap = ({ heatmapData }) => {
  // Transform heatmapData to match required format: [{ date: 'YYYY-MM-DD', count: number }]
  const values = Object.entries(heatmapData || {}).map(([date, count]) => ({
    date,
    count,
  }));

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 90); // Show last 90 days

  return (
    <div className="mt-8 heatmap-container">
      <h3 className="text-lg font-semibold mb-2">Submission Heatmap</h3>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        classForValue={(value) => {
          if (!value || value.count === 0) return "color-empty";
          if (value.count <= 2) return "color-scale-1";
          if (value.count <= 4) return "color-scale-2";
          if (value.count <= 6) return "color-scale-3";
          return "color-scale-4";
        }}
        tooltipDataAttrs={(value) =>
          value.date
            ? {
                "data-tip": `${value.date}: ${value.count} submissions`,
              }
            : {}
        }
        showWeekdayLabels
        className="w-64 h-64"
      />
    </div>
  );
};

export default SubmissionHeatmap;
