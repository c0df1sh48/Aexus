function formatSpeed(bytes){

if(bytes < 1024){

return bytes.toFixed(2)+" B/s";

}

else if(bytes < 1024 * 1024){

return (bytes / 1024).toFixed(2)+" KB/s";

}

else if(bytes < 1024 * 1024 * 1024){

return (bytes / 1024 / 1024).toFixed(2)+" MB/s";

}

else{

return (bytes / 1024 / 1024 / 1024).toFixed(2)+" GB/s";

}

}



async function updateSystem(){

try{

const response =
await fetch("/api/system");


const data =
await response.json();



// =====================
// CPU
// =====================

const cpu =
document.getElementById("cpuUsage");

if(cpu){

cpu.textContent =
data.cpu+"%";

}


const cpuBar =
document.getElementById("systemCPUBar");

if(cpuBar){

cpuBar.style.width =
Math.min(data.cpu,100)+"%";

}
const homeCPU =
document.getElementById("homeCPU");

if(homeCPU){

homeCPU.textContent =
data.cpu+"%";

}


const homeCPUBar =
document.getElementById("homeCPUBar");

if(homeCPUBar){

homeCPUBar.style.width =
data.cpu+"%";

}



// =====================
// MEMORY
// =====================

const memory =
document.getElementById("memoryUsage");

if(memory){

memory.textContent =
`${data.memory.used}/${data.memory.total} GB`;

}



const memoryBar =
document.getElementById("systemMemoryBar");

if(memoryBar){

memoryBar.style.width =
(data.memory.used / data.memory.total * 100)+"%";

}
const homeMemory =
document.getElementById("homeMemory");

if(homeMemory){

homeMemory.textContent =
`${data.memory.used}/${data.memory.total} GB`;

}


const homeMemoryBar =
document.getElementById("homeMemoryBar");

if(homeMemoryBar){

homeMemoryBar.style.width =
(data.memory.used / data.memory.total * 100)+"%";

}



// =====================
// STORAGE
// =====================

const storage =
document.getElementById("storageUsage");

if(storage){

storage.textContent =
`${data.storage.used}/${data.storage.total} GB`;

}



const storageBar =
document.getElementById("systemStorageBar");

if(storageBar){

storageBar.style.width =
(data.storage.used / data.storage.total * 100)+"%";

}

const homeStorage =
document.getElementById("homeStorage");

if(homeStorage){

homeStorage.textContent =
`${data.storage.used}/${data.storage.total} GB`;

}


const homeStorageBar =
document.getElementById("homeStorageBar");

if(homeStorageBar){

homeStorageBar.style.width =
(data.storage.used / data.storage.total * 100)+"%";

}


// =====================
// IP ADDRESS
// =====================

const ip =
document.getElementById("serverIP");

if(ip){

ip.textContent =
data.ip;

}




// =====================
// CPU TEMPERATURE
// =====================

const temp =
document.getElementById("cpuTemp");

if(temp){

if(data.temperature == 0){

temp.textContent =
"N/A";

}else{

temp.textContent =
data.temperature+"°C";

}

}




// =====================
// NETWORK
// =====================

const network =
document.getElementById("networkSpeed");

if(network){

network.textContent =
`${formatSpeed(data.network.download * 1024)} ↓ ${formatSpeed(data.network.upload * 1024)} ↑`;

}



const networkBar =
document.getElementById("networkBar");

if(networkBar){

// Your API is returning KB/s
// Convert to bytes before calculating

const downloadBytes =
data.network.download * 1024;


const uploadBytes =
data.network.upload * 1024;


const totalNetwork =
downloadBytes + uploadBytes;


// 1Gbps connection limit
const networkPercent =
Math.min(
(totalNetwork / 125000000) * 100,
100
);


networkBar.style.width =
networkPercent+"%";

}






// =====================
// SYSTEM LOAD
// =====================

const load =
document.getElementById("systemLoad");

if(load){

load.textContent =
data.load+"%";

}



const loadBar =
document.getElementById("systemLoadBar");

if(loadBar){

loadBar.style.width =
Math.min(data.load,100)+"%";

}






// =====================
// HOSTNAME
// =====================

const hostname =
document.getElementById("serverName");

if(hostname){

hostname.textContent =
data.hostname;

}






// =====================
// OS
// =====================

const os =
document.getElementById("serverOS");

if(os){

os.textContent =
data.platform;

}



}catch(error){

console.error(
"System update error:",
error
);

}

}



setInterval(
updateSystem,
5000
);



updateSystem();