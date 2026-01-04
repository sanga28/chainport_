import ContainerDNA from "./ContainerDNA";

export default function DNACompare({ before, after }) {
  return (
    <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
      <div>
        <p style={{ textAlign: "center", opacity: 0.7 }}>Before</p>
        <ContainerDNA metadata={before} />
      </div>

      <div style={{ fontSize: 24, opacity: 0.6 }}>→</div>

      <div>
        <p style={{ textAlign: "center", opacity: 0.7 }}>After</p>
        <ContainerDNA metadata={after} />
      </div>
    </div>
  );
}
