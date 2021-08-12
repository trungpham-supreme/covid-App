const mapboxToken = 'pk.eyJ1IjoiaWNvbmljODgiLCJhIjoiY2tvanVqanY0MWZsdjJvcDFleGpqeGdibCJ9.kc3FDCSzAfNeldMSRCXStg';
var list_country = [];
const getCasesColor = count =>{
  if(count >= 100000){
    return "red";
  }
  if(count >= 20000){
    return "blue";
  }
  return "gray";

}

mapboxgl.accessToken = mapboxToken;
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/dark-v10',
zoom: 2.5
});
  
fetch('https://www.trackcorona.live/api/countries')
.then(response => response.json())
.then(data =>{ 
  const db = data.data;
  console.log(db);
  db.forEach((country)=>{
     new mapboxgl.Marker( {color: getCasesColor(country.confirmed)}).setLngLat([country.longitude,country.latitude]).addTo(map);
    console.log(country.latitude,country.longitude);
  });
});
