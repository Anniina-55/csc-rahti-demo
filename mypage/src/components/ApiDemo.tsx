import {useState} from "react"

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

interface ApiDemoProps {
  api_data: ApiData | null;
}

export default function ApiDemo({api_data} : ApiDemoProps) {
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApiData = () => {
    setLoading(true);
    setError(null);

    fetch ("/api/data")
      .then((res) => res.json())
      .then((data) => {
        setApiData(api_data);
        console.log("Fetched data:", data)
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch API data");
        setLoading(false);
      });
  };

  return (
    <div className="card">
      <h2>🌐 API Demo</h2>
      <p>Test the application's API endpoint:</p>
      <button className="button" onClick={fetchApiData}>
        Fetch API Data
      </button>

      {loading && <p style={{marginTop: "10px"}}>Loading...</p>}
      {error && <p style={{ color: "red", marginTop: "10px"}}>{error}</p>}

      {apiData && (
        <div className="api-result">
          <p><strong>{apiData.message}</strong></p>
          <p style={{ marginTop: "10px"}}> <span style={{fontWeight: "bold" }}> Server: </span>{apiData.server}</p>
          <p style={{marginTop: "5px", fontWeight: "bold"}}>Timestamp: </p> <p style={{marginBottom: "15px"}}>{apiData.timestamp}
          </p>
          <ul>
            {apiData.data.map((item) => (
              <li key={item.id}>
                {item.name}: {item.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}




/*export default function ApiDemo({api_data}: ApiDemoProps) {
  if (!api_data) return <p>No API data yet.</p>;

  return (
    <div className="card">
      <h2>🌐 API Demo</h2>
      <ul>
        {api_data.data.map(item => (
          <li key={item.id}>{item.name}: {item.value}</li>
        ))}
      </ul>
    </div>
  );
}*/
