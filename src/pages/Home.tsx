import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { District } from "../types/database";

export default function Home() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDistricts();
    detectUserLocation();
  }, []);

  async function fetchDistricts() {
    try {
      // Get unique districts from mgnrega_data table
      const { data, error } = await supabase
        .from("mgnrega_data")
        .select("district_name, state_name")
        .order("district_name");

      if (error) throw error;

      // Convert to District type and remove duplicates
      const typedData = data as
        | { district_name: string; state_name: string }[]
        | null;
      const uniqueDistricts = Array.from(
        new Set(typedData?.map((d) => d.district_name) || [])
      ).map((name) => ({
        id: name, // Using district name as ID
        name: name,
        state:
          typedData?.find((d) => d.district_name === name)?.state_name ||
          "Telangana",
        latitude: null,
        longitude: null,
        created_at: new Date().toISOString(),
      }));

      setDistricts(uniqueDistricts);
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoading(false);
    }
  }

  function detectUserLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const nearestDistrict = findNearestDistrict(latitude, longitude);
          if (nearestDistrict) {
            setUserLocation(nearestDistrict.name);
            setSelectedDistrict(nearestDistrict.id);
          }
        },
        () => {
          console.log("Location access denied");
        }
      );
    }
  }

  function findNearestDistrict(lat: number, lng: number): District | null {
    if (districts.length === 0) return null;

    let nearest = districts[0];
    let minDistance = Infinity;

    districts.forEach((district) => {
      if (district.latitude && district.longitude) {
        const distance = Math.sqrt(
          Math.pow(district.latitude - lat, 2) +
            Math.pow(district.longitude - lng, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearest = district;
        }
      }
    });

    return nearest;
  }

  function handleViewDashboard() {
    if (selectedDistrict) {
      navigate(`/dashboard/${encodeURIComponent(selectedDistrict)}`);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-india-green"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="w-2 h-16 bg-saffron rounded"></div>
          <div className="w-2 h-16 bg-white border-2 border-gray-300 mx-1 rounded"></div>
          <div className="w-2 h-16 bg-india-green rounded"></div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Our Voice, Our Rights
        </h1>
        <p className="text-xl text-gray-700 mb-2">
          See how your district is performing in MGNREGA
        </p>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          Track employment generation, wages, and welfare schemes in your area.
          Transparency for everyone, everywhere.
        </p>
      </div>

      {userLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
          <p className="text-blue-800 text-center">
            <span className="font-semibold">Detected location:</span>{" "}
            {userLocation} District
          </p>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <label
            htmlFor="district"
            className="block text-lg font-semibold text-gray-900 mb-4"
          >
            Select Your District
          </label>
          <select
            id="district"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-india-green focus:border-transparent outline-none transition-all"
          >
            <option value="">Choose a district...</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleViewDashboard}
            disabled={!selectedDistrict}
            className="w-full mt-6 px-6 py-4 bg-india-green text-white text-lg font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
          >
            View My District
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">💼</div>
            <h3 className="font-semibold text-gray-900 mb-1">Employment</h3>
            <p className="text-sm text-gray-600">Track person-days generated</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold text-gray-900 mb-1">Wages</h3>
            <p className="text-sm text-gray-600">Monitor average wage rates</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-semibold text-gray-900 mb-1">Participation</h3>
            <p className="text-sm text-gray-600">See women participation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
