import { useParams } from "react-router-dom";

const Site = () => {
  const siteId = useParams().siteId;

  return (
    <div>
      <h1>Site</h1>
      <p>Site ID: {siteId}</p>
    </div>
  );
};

export default Site;
