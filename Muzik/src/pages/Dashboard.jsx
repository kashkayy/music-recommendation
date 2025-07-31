import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getTopSongs, getTopUsers } from "../api";
import { useAuth } from "../auth/AuthContext";
import { reverseGeocoder } from "../utils/reverseGeocode";
import { Notify } from "../utils/toast";
import { ROLE } from "../admin/AdminSections";
export default function Dashboard() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Legend,
    Tooltip,
    Title
  );
  const [topSongsData, setTopSongsData] = useState([]);
  const [topUsersData, setTopUsersData] = useState([]);
  const [regionName, setRegionName] = useState(null);
  const { region, user } = useAuth();
  useEffect(() => {
    async function getChartdata() {
      try {
        const songs = await getTopSongs();
        setTopSongsData(songs);
        const users = await getTopUsers();
        setTopUsersData(users);
      } catch (error) {
        Notify();
        setTopSongsData([]);
        setTopUsersData([]);
      }
    }
    getChartdata();
    async function getRegionName() {
      try {
        const name = await reverseGeocoder(region);
        setRegionName(name);
      } catch (error) {
        setRegionName("Unknown");
      }
    }
    getRegionName();
  }, [region]);
  const songsProcessedData = {
    labels: topSongsData.map((item) => item.title),
    datasets: [
      {
        label: "Number of saves",
        data: topSongsData.map((item) => item.saves),
        backgroundColor: "rgba(7, 7, 7, 0.88)",
        borderColor: "rgb(16, 16, 16)",
        borderWidth: 1,
      },
    ],
  };
  const usersProcessedData = {
    labels: topUsersData.map((item) => item.username),
    datasets: [
      {
        label: "Number of saved songs",
        data: topUsersData.map((item) => item.savedSongs),
        backgroundColor: "rgba(7, 7, 7, 0.88)",
        borderColor: "rgb(16, 16, 16)",
        borderWidth: 1,
      },
    ],
  };
  ChartJS.defaults.font.size = 20;
  const songsOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        enabled: true,
        text: "Top 10 most saved songs🔥",
        color: "black",
        position: "top",
        font: { size: 30, weight: "bold" },
      },
    },
  };
  const usersOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Most active users ⭐️",
        color: "black",
        position: "top",
        font: { size: 30, weight: "bold" },
      },
    },
  };
  return (
    <>
      <div className="dashboard">
        {user.role === ROLE.globalAdmin ? (
          <h1>Dashboard for Entire Map</h1>
        ) : (
          <h1>Dashboard for {regionName}</h1>
        )}
        <div className="bar-chart">
          <Bar
            style={{ padding: "1.5rem", width: "50rem", height: "80rem" }}
            data={songsProcessedData}
            options={songsOptions}
          />
          <Bar
            style={{ padding: "1.5rem", width: "50rem", height: "80rem" }}
            data={usersProcessedData}
            options={usersOptions}
          />
        </div>
      </div>
    </>
  );
}
