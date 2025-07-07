import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { getTopSongs, getTopUsers } from '../api';
export default function Dashboard(){
  ChartJS.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip, Title)
  const [topSongsData, setTopSongsData] = useState([])
  const [topUsersData, setTopUsersData] = useState([])
  async function getChartdata(){
    const songs = await getTopSongs()
    setTopSongsData(songs)
    const users = await getTopUsers()
    setTopUsersData(users)
  }
  useEffect(() => {
    getChartdata()
  })
  const songsProcessedData = {
    labels: topSongsData.map((item) => item.title),
    datasets: [{
      label: 'Number of saves',
      data: topSongsData.map((item) => item._count.savedBy),
       backgroundColor: 'rgba(7, 7, 7, 0.88)',
       borderColor: 'rgb(16, 16, 16)',
       borderWidth: 1,
    }]
  }
  const usersProcessedData = {
    labels: topUsersData.map((item) => item.username),
    datasets: [{
      label: 'Number of saved songs',
      data: topUsersData.map((item) => item._count.savedSongs),
        backgroundColor: 'rgba(7, 7, 7, 0.88)',
        borderColor: 'rgb(16, 16, 16)',
        borderWidth: 1,
    }]
  }
  ChartJS.defaults.font.size = 20
  const songsOptions = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            enabled: true,
            text: 'Top 10 most saved songs🔥',
            color: 'black',
            position: 'top',
            font: {size: 30, weight: 'bold'}
          },
        },
      };
  const usersOptions = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Most active users ⭐️',
            color: 'black',
            position: 'top',
            font: {size: 30, weight: 'bold'},
          },
        },
      };
  return(
    <>
      <div className='dashboard'>
        <h1>Dashboard</h1>
        <div className='bar-chart'>
          <Bar style={{padding: '1.5rem', width: '50rem', height: '80rem'}}data={songsProcessedData} options={songsOptions}/>
          <Bar style={{padding: '1.5rem', width: '50rem', height: '80rem'}}data={usersProcessedData} options={usersOptions}/>
        </div>
      </div>
    </>
  )
}