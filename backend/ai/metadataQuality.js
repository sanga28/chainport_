function evaluateMetadata(metadata){

  let score = 0;
  let feedback = [];

  if(metadata.name){ score+=10; }
  else feedback.push("Name missing");

  if(metadata.description){ score+=20; }
  else feedback.push("Description missing");

  if(metadata.version){ score+=15; }
  else feedback.push("Version missing");

  if(metadata.checksum){ score+=30; }
  else feedback.push("Checksum missing");

  if(metadata.runtime){ score+=25; }
  else feedback.push("Runtime details missing");

  return {
    score,
    grade: score > 80 ? "A" : score > 60 ? "B" : "C",
    feedback
  };
}

module.exports = evaluateMetadata;
