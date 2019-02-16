if( navigator.geolocation ){// 現在位置を取得できる場合の処理
  navigator.geolocation.getCurrentPosition( success, error, option);
}
function success(position){

}

var MyLatLng = new google.maps.LatLng(35.6811673, 139.7670516);
var Options = {
 zoom: 15,      //地図の縮尺値
 center: MyLatLng,    //地図の中心座標
 mapTypeId: 'roadmap'   //地図の種類
};
var map = new google.maps.Map(document.getElementById('map'), Options);
