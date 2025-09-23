import { useState, useEffect } from 'react'
import './App.css'
import SystemInfo from "./components/SystemInfo";
import RahtiFeatures from './components/RahtiFeatures';
import ApiDemo from './components/ApiDemo';
import UsefulLinks from './components/UsefulLinks';
import MyPage from './components/MyPage';

interface SystemInfoType {
  hostname: string;
  platform: string;
  python_version: string;
  timestamp: string;
  environment: {
    user: string;
    home: string;
    path: string;
    port: number;
  };
}

interface ApiItem {
  id: number;
  name: string;
  value: number;
}

interface ApiData {
  message: string;
  data: ApiItem[];
  timestamp: string;
  server: string;
}

/*const testApiData: ApiData = {
        message: 'Welcome to CSC Rahti Demo Application by Anniina!',
        data: [
            {'id': 1, 'name': 'First Item', 'value': 42},
            {'id': 2, 'name': 'Second Item', 'value': 84},
            {'id': 3, 'name': 'Third Item', 'value': 126}
        ],
        timestamp: new Date().toISOString(), // JS/TS tapa
        server: 'localhost' 
    }*/

export default function App() {

  const [showMyPage, setShowMyPage] = useState(false);
  const [systemInfo, setSystemInfo] = useState<SystemInfoType | null>(null);
  const [apiData, setApiData] = useState<ApiData | null>(null);


  // get system info from backend
   useEffect(() => {
    fetch ('/info')
      .then(res => res.json())
      .then(data => setSystemInfo(data))
      .catch(err => console.error('Failed to fetch system info:', err));
  }, []);

  useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(data => setApiData(data))
    .catch(err => console.error('Failed to fetch API data:', err));
}, []);

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        {showMyPage ? (
          <>
        <h1>My custom page</h1>
            <p>Welcome! This is is my custom SPA page for CSC's Rahti container platform.</p>
            <button className="button" onClick={() => setShowMyPage(false)}>
              Back to main page
            </button>
          </>
        ) : (
          <>
            <h1>🚀 CSC Rahti Demo Application</h1>
            <p>Welcome! This is a demo application for CSC's Rahti container platform.</p>
            <button className="button" onClick={() => setShowMyPage(true)}>
              Open my custom page
            </button>
          </>
        )}
      </div>
       {/* Page content */}
      {showMyPage ? (
        <div className="content">
          <MyPage/>
        </div>
      ) : (
        <div className="content">
          {systemInfo && <SystemInfo system_info={systemInfo}/>}
          <RahtiFeatures />
          {apiData && <ApiDemo api_data={apiData}/>}
          <UsefulLinks />
        </div>
      )}

      <div className="footer">
        <p>
          Application running on CSC's <a href="https://docs.csc.fi/cloud/rahti/" target="_blank">Rahti</a> platform.
          <br />
          More information: <a href="https://docs.csc.fi/" target="_blank">docs.csc.fi</a>
        </p>
      </div>
    </div>
  );
}
