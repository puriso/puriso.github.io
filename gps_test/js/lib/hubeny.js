//
// ヒュベニの公式
// https://tech-blog.s-yoshiki.com/2018/05/92/
//
function hubeny(lat1, lng1, lat2, lng2) {
    function rad(deg) {
        return deg * Math.PI / 180;
    }
    //degree to radian
    lat1 = rad(lat1);
    lng1 = rad(lng1);
    lat2 = rad(lat2);
    lng2 = rad(lng2);

    // 緯度差
    var latDiff = lat1 - lat2;
    // 経度差算
    var lngDiff = lng1 - lng2;
    // 平均緯度
    var latAvg = (lat1 + lat2) / 2.0;
    // 赤道半径
    var a = 6378137.0;
    // 極半径
    var b = 6356752.314140356;
    // 第一離心率^2
    var e2 = 0.00669438002301188;
    // 赤道上の子午線曲率半径
    var a1e2 = 6335439.32708317;

    var sinLat = Math.sin(latAvg);
    var W2 = 1.0 - e2 * (sinLat * sinLat);

    // 子午線曲率半径M
    var M = a1e2 / (Math.sqrt(W2) * W2);
    // 卯酉線曲率半径
    var N = a / Math.sqrt(W2);

    t1 = M * latDiff;
    t2 = N * Math.cos(latAvg) * lngDiff;
    return Math.sqrt((t1 * t1) + (t2 * t2));
}
