let iptext = document.querySelector('#iptext');
let city = document.querySelector('#city');
let timing = document.querySelector('#time');
let ipagent = document.querySelector('#provider');
let input = document.querySelector('.input');
let btn = document.querySelector('.link');
let geoboard = document.querySelector('.geoboard');
let maparea = document.getElementById("map");

// Initializing the map 
const map = L.map(maparea);
L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=N4EBv7wtDu1eO9ldXsbk',{attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'}).addTo(map);
const marker = L.marker([0, 0]).addTo(map);

// display at initial page load
window.addEventListener('load', getUser);


function getUser(){

    // getting the client's ip and sending a request to the server
    fetch('https://api.ipify.org/?format=json')
    .then((res) =>  res.json())
    .then((res) => {
        let doy = res.ip;
        const request = fetch(`/resource/${doy}`);
        request.then((reply) => reply.json())
                    .then((details) => {
                        
                        // manipulating the DOM with response from the server
                        iptext.textContent = details.ip;
                        city.textContent = details.location.region + " " + details.location.postalCode;
                        timing.textContent = "UTC" + details.location.timezone;
                        ipagent.textContent = details.isp; 
                            
                        map.setView([details.location.lat, details.location.lng],8);
                        marker.setLatLng([details.location.lat, details.location.lng]);               
                        
                    })
    });

    
}

       

// function to test and validate IP Address
function ipValidation(ipaddress) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)){  
      return true;
    }   
    return false;
  }  



// getting and searching the user's search input
btn.addEventListener('click', test);
function test(e){
    e.preventDefault();
    
    // Validating user's search if it is an IP and updating the DOM with the details
    let ipSearch = input.value.trim();

    if(ipValidation(ipSearch)){
        fetch(`/resource/${ipSearch}`)
        .then((reply) => reply.json())
        .then((data) => {
            iptext.textContent = data.ip;
            city.textContent = data.location.region + " " + data.location.postalCode;
            timing.textContent = "UTC" + data.location.timezone;
            ipagent.textContent = data.isp;

            map.setView([data.location.lat, data.location.lng],8);
            marker.setLatLng([data.location.lat, data.location.lng]);
        })  

    }else{
        // if user's search is not a valid IP

        geoboard.innerHTML = `
                                <h1>Invalid IP Address</h1> 
                            `;

        map.setView([0, 0],1);
        marker.setLatLng([0, 0]);
    }

}