if( navigator.geolocation ){// 現在位置を取得できる場合の処理
  navigator.geolocation.getCurrentPosition( success, error, option);
}
function success(position){

}
/*現在位置の取得に失敗した時に実行*/
function error(error){
  var errorMessage = {
    0: "原因不明のエラーが発生しました。",
    1: "位置情報が許可されませんでした。",
    2: "位置情報が取得できませんでした。",
    3: "タイムアウトしました。",
  } ;
  //とりあえずalert
  alert( errorMessage[error.code]);
}
$(function(){
// オプション(省略可)
var option = {
"enableHighAccuracy": false,
"timeout": 100 ,
"maximumAge": 100 ,
} ;

var MyLatLng = new google.maps.LatLng(35.6811673, 139.7670516);
var Options = {
  zoom: 15,      //地図の縮尺値
  center: MyLatLng,    //地図の中心座標
  mapTypeId: 'roadmap'   //地図の種類
};
var map = new google.maps.Map(document.getElementById('map'), Options);
}
