import { useNavigate } from "react-router-dom";

export default function ContainerCard({ data }) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="card-title">{data.name}</div>

      <div className="card-text">
        <b>Version:</b> {data.version}
      </div>

      <div className="card-text">
        <b>Owner:</b>{" "}
        {data.owner.substring(0, 6)}...{data.owner.slice(-4)}
      </div>

      <div className="card-text" style={{ opacity: 0.8, marginBottom: "12px" }}>
        This container is registered on-chain with immutable metadata. Deployment
        requests are subject to ownership rules and network availability.
      </div>

      <button
        onClick={() =>
          navigate("/deployservice", {
            state: {
              tokenId: data.tokenId,
              name: data.name,
              version: data.version,
              imageHash: data.imageHash,
              owner: data.owner,
              cid: data.cid,
            },
          })
        }
      >
        Request Deployment
      </button>
    </div>
  );
}
