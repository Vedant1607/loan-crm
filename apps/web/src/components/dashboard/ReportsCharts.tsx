"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";

interface MonthlyData {
  label:       string;
  applications: number;
  approved:    number;
  disbursed:   number;
}

export default function ReportsCharts({ data }: { data: MonthlyData[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <p className="text-sm font-semibold text-slate-700 mb-4">
          Application Volume (Total vs Approved)
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="applications" name="Total Applications" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="approved" name="Approved" fill="#16a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <p className="text-sm font-semibold text-slate-700 mb-4">
          Amount Disbursed (₹)
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="disbursedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
            />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}
              formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Disbursed"]}
            />
            <Area
              type="monotone"
              dataKey="disbursed"
              stroke="#16a34a"
              strokeWidth={2}
              fill="url(#disbursedFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}