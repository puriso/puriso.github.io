var map = undefined;
var gps_data = [];

$(function(){
  if( !navigator.geolocation ){
    alert("GPS非対応");
    return;
  }
   navigator.geolocation.watchPosition( success, error, option);
});

function success(position){
  var coords = position.coords;
  var lat = coords.latitude;
  var lng = coords.longitude;

  var Options = {
    zoom: 14,      //地図の縮尺値
    mapTypeId: 'roadmap',   //地図の種類
    center: new google.maps.LatLng(lat, lng),
  };
  if(map === undefined){
    map = new google.maps.Map(document.getElementById('map'), Options);
    console.log("Created google map");
  }
  new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map: map,
    draggable : true
  });
  var last = gps_data.length-1;

  if (gps_data[last] === undefined || gps_data[last][0] !== lat && gps_data[last][1] !== lng ){
    gps_data.push([lat, lng, new Date()]);
    console.log(gps_data[last+1]);
  }
}

function error(error){
  var errorMessage = {
    0: "原因不明のエラーが発生しました。",
    1: "位置情報が許可されませんでした。",
    2: "位置情報が取得できませんでした。",
    3: "タイムアウトしました。",
  } ;
  alert( errorMessage[error.code]);
}

// オプション(省略可)
var option = {
  "enableHighAccuracy": true,
  "timeout": 100 ,
  "maximumAge": 100 ,
} ;
