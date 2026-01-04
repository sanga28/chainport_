function compareVersions(oldV, newV) {

  let result = [];
  let risk = false;

  // Ports
  const addedPorts = newV.ports?.filter(p => !oldV.ports.includes(p)) || [];
  if(addedPorts.length) 
    result.push(`🟢 New ports opened: ${addedPorts.join(", ")}`);

  // Privilege
  if(!oldV.privileged && newV.privileged){
    result.push("⚠️ New privilege escalation detected");
    risk = true;
  }

  // Network
  const newDomains = newV.networkCalls?.filter(n => !oldV.networkCalls.includes(n)) || [];
  if(newDomains.length){
    result.push(`⚠️ New outbound network connections: ${newDomains.join(", ")}`);
    risk = true;
  }

  if(result.length === 0)
      result.push("No major behavioral drift detected");

  return {
    risk,
    changes: result
  };
}

module.exports = compareVersions;
