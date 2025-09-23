
interface SystemInfoProps {
  system_info: {
    hostname: string;
    platform: string;
    python_version: string;
    timestamp: string;
    environment: {
      port: number;
    };
  };
}

export default function SystemInfo({ system_info }: SystemInfoProps) {
  return (
    <div className="card">
      <h2>📊 System Information</h2>
      <div className="system-info">
        <p><strong>Server:</strong> {system_info.hostname}</p>
        <p><strong>Platform:</strong> {system_info.platform}</p>
        <p><strong>Python Version:</strong> {system_info.python_version}</p>
        <p><strong>Timestamp:</strong> {system_info.timestamp}</p>
        <p><strong>Port:</strong> {system_info.environment.port}</p>
      </div>
    </div>
  );
}
