// frontend/src/services/ipfs.js

const IPFS_SERVICE_URL = "http://localhost:4000";

export async function uploadContainerMetadata({
  containerName,
  version,
  imageHash,
  description,
  owner,
}) {
  const res = await fetch(`${IPFS_SERVICE_URL}/upload-metadata`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      containerName,
      version,
      imageHash,
      description,
      owner,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "IPFS upload failed");
  }

  // { success, cid, metadataUri, gatewayUrl }
  return res.json();
}
