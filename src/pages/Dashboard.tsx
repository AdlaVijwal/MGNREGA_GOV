import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { District, MgnregaData } from "../types/database";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { districtId } = useParams<{ districtId: string }>();
  const [district, setDistrict] = useState<District | null>(null);
  const [data, setData] = useState<MgnregaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (districtId) {
      fetchDistrictData();
    }
  }, [districtId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps

  async function fetchDistrictData() {
    try {
      if (!districtId) return;

      // First get the district name from the ID
      const { data: mgnregaData, error: dataError } = await supabase
        .from("mgnrega_data")
        .select("*")
        .eq("district_name", districtId) // Using districtId directly as district name
        .order("fin_year", { ascending: true })
        .order("month", { ascending: true });

      if (dataError) throw dataError;

      // supabase response typing can be loose here; cast to our known type
      const rows = (mgnregaData ?? []) as MgnregaData[];
      setData(rows);

      // If we have data, set the district info
      if (rows.length > 0) {
        const first = rows[0];
        setDistrict({
          id: districtId,
          name: first.district_name,
          state: first.state_name,
          latitude: null,
          longitude: null,
          created_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-india-green"></div>
      </div>
    );
  }

  if (!district) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-xl text-gray-600">District not found</p>
        <Link
          to="/"
          className="text-india-green hover:underline mt-4 inline-block"
        >
          Go back to home
        </Link>
      </div>
    );
  }

  const latestData = data.length > 0 ? data[data.length - 1] : null;

  const chartData = data.map((d) => ({
    name: `${d.month} ${d.fin_year}`,
    personDays: d.Persondays_of_Central_Liability_so_far,
    households: d.Total_Households_Worked,
    expenditure: d.Total_Exp / 10000000, // Convert to crores
    wageRate: d.Average_Wage_rate_per_day_per_person,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/" className="text-india-green hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {district.name} District
        </h1>
        <p className="text-gray-600">{district.state}</p>
      </div>

      {data.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <p className="text-lg text-yellow-800 mb-2">No data available yet</p>
          <p className="text-yellow-700">
            Data for this district is being collected. Please check back later.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              title="Households Worked"
              value={
                latestData?.Total_Households_Worked.toLocaleString() || "0"
              }
              icon="🏠"
              description="Total households employed"
              tooltip="Number of households that received work under MGNREGA"
            />
            <MetricCard
              title="Person-Days"
              value={
                latestData?.Persondays_of_Central_Liability_so_far.toLocaleString() ||
                "0"
              }
              icon="👷"
              description="Employment generated"
              tooltip="Total days of work provided (1 person working 1 day = 1 person-day)"
            />
            <MetricCard
              title="Average Wage"
              value={`₹${
                latestData?.Average_Wage_rate_per_day_per_person.toFixed(2) ||
                "0"
              }`}
              icon="💵"
              description="Per day wage rate"
              tooltip="Average payment per day of work"
            />
            <MetricCard
              title="Women Participation"
              value={`${
                latestData
                  ? (
                      (latestData.Women_Persondays /
                        latestData.Persondays_of_Central_Liability_so_far) *
                      100
                    ).toFixed(1)
                  : "0"
              }%`}
              icon="👩"
              description="Female workers"
              tooltip="Percentage of women among total workers"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ChartCard
              title="Employment Trend"
              description="Person-days generated over time"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="personDays"
                    stroke="#138808"
                    strokeWidth={2}
                    name="Person-Days"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Household Participation"
              description="Number of households over time"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="households" fill="#FF9933" name="Households" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard
              title="Expenditure Trend"
              description="Total spending in Crores (₹)"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="expenditure"
                    stroke="#000080"
                    strokeWidth={2}
                    name="Expenditure (Cr)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Wage Rate Trend"
              description="Average daily wages (₹)"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="wageRate"
                    stroke="#FFB347"
                    strokeWidth={2}
                    name="Wage Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Understanding the Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <strong>Person-Days:</strong> If 100 people work for 10 days
                each, that equals 1,000 person-days.
              </div>
              <div>
                <strong>Households:</strong> Families who got employment
                opportunities in their area.
              </div>
              <div>
                <strong>Wage Rate:</strong> The amount paid to workers for each
                day of work completed.
              </div>
              <div>
                <strong>Women Participation:</strong> Shows how many women are
                benefiting from MGNREGA.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  description: string;
  tooltip: string;
}

function MetricCard({
  title,
  value,
  icon,
  description,
  tooltip,
}: MetricCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      title={tooltip}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      {children}
    </div>
  );
}
