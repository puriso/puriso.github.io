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
    zoom: 18,      //地図の縮尺値
    mapTypeId: 'roadmap',   //地図の種類
    center: new google.maps.LatLng(lat, lng),
  };
  //makeMarker(map);
  if(map === undefined){
    map = new google.maps.Map(document.getElementById('map'), Options);
    console.log("Created google map");
  }
  var last = gps_data.length-1;

  gps_data.push( new google.maps.LatLng(lat, lng) );
  map.panTo(new google.maps.LatLng(lat, lng))

  if(gps_data.length > 2) {
    makeLine(map);
  }
  console.log(gps_data[last+1]);
}


function makeMarker(map){
  new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map: map,
    draggable : true,
    icon: {
      fillColor: "#87cefa",                //塗り潰し色
      fillOpacity: 0.8,                    //塗り潰し透過率
      path: google.maps.SymbolPath.CIRCLE, //円を指定
      scale: 3,                           //円のサイズ
      strokeColor: "#87cefa",              //枠の色
      strokeWeight: 1.0                    //枠の透過率
    },
  });
}
function makeLine(map){
  console.log("Created line");
  var path = new google.maps.Polyline({
    path: gps_data,
    strokeColor: "#87cefa",
    strokeOpacity: .8,
    strokeWeight: 8
  });
  path.setMap(map)
}

function makeRoute(map){
  console.log("Created route");
  var letlng = gps_data;
  letlng.shift();
  letlng.pop();
  var request = {
    origin: gps_data[0]['location'], // 出発地
    destination: gps_data[gps_data.length-1]['location'], // 目的地
    waypoints: letlng,
    travelMode: google.maps.DirectionsTravelMode.WALKING, // 交通手段(歩行。DRIVINGの場合は車)
  };
  var d = new google.maps.DirectionsService(); // ルート検索オブジェクト
  var r = new google.maps.DirectionsRenderer({ // ルート描画オブジェクト
    map: map, // 描画先の地図
    suppressMarkers: true,
    preserveViewport: true, // 描画後に中心点をずらさない
  });
  d.route(request, function(result, status){
    // OKの場合ルート描画
    if (status == google.maps.DirectionsStatus.OK) {
      r.setDirections(result);
    }
  });
}

function rr(){
  var request = {
    origin: new google.maps.LatLng(35.681382,139.766084), // 出発地
    destination: new google.maps.LatLng(34.73348,135.500109), // 目的地
    waypoints: [ // 経由地点(指定なしでも可)
      { location: new google.maps.LatLng(35.630152,139.74044) },
      { location: new google.maps.LatLng(35.507456,139.617585) },
      { location: new google.maps.LatLng(35.25642,139.154904) },
      { location: new google.maps.LatLng(35.103217,139.07776) },
      { location: new google.maps.LatLng(35.127152,138.910627) },
      { location: new google.maps.LatLng(35.142365,138.663199) },
      { location: new google.maps.LatLng(34.97171,138.38884) },
      { location: new google.maps.LatLng(34.769758,138.014928) },
    ],
    travelMode: google.maps.DirectionsTravelMode.WALKING, // 交通手段(歩行。DRIVINGの場合は車)
  };

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
  "enableHighAccuracy": false,
  "timeout": 1500 ,
  "maximumAge": 100 ,
} ;
