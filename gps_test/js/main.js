var map = undefined;
var gps_data = [];
var polylines = [];
var center_marker;
var start = false;
var gps_id;
var markers = [];
var km = 0;
var flash_message = false;
var start_count = 0;

$(function(){
  flashMessage("Welcome! Version 0.1b");
  if( !navigator.geolocation ){
    alert("GPS非対応");
    return;
  }

  $('.btnBox__btn').on('click',function(){
    if(start === false){
      start = true;
      start_count += 1;
      flashMessage("Start logging!");
      if(start_count === 1) init();
      if(start_count > 1) secondInit();
      $('.btnBox__btn').addClass("btnBox__btn--stop").text("STOP");
      $('.btnBox__btn').parent().addClass("btnBox--stop");
      gps_data = [];
      km = 0;
      gps_id = navigator.geolocation.watchPosition( success, error, option);
    }else{
      flashMessage("Stop logging.");
      start = false;
      navigator.geolocation.clearWatch(gps_id);
      if(gps_data.length > 0){
        var last = gps_data.length-1;
        lat = gps_data[last].lat();
        lng = gps_data[last].lng();
        makeFlagMarker(map, lat, lng, "red");
        var markerBounds = new google.maps.LatLngBounds();
      }
      $('.btnBox__btn').removeClass("btnBox__btn--stop").text("START");
      $('.btnBox__btn').parent().removeClass("btnBox--stop");
      fitMap();
    }
  });
});

function init(){
  $('.blackBg').remove();
}

function secondInit(){
  console.log("start count = " + start_count);
  clearMarkers();
  clearPolylines();
}

function success(position){
  var coords = position.coords;
  var lat = coords.latitude;
  var lng = coords.longitude;

  var Options = {
    zoom: 18,      //地図の縮尺値
    mapTypeId: 'roadmap',   //地図の種類
    center: new google.maps.LatLng(lat, lng),
    mapTypeControl: false, //マップタイプ コントロール
    fullscreenControl: false, //全画面表示コントロール
    streetViewControl: false, //ストリートビュー コントロール
    zoomControl: false, //ズーム コントロール
  };
  if(map === undefined){
    map = new google.maps.Map(document.getElementById('map'), Options);
    console.log("Created google map");
  }
  if(gps_data.length === 0){
    map.setZoom(18);
    makeFlagMarker(map, lat, lng, "yellow")
  }
  makeCenerMarker(map, lat, lng);

  gps_data.push(new google.maps.LatLng(lat, lng));
  map.panTo(new google.maps.LatLng(lat, lng));

  if(gps_data.length > 2) {
    makeLine(map);
    var last = gps_data.length-1;
    //km += Math.abs( Math.abs( gps_data[last-1]) - Math.abs(gps_data[last]) ) / 1000;
    //$(".kmBox").show().text(km + " km");
  }
}


function makeCenerMarker(map, lat, lng){
  console.log("Created marker");
  if(center_marker !== undefined){
    center_marker.setMap(null);
  }
  center_marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map: map,
    icon: {
      fillColor: "#0066CC",                //塗り潰し色
      fillOpacity: 0.8,                    //塗り潰し透過率
      path: google.maps.SymbolPath.CIRCLE, //円を指定
      scale: 16,                           //円のサイズ
      strokeColor: "white",              //枠の色
      strokeWeight: 1.0                 //枠の透過率
    },
  });
}

function makeFlagMarker(map, lat, lng, color="yellow"){
  console.log("Created flag");
  var image ={
    url : './images/'+ color + '_flag.png',
    scaledSize : new google.maps.Size(40, 40)
  }
  markers.push(new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map: map,
    draggable : true,
    icon: image,
    scaledSize : new google.maps.Size(16, 16)
  }));
}

function makeLine(map){
  console.log("Created line");
  if (gps_data.length % 10 === 0){
    polylines.setMap(null);
  }
  polylines = new google.maps.Polyline({
    path: gps_data,
    strokeColor: "#87cefa",
    strokeOpacity: .8,
    strokeWeight: 16
  });
  polylines.setMap(map)
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

function fitMap(){
  var minX = gps_data[0].lng();
  var minY = gps_data[0].lat();
  var maxX = gps_data[0].lng();;
  var maxY = gps_data[0].lat();;
  for(var i=0; i<gps_data.length; ++i){
    var lt = gps_data[i].lat();
    var lg = gps_data[i].lng();
    if (lg <= minX){ minX = lg; }
    if (lg > maxX){ maxX = lg; }
    if (lt <= minY){ minY = lt; }
    if (lt > maxY){ maxY = lt; }
  }
  var sw = new google.maps.LatLng(maxY, minX);
  var ne = new google.maps.LatLng(minY, maxX);
  var bounds = new google.maps.LatLngBounds(sw, ne);
  map.fitBounds(bounds);
}

function lat_m(n){
  return 0.000008983148616 * n
}

function lng_m(n){
  return 0.000010966382364 * n
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

function setMapOnAllPolylines(map) {
  for (var i = 0; i < polylines.length; i++) {
    polylines[i].setMap(map);
  }
}

function clearPolylines() {
  setMapOnAllPolylines(null);
}

function flashMessage(m){
  var date = new Date();
  var class_name = "flashMessage--" + date.getMinutes() + date.getSeconds();
  var element =  "." + class_name;

  $("#flashMessages").append('<div class="flashMessage ' + class_name + '"><div class="flashMessage__text"></div>');
  $(element).fadeIn("slow");
  $(element + " .flashMessage__text").text(m);
  setTimeout(function(){
    $(element + " .flashMessage__text").fadeOut("slow",function(){
      $(element).remove();
    })
  },3000);
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
  "timeout": 3500 ,
  "maximumAge": 100 ,
} ;
