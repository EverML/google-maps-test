var map;
var markers = [];
var infoWindow;
var locationSelect;

function initMap() {
    //@,,17z
    var ciudadDelEste = { 
        lat: -25.51334, 
        lng: -54.6140227 };
    map = new google.maps.Map(document.getElementById('map'), {
        center: ciudadDelEste,
        zoom: 11,
        mapTypeId: 'roadmap'
        //mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU }
    });
    infoWindow = new google.maps.InfoWindow();
    
    setOnClickListener();
    //showStoreMarkers();
    clearLocations();
}

function setOnClickListener(){
    var storeElements = document.querySelectorAll('.store-container');
    
    storeElements.forEach((element,index)=>{
        element.addEventListener('click',()=>{
            new google.maps.event.trigger(markers[index],'click');
        })
    });
}


function showStoreMarkers(stores){
    var bounds = new google.maps.LatLngBounds(); 
   stores.forEach((store,index)=>{

    var latlng = new google.maps.LatLng(store.coordinates.latitude,store.coordinates.longitude);
    var name = store.name;
    var [addres] = store.addressLines;

    createMarker(latlng,name,addres,index)
    bounds.extend(latlng);

   });
   map.fitBounds(bounds);

}

function createMarker(latlng, name, address,index) {
    var html = "<b>" + name + "</b> <br/>" + address;
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label: `${index+1}`,
    });

    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    
    markers.push(marker);
  }



function displayStores(stores){
    var storesHtml = '';

    stores.forEach((store,index)=>{

        var addressOne = store.addressLines[0];
        var addressTwo = store.addressLines[1];
        var phone  = store.phoneNumber;

        storesHtml += 
        `
        <div class="store-container">
        <div class="store-container-background">
            <div class="store-info-container">
                <div class="store-address">
                    <span>${addressOne}</span>
                    <span>${addressTwo}</span>
                </div>
                <div class="store-phone-number">
                    ${phone}
                </div>
            </div>
            <div class="store-number-container">
                <div class="store-number">
                   ${index+1}
                </div>
            </div>
        </div>
    </div> 
        
        `
    });
    document.querySelector('.store-list-container').classList.remove('hidden');
    document.querySelector('.store-list').innerHTML = storesHtml;
}


function searchStores(){
    
    var zipCode = document.getElementById('zip-code-input').value;
    var foundStores= [];
    if(zipCode){
        stores.forEach((store,index)=>{
            var postal = store.address.postalCode.substring(0,5);
            
            if(postal == zipCode)
            {
                foundStores.push(store);
            }
        });
    }else{
        foundStores = stores; 
    }
    
    clearLocations();
    displayStores(foundStores);
    showStoreMarkers(foundStores);
    setOnClickListener();
}


function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
  
    //locationSelect.innerHTML = "";
    var option = document.createElement("option");
    option.value = "none";
    option.innerHTML = "See all results:";
    //locationSelect.appendChild(option);
    //locationSelect.style.visibility = "visible";
  }