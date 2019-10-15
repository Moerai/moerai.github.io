/**
 * 맵 컨트롤 script
 * 컨버전스스퀘어 제작
 */
document.write('<script type="text/javascript" src="/js/lib/proj4js/proj4js.js" charset="utf-8"></script>');
document.write('<script type="text/javascript" src="/js/lib/proj4js/projCode/merc.js" charset="utf-8"></script>');
document.write('<script type="text/javascript" src="/js/lib/proj4js/projCode/tmerc.js" charset="utf-8"></script>');
document.write("<script type='text/javascript' src='/js/OpenLayers.js' charset='utf-8'></script>");
document.write("<script type='text/javascript' src='/js/ngiiMap.js' charset='utf-8'></script>");
document.write("<script type='text/javascript' src='/js/KSICMap.js' charset='utf-8'></script>");
document.write("<script type='text/javascript' src='/js/koreaMobility.js' charset='utf-8'></script>");

// 전역변수
var roadData = null;
var mapkind = null;
var poiX = null;
var poiY = null;

// 맵 영역 안의 최소 최대 좌표 값
var minX = null;
var minY = null;
var maxX = null;
var maxY = null;
var courseId = null;

var initPoi = 1;

// 고도 데이터
var highData = null;
var poiGlobal = null;
var imgBike = null;

function bikeSetting() {
    imgBike = "bike";
    bikeCheck = "bike";
}

//
var userPoi = null;
var userPoiArr;

// 초기 데이터
function init(mapK, initData, map_agent, map_type, bike, courseId1) {
    courseId = courseId1;
    if (bike == "bike") {
        imgBike = "bike";
    } else {
        imgBike = "";
    }

    /*gpx 파일 경로 전달*/
    if (typeof initData != "undefined" && initData != "") {
        roadData = initData;
        pois = "";
    } else if (pois != null && pois == "true") {
        initPoiPoint(mapK, poiY, poiX, globalType);
        return;
    }

    mapkind = mapK;

    $("#mapChangeBtn").hide();
    $("#detail_poi").hide();
    $("#detail_pois").hide();


    poiBtnInit();
    loadChanges(map_agent, map_type);
}

//poi를 기준으로 맵 그릴때
var globalType = "";

function initPoiPoint(mapK, lat, lon, type) {
    pois = "true";

    /*gpx 파일 경로 전달*/
    mapkind = mapK;

    $("#mapChangeBtn").hide();
    $("#detail_poi").hide();
    $("#detail_pois").hide();

    poiY = lat;
    poiX = lon;
    globalType = type;

    poiBtnInit();
    if (mapkind == "daum") {
        daumPoiMapView(lat, lon, type);
    } else if (mapkind == "naver") {
        naverMapViewPoi(lat, lon, type);
    }
}

function loadChanges(map_agent, map_type) {
    var data = {
        param: roadData
    }

    $.ajax({
        url: "/travelRoad.do",
        type: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json; charset=utf8;",
        async: true,
        success: function (data) {

            var distance = data.distance;
            var zoom;

            if (distance < 3) {
                zoom = 11;
            } else if (3 <= distance && distance < 20) {
                zoom = 10;
            } else if (20 <= distance && distance < 40) {
                zoom = 9;
            } else if (40 <= distance && distance < 60) {
                zoom = 8;
            } else if (60 <= distance && distance < 80) {
                zoom = 7;
            } else {
                zoom = 6;
            }

            var floor = Math.floor(distance / 50);

            if (mapkind == "naver") {
                // naverMapView(data.road, data.mapX, data.mapY, zoom);
                // if(map_agent =="satellite"){
                naverMapView(data.road, data.mapX, data.mapY, zoom, map_agent, maxX, maxY, minX, minY);
                /*if(map_agent =="satellite"){

                    highMaps()
                // }
                }*/

                poiX = data.mapX;
                poiY = data.mapY;
                initPoi = 1;
            } else if (mapkind == "daum") {
                daumMapView(data.road, data.mapX, data.mapY, zoom, map_agent, data.minX, data.minY, data.maxX, data.maxY);
                poiX = data.mapX;
                poiY = data.mapY;
                initPoi = 1;
                highData = data;
                if (highData) {
                    try {
                        chartDraw_init();
                    } catch (e) {

                    }
                }
            } else {
                duruMapView();
                poiX = data.mapX;
                poiY = data.mapY;
                initPoi = 1;
            }

            poiValue();
        },
        error: function (e) {
            console.log(e);
        }
    });
}

// 사용자 poi 데이터를 일반 poi 데이터와 동일하게 내려줘야 함
function userPoivalue() {

    if (mapkind == "daum") {
// TODO
//console.log(getTrackingPoi())
//daumPoiView(data);
    } else if (mapkind == "naver") {
//console.log(getTrackingPoi())
//naverPoiView(data);
    } else {
//console.log(getTrackingPoi())
//duruPoiView(data);
    }
}

function poiValue(value) {
    if (initPoi == 1) {
        initPoi = 0;
        $.ajax({
            url: "api/poi/main",
            type: "GET",
            data: {
                "min_latitude": minY, "min_longitude": minX, "max_latitude": maxY, "max_longitude": maxX,
                "course_id": courseId
            },
            async: true,
            success: function (data) {
                if (mapkind == "daum") {
                    daumPoiView(data);
                    if (value == "13") {
                        if (imgBike == "bike") {
                            utilPlacePageInitPoi()
                        } else {
                            utilPlacePageInit();
                        }
                    }
                } else if (mapkind == "naver") {
                    naverPoiView(data);
                    if (value == "13") {
                        if (imgBike == "bike") {
                            utilPlacePageInitPoi()
                        } else {
                            utilPlacePageInit();
                        }
                    }
                } else {
                    duruPoiView(data);
                    if (value == "13") {
                        if (imgBike == "bike") {
                            utilPlacePageInitPoi()
                        } else {
                            utilPlacePageInit();
                        }
                    }
                }
            },
            error: function (e) {
                console.log(e);
            }
        });


    }
}

var nmap = null;

function naverMapView(road, x, y, zoom, mapType, maxX, maxY, minX, minY) {
    $("#map").html("");

    var settingPath = road;
    nmap = new naver.maps.Map('map', {});
    if (mapType == "satellite") {
        nmap.setMapTypeId(naver.maps.MapTypeId["SATELLITE"]);
    }

    // 	맵 기본 세팅값
    nmap.setCenter(new naver.maps.LatLng(y, x));
    nmap.setZoom(zoom);

    var polylines = [];

    for (var i = 0; i < settingPath.length; i++) {
        var linePath = new Array();
        var lineColor = "#ff3800";
        if (i == 1) {
            lineColor = "#0651fa";
        }
        for (var j = 0; j < settingPath[i].length; j++) {
            linePath.push(new naver.maps.LatLng(settingPath[i][j].lon, settingPath[i][j].lat));

        }
        var polyline = new naver.maps.Polyline({
            map: nmap,
            path: linePath,
            clickable: true,
            Async: true,
            strokeColor: lineColor,
            strokeWeight: 6
        });
        polylines.push(polyline);
    }

    var latlngBounds = new naver.maps.LatLngBounds(
        new naver.maps.LatLng(minY, minX),
        new naver.maps.LatLng(maxY, maxX)),
        latlngBoundsObject = {
            south: minY,
            west: minX,
            north: maxY,
            east: maxX
        };

    nmap.fitBounds(latlngBounds);
    nmap.setZoom(nmap.getZoom() + 1);

    var marker = new naver.maps.Marker({
        position: polylines[0].path._array[0],
        map: nmap,
        icon: {
            url: '/images/pointer_start.png',
            size: new naver.maps.Size(31, 41),
            scaledSize: new naver.maps.Size(31, 41),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(17, 40)
        }
    });

    var marker = new naver.maps.Marker({
        position: polylines[0].path._array[polylines[0].path.length - 1],
        map: nmap,
        icon: {
            url: '/images/pointer_end.png',
            size: new naver.maps.Size(31, 41),
            scaledSize: new naver.maps.Size(31, 41),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(17, 40)
        }
    });
}

function naverMapViewPoi(lat, lon, type, mapType) {
    $("#map").html("");

    nmap = new naver.maps.Map('map', {});
    if (mapType == "satellite") {
        nmap.setMapTypeId(naver.maps.MapTypeId["SATELLITE"]);
    }

    // 	맵 기본 세팅값
    nmap.setCenter(new naver.maps.LatLng(lat, lon));
    nmap.setZoom(13);


    var marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lon),
        map: nmap,
        icon: {
            url: '/images/poi_' + type + ".png",
            size: new naver.maps.Size(31, 41),
            scaledSize: new naver.maps.Size(31, 41),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(17, 40)
        }
    });


}

function naverPoiView(data) {

    var nPoiPath = [];
// 마커

    var markers = [];
    var infoWindows = [];

    poiGlobal = data.response;

    /*네이버 poi 그리기*/
    for (var i = 0; i < data.response.length; i++) {
        var marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(data.response[i].latitude, data.response[i].longitude),
            map: nmap,
            icon: {
                url: '/images/poi_' + data.response[i].type + ".png",
                size: new naver.maps.Size(28, 35),
                scaledSize: new naver.maps.Size(28, 35),
                origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(17, 30),
            }
        });
        markers.push(marker);

    }

    /*사용자 POI 추가*/

    /**/
    //사용자 POI 그리기

    if (userPoi != null) {
        for (var i = 0; i < userPoiArr.length; i++) {
            // console.log(userPoiArr[i].longitude);
            // console.log(userPoiArr[i].latitude);

            /*사용자 마커 타입에 따라 그림/메모/녹음 파일들 아이콘 그리기 진행*/
            var imageSrc = 'images/poi_picture.png';
            if (userPoiArr[i].type == 'PHOTO') {
                imageSrc = 'images/poi_picture.png';
            } else if (userPoiArr[i].type == 'MEMO') {
                imageSrc = 'images/poi_memo.png';
            } else if (userPoiArr[i].type == 'VOICE') {
                imageSrc = 'images/pointer_Recording.png';
            }

            // var imageSize = new daum.maps.Size(28, 35);
            // var imageOption = {offset: new daum.maps.Point(15, 45)};
            // var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption);

            /*마커 배열에 사용자 poi 추가*/
            // var marker = new daum.maps.Marker({
            //     map: kmap,
            //     position: new daum.maps.LatLng(userPoiArr[i].latitude, userPoiArr[i].longitude),
            //     image: markerImage
            // });
            // markers.push(marker);

            var marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(userPoiArr[i].latitude, userPoiArr[i].longitude),
                map: nmap,
                icon: {
                    url: imageSrc,
                    size: new naver.maps.Size(28, 35),
                    scaledSize: new naver.maps.Size(28, 35),
                    origin: new naver.maps.Point(0, 0),
                    anchor: new naver.maps.Point(17, 30),
                }
            });
            markers.push(marker);
        }

    }

    //console.log(markers);

    /*////사용자 POI 추가*/


// contentTypeId
// 12 관광지 / 14 문화시설 / 15 행사,공연,축제 / 25 여행코스 / 28 레포츠 / 32 숙박 / 38 쇼핑 / 39 음식점

    function detailInfo(seq) {
// 마커 클릭시 하나의 마커에 이벤트를 주려면 return function이 필수
        return function () {
// TODO function 호출

            /*선택된 마커의 seq 가 data.response.length 보다 클때 사용자 poi*/
            if (data.response.length - 1 < seq) {
                var temp = seq - (data.response.length - 1) - 1;
                // console.log(temp);
                /*사용자 POI 모달 팝업 호출 함수*/
                userPoiClickPageCall(userPoiArr[temp].type, temp);
            } else {
                /*주변정보 POI 모달 팝업 호출 함수*/
                poiClickPageCall(data.response[seq].type, seq);

            }
            // poiClickPageCall(data.response[seq].type, seq);
        }
    }

    for (var i = 0; i < markers.length; i++) {
        naver.maps.Event.addListener(markers[i], 'click', detailInfo(i))
    }

    setTimeout(function () {
        initToggle();
    }, 10);


}

var kmap = null;
var bounds = null

function daumMapView(road, x, y, zoom, map_agent, minX1, minY1, maxX1, maxY1) {

    $("#map").html("");

// 다음 지도
    var linePath = new Array();

    var poiPath = new Array();

    var settingPath = road;

    var polylines = [];

    bounds = new daum.maps.LatLngBounds();

    var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    var options = { //지도를 생성할 때 필요한 기본 옵션
        center: new daum.maps.LatLng(y, x), //지도의 중심좌표.
        level: zoom, //지도의 레벨(확대, 축소 정도)
    };

    kmap = new daum.maps.Map(container, options); //지도 생성 및 객체 리턴


    if (map_agent == 'MOBILE' && map_agent == 'footprint') {
        kmap.setDraggable(false);
    }

    var co = null


    for (var i = 0; i < settingPath.length; i++) {
// 다음 지도
        var linePath = new Array();
        var lineColor = "#ff3800";
        if (i == 1) {
            lineColor = "#0651fa";
        }
        for (var j = 0; j < settingPath[i].length; j++) {
            linePath.push(new daum.maps.LatLng(settingPath[i][j].lon, settingPath[i][j].lat));
            bounds.extend(new daum.maps.LatLng(settingPath[i][j].lon, settingPath[i][j].lat));
        }
// 라인
// 지도에 표시할 선을 생성합니다
        var polyline = new daum.maps.Polyline({
            path: linePath, // 선을 구성하는 좌표배열 입니다
            strokeWeight: 6, // 선의 두께 입니다
            strokeColor: lineColor, // 선의 색깔입니다
            strokeOpacity: 1.00, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        });
        polyline.setMap(kmap);


        polylines.push(polyline);
    }

    kmap.setBounds(bounds);

    /*S
    var bound = kmap.getBounds();


    var swLatLng = bound.getSouthWest();

    var neLatLng = bound.getNorthEast();


        minX = swLatLng.ib;
        minY = swLatLng.jb;

        maxX = neLatLng.ib;
        maxY = neLatLng.jb;*/

    //TODO : JH 기존 맵기준 POI 불러오기 제거
    minX = minX1;
    minY = minY1;
    maxX = maxX1;
    maxY = maxY1;

    var sImg = 'images/pointer_start.png';
    var eImg = 'images/pointer_end.png';
    var imageSize = new daum.maps.Size(31, 41); // 마커이미지의 크기입니다
    var imageOption = {offset: new daum.maps.Point(15, 45)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    var startMarkerImage = new daum.maps.MarkerImage(sImg, imageSize, imageOption);
    var endMarkerImage = new daum.maps.MarkerImage(eImg, imageSize, imageOption);

    if(polylines && polylines.length > 0){
        var marker = new daum.maps.Marker({
            position: polylines[0].Ig[0],
            map: kmap,
            image: startMarkerImage
        });

        var marker = new daum.maps.Marker({
            position: polylines[0].Ig[polylines[0].Ig.length - 1],
            map: kmap,
            image: endMarkerImage
        });
    }



}

function daumPoiMapView(lat, lon, type) {


    $("#map").html("");


    bounds = new daum.maps.LatLngBounds();

    var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    var options = { //지도를 생성할 때 필요한 기본 옵션
        center: new daum.maps.LatLng(lat, lon), //지도의 중심좌표.
        level: 1, //지도의 레벨(확대, 축소 정도)
    };

    kmap = new daum.maps.Map(container, options); //지도 생성 및 객체 리턴

    bounds.extend(new daum.maps.LatLng(lat, lon));

    var bound = kmap.getBounds();

    var swLatLng = bound.getSouthWest();

    var neLatLng = bound.getNorthEast();


    /*minX = swLatLng.ib;
    minY = swLatLng.jb;

    maxX = neLatLng.ib;
    maxY = neLatLng.jb;*/

    var sImg = "/images/poi_" + type + ".png";
    var imageSize = new daum.maps.Size(31, 41); // 마커이미지의 크기입니다
    var imageOption = {offset: new daum.maps.Point(15, 45)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    var startMarkerImage = new daum.maps.MarkerImage(sImg, imageSize, imageOption);

    var markerPosition = new daum.maps.LatLng(lat, lon);
    var marker = new daum.maps.Marker({
        position: markerPosition,
        map: kmap,
        image: startMarkerImage
    });
}

function daumPoiView(data) {

    var markers = [];

    poiGlobal = data.response;

    //console.log(poiGlobal);

    for (var i = 0; i < data.response.length; i++) {

        var imageSrc = '/images/poi_' + data.response[i].type + ".png"
        var imageSize = new daum.maps.Size(28, 35);
        var imageOption = {offset: new daum.maps.Point(15, 45)};
        var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption);

        var marker = new daum.maps.Marker({
            map: kmap,
            position: new daum.maps.LatLng(data.response[i].latitude, data.response[i].longitude),
            image: markerImage
        });

        markers.push(marker);
    }


    //사용자 POI 그리기

    if (userPoi != null) {
        for (var i = 0; i < userPoiArr.length; i++) {
            // console.log(userPoiArr[i].longitude);
            // console.log(userPoiArr[i].latitude);

            /*사용자 마커 타입에 따라 그림/메모/녹음 파일들 아이콘 그리기 진행*/
            var imageSrc = 'images/poi_picture.png';
            if (userPoiArr[i].type == 'PHOTO') {
                imageSrc = 'images/poi_picture.png';
            } else if (userPoiArr[i].type == 'MEMO') {
                imageSrc = 'images/poi_memo.png';
            } else if (userPoiArr[i].type == 'VOICE') {
                imageSrc = 'images/pointer_Recording.png';
            }

            var imageSize = new daum.maps.Size(28, 35);
            var imageOption = {offset: new daum.maps.Point(15, 45)};
            var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption);

            /*마커 배열에 사용자 poi 추가*/
            var marker = new daum.maps.Marker({
                map: kmap,
                position: new daum.maps.LatLng(userPoiArr[i].latitude, userPoiArr[i].longitude),
                image: markerImage
            });
            markers.push(marker);
        }

    }

    //console.log(markers);

    ////

    function detailInfo(seq) {
// 마커 클릭시 하나의 마커에 이벤트를 주려면 return function이 필수
        return function () {
            // TODO
            // function 추가
            //console.log(data.response.length-1,markers.length, seq);

            /*선택된 마커의 seq 가 data.response.length 보다 클때 사용자 poi*/
            if (data.response.length - 1 < seq) {
                var temp = seq - (data.response.length - 1) - 1;
                // console.log(temp);
                /*사용자 POI 모달 팝업 호출 함수*/
                userPoiClickPageCall(userPoiArr[temp].type, temp);
            } else {
                /*주변정보 POI 모달 팝업 호출 함수*/
                poiClickPageCall(data.response[seq].type, seq);

            }
        }
    }

    for (var i = 0; i < markers.length; i++) {
        daum.maps.event.addListener(markers[i], 'click', detailInfo(i))
    }

    initToggle();
}


var map1 = null;

function duruMapView() {

    $("#map").html("");


// 두루누비 솔루션 맵
    map1 = new KSIC('map', defaultBaseMapParameter());

    var aXid = new Array();
    var aCourseName = new Array();
    var aCrsIdx = new Array();

    aXid.push("15800");
    aCourseName.push("서울도보관광코스 선릉-봉은사");
    aCrsIdx.push("T_CRS_MNG0000000884");

    var layerNM = "WalkRoad_Line";

    var objParams = {aXid: aXid, aCourseName: aCourseName, aCrsIdx: aCrsIdx};

    map1.set_course(objParams, true, "listView", "map1", layerNM, true, roadData);

}

function duruPoiView(data) {


    $("#map").html("");

    var aXid = new Array();
    var aCourseName = new Array();
    var aCrsIdx = new Array();

    aXid.push("15800");
    aCourseName.push("서울도보관광코스 선릉-봉은사");
    aCrsIdx.push("T_CRS_MNG0000000884");

    var objParams = {aXid: aXid, aCourseName: aCourseName, aCrsIdx: aCrsIdx};

    var layerNM = "WalkRoad_Line";

    map1 = new KSIC('map', defaultBaseMapParameter());

    try {
        map1.set_course(objParams, false, "detailView", "map1", layerNM, true, roadData, data);
    } catch (e) {
        alert("[서울도보관광코스 선릉-봉은사] 주변정보를 불러오는데 실패하였습니다.");
        map1.set_course(objParams, false, "apiView", "map1", layerNM, true, roadData);
    }

    initToggle();

}

function poiBtnChange(poiValue, bike) {

    var attr = "";

    var bikeView = "";

    //console.log(imgBike);

    if (imgBike == "bike") {
        bikeView = "_B";
    } else {
        bikeView = "_G";
    }

    if ($("#allPoiView").is(":checked") == true) {
        $("#allPoiView").prop("checked", false);
    }

    if (mapkind == "duru") {
        attr = "href";
    } else {
        attr = "src";
    }


    if ($("#" + poiValue).attr('src') == '/images/' + poiValue + '_off.png') {
        $("#" + poiValue).attr('src', '/images/' + poiValue + bikeView + '.png')
        if (attr == "src") {
            $("[src='/images/" + poiValue + ".png']").show();
        } else {
            $("g image:odd[href='/images/" + poiValue + ".png']").show();
            $("g image:even[href='/images/" + poiValue + ".png']").show();
        }
    } else {
        $("#" + poiValue).attr('src', '/images/' + poiValue + '_off.png')

        if (attr == "src") {
            $("[" + attr + "='/images/" + poiValue + ".png']").hide();
        } else {
            $("g image:odd[href='/images/" + poiValue + ".png']").hide();
            $("g image:even[href='/images/" + poiValue + ".png']").hide();
        }
    }
}

function initToggle() {


    if (mapkind == "duru") {

        $("g image:odd[href='/images/poi_bikerent.png']").hide();
        $("g image:odd[href='/images/poi_store.png']").hide();
        $("g image:odd[href='/images/poi_toilet.png']").hide();
        $("g image:odd[href='/images/poi_tourist.png']").hide();
        $("g image:odd[href='/images/poi_water.png']").hide();

        $("g image:odd[href='/images/poi_touristSpots.png']").hide();
        $("g image:odd[href='/images/poi_accommodations.png']").hide();
        $("g image:odd[href='/images/poi_facilities.png']").hide();
        $("g image:odd[href='/images/poi_restaurant.png']").hide();
        $("g image:odd[href='/images/poi_etc.png']").hide();

        $("g image:odd[href='/images/poi_safetySection.png']").hide();
        $("g image:odd[href='/images/poi_cautionSection.png']").hide();
        $("g image:odd[href='/images/poi_Danger.png']").hide();
        $("g image:odd[href='/images/poi_necessariness.png']").hide();
        $("g image:odd[href='/images/poi_fork.png']").hide();


        $("g image:even[href='/images/poi_bikerent.png']").hide();
        $("g image:even[href='/images/poi_store.png']").hide();
        $("g image:even[href='/images/poi_toilet.png']").hide();
        $("g image:even[href='/images/poi_tourist.png']").hide();
        $("g image:even[href='/images/poi_water.png']").hide();

        $("g image:even[href='/images/poi_touristSpots.png']").hide();
        $("g image:even[href='/images/poi_accommodations.png']").hide();
        $("g image:even[href='/images/poi_facilities.png']").hide();
        $("g image:even[href='/images/poi_restaurant.png']").hide();
        $("g image:even[href='/images/poi_etc.png']").hide();

        $("g image:even[href='/images/poi_safetySection.png']").hide();
        $("g image:even[href='/images/poi_cautionSection.png']").hide();
        $("g image:even[href='/images/poi_Danger.png']").hide();
        $("g image:even[href='/images/poi_necessariness.png']").hide();
        $("g image:even[href='/images/poi_fork.png']").hide();

    } else {

        $("[src='/images/poi_bikerent.png']").hide();
        $("[src='/images/poi_store.png']").hide();
        $("[src='/images/poi_toilet.png']").hide();
        $("[src='/images/poi_touristSpots.png']").hide();
        $("[src='/images/poi_water.png']").hide();

        $("[src='/images/poi_touristSpots.png']").hide();
        $("[src='/images/poi_accommodations.png']").hide();
        $("[src='/images/poi_facilities.png']").hide();
        $("[src='/images/poi_restaurant.png']").hide();
        $("[src='/images/poi_etc.png']").hide();

        $("[src='/images/poi_safetySection.png']").hide();
        $("[src='/images/poi_cautionSection.png']").hide();
        $("[src='/images/poi_Danger.png']").hide();
        $("[src='/images/poi_necessariness.png']").hide();
        $("[src='/images/poi_fork.png']").hide();

    }
}

function allPoiShow() {


    if (mapkind == "duru") {

        $("g image:odd[href='/images/poi_bikerent.png']").show();
        $("g image:odd[href='/images/poi_store.png']").show();
        $("g image:odd[href='/images/poi_toilet.png']").show();
        $("g image:odd[href='/images/poi_tourist.png']").show();
        $("g image:odd[href='/images/poi_water.png']").show();
        $("g image:odd[href='/images/poi_touristSpots.png']").show();
        $("g image:odd[href='/images/poi_accommodations.png']").show();
        $("g image:odd[href='/images/poi_facilities.png']").show();
        $("g image:odd[href='/images/poi_restaurant.png']").show();
        $("g image:odd[href='/images/poi_etc.png']").show();
        $("g image:odd[href='/images/poi_safetySection.png']").show();
        $("g image:odd[href='/images/poi_cautionSection.png']").show();
        $("g image:odd[href='/images/poi_Danger.png']").show();
        $("g image:odd[href='/images/poi_necessariness.png']").show();
        $("g image:odd[href='/images/poi_fork.png']").show();

        $("g image:even[href='/images/poi_bikerent.png']").show();
        $("g image:even[href='/images/poi_store.png']").show();
        $("g image:even[href='/images/poi_toilet.png']").show();
        $("g image:even[href='/images/poi_tourist.png']").show();
        $("g image:even[href='/images/poi_water.png']").show();
        $("g image:even[href='/images/poi_touristSpots.png']").show();
        $("g image:even[href='/images/poi_accommodations.png']").show();
        $("g image:even[href='/images/poi_facilities.png']").show();
        $("g image:even[href='/images/poi_restaurant.png']").show();
        $("g image:even[href='/images/poi_etc.png']").show();
        $("g image:even[href='/images/poi_safetySection.png']").show();
        $("g image:even[href='/images/poi_cautionSection.png']").show();
        $("g image:even[href='/images/poi_Danger.png']").show();
        $("g image:even[href='/images/poi_necessariness.png']").show();
        $("g image:even[href='/images/poi_fork.png']").show();

    } else {


        $("[src='/images/poi_bikerent.png']").show();
        $("[src='/images/poi_store.png']").show();
        $("[src='/images/poi_toilet.png']").show();
        $("[src='/images/poi_touristSpots.png']").show();
        $("[src='/images/poi_water.png']").show();
        $("[src='/images/poi_touristSpots.png']").show();
        $("[src='/images/poi_accommodations.png']").show();
        $("[src='/images/poi_facilities.png']").show();
        $("[src='/images/poi_restaurant.png']").show();
        $("[src='/images/poi_etc.png']").show();
        $("[src='/images/poi_safetySection.png']").show();
        $("[src='/images/poi_cautionSection.png']").show();
        $("[src='/images/poi_Danger.png']").show();
        $("[src='/images/poi_necessariness.png']").show();
        $("[src='/images/poi_fork.png']").show();

    }
}

$(function () {


    $("#mapPlMi").click(function (e) {
        if (e.offsetY < 41) {

            if (mapkind == "daum") {
                var level = kmap.getLevel();
                kmap.setLevel(level - 1);
            } else if (mapkind == "naver") {
                nmap.setZoom(nmap.getZoom() + 1);
            } else {
                map1.duruZoom("plus");
            }

        } else {
            if (mapkind == "daum") {
                var level = kmap.getLevel();
                kmap.setLevel(level + 1);
            } else if (mapkind == "naver") {
                nmap.setZoom(nmap.getZoom() - 1);
            } else {
                map1.duruZoom("minus");
            }
        }
    });


});

function modalView() {

    setTimeout(function () {

        kmap.relayout();

        kmap.setCenter(new daum.maps.LatLng(poiY, poiX));

        kmap.setBounds(bounds);

        var bound = kmap.getBounds();

        var swLatLng = bound.getSouthWest();

        var neLatLng = bound.getNorthEast();


        minX = swLatLng.ib;
        minY = swLatLng.jb;

        maxX = neLatLng.ib;
        maxY = neLatLng.jb;

    }, 500);
}


function allPoiCheck() {

    $("#poi_toilet").attr("src", "images/poi_toilet_G.png");
    $("#poi_store").attr("src", "images/poi_store_G.png");
    $("#poi_tourist").attr("src", "images/poi_tourist_G.png");
    $("#poi_water").attr("src", "images/poi_water_G.png");
    $("#poi_bikerent").attr("src", "images/poi_bikerent_G.png");

    $("#poi_facilities").attr("src", "images/poi_facilities_G.png");
    $("#poi_touristSpots").attr("src", "images/poi_touristSpots_G.png");
    $("#poi_restaurant").attr("src", "images/poi_restaurant_G.png");
    $("#poi_accommodations").attr("src", "images/poi_accommodations_G.png");
    $("#poi_etc").attr("src", "images/poi_etc_G.png");

    $("#poi_fork").attr("src", "images/poi_fork_G.png");
    $("#poi_Danger").attr("src", "images/poi_Danger_G.png");
    $("#poi_cautionSection").attr("src", "images/poi_cautionSection_G.png");
    $("#poi_safetySection").attr("src", "images/poi_safetySection_G.png");
    $("#poi_necessariness").attr("src", "images/poi_necessariness_G.png");
}

function allPoiCheckBike() {

    $("#poi_toilet").attr("src", "images/poi_toilet_B.png");
    $("#poi_store").attr("src", "images/poi_store_B.png");
    $("#poi_tourist").attr("src", "images/poi_tourist_B.png");
    $("#poi_water").attr("src", "images/poi_water_B.png");
    $("#poi_bikerent").attr("src", "images/poi_bikerent_B.png");

    $("#poi_facilities").attr("src", "images/poi_facilities_B.png");
    $("#poi_touristSpots").attr("src", "images/poi_touristSpots_B.png");
    $("#poi_restaurant").attr("src", "images/poi_restaurant_B.png");
    $("#poi_accommodations").attr("src", "images/poi_accommodations_B.png");
    $("#poi_etc").attr("src", "images/poi_etc_B.png");

    $("#poi_fork").attr("src", "images/poi_fork_B.png");
    $("#poi_Danger").attr("src", "images/poi_Danger_B.png");
    $("#poi_cautionSection").attr("src", "images/poi_cautionSection_B.png");
    $("#poi_safetySection").attr("src", "images/poi_safetySection_B.png");
    $("#poi_necessariness").attr("src", "images/poi_necessariness_B.png");
}

function utilPlacePageInit() {


    $("#poi_toilet").attr("src", "images/poi_toilet_G.png");
    $("#poi_store").attr("src", "images/poi_store_G.png");
    $("#poi_tourist").attr("src", "images/poi_tourist_G.png");
    $("#poi_water").attr("src", "images/poi_water_G.png");
    $("#poi_bikerent").attr("src", "images/poi_bikerent_G.png");

    if (mapkind == "duru") {

        $("g image:odd[href='/images/poi_bikerent.png']").show();
        $("g image:odd[href='/images/poi_store.png']").show();
        $("g image:odd[href='/images/poi_toilet.png']").show();
        $("g image:odd[href='/images/poi_tourist.png']").show();
        $("g image:odd[href='/images/poi_water.png']").show();

        $("g image:even[href='/images/poi_bikerent.png']").show();
        $("g image:even[href='/images/poi_store.png']").show();
        $("g image:even[href='/images/poi_toilet.png']").show();
        $("g image:even[href='/images/poi_tourist.png']").show();
        $("g image:even[href='/images/poi_water.png']").show();


    } else {

        $("[src='/images/poi_bikerent.png']").show();
        $("[src='/images/poi_store.png']").show();
        $("[src='/images/poi_toilet.png']").show();
        $("[src='/images/poi_tourist.png']").show();
        $("[src='/images/poi_water.png']").show();

    }

}

function utilPlacePageInitPoi() {
    $("#poi_toilet").attr("src", "images/poi_toilet_B.png");
    $("#poi_store").attr("src", "images/poi_store_B.png");
    $("#poi_tourist").attr("src", "images/poi_tourist_B.png");
    $("#poi_water").attr("src", "images/poi_water_B.png");
    $("#poi_bikerent").attr("src", "images/poi_bikerent_B.png");

    if (mapkind == "duru") {

        $("g image:odd[href='/images/poi_bikerent.png']").show();
        $("g image:odd[href='/images/poi_store.png']").show();
        $("g image:odd[href='/images/poi_toilet.png']").show();
        $("g image:odd[href='/images/poi_tourist.png']").show();
        $("g image:odd[href='/images/poi_water.png']").show();

        $("g image:even[href='/images/poi_bikerent.png']").show();
        $("g image:even[href='/images/poi_store.png']").show();
        $("g image:even[href='/images/poi_toilet.png']").show();
        $("g image:even[href='/images/poi_tourist.png']").show();
        $("g image:even[href='/images/poi_water.png']").show();


    } else {

        $("[src='/images/poi_bikerent.png']").show();
        $("[src='/images/poi_store.png']").show();
        $("[src='/images/poi_toilet.png']").show();
        $("[src='/images/poi_tourist.png']").show();
        $("[src='/images/poi_water.png']").show();

    }
}

function highMaps() {


    nmap.setMapTypeId(naver.maps.MapTypeId["SATELLITE"]);
}

function showHighMap() {

    $("#highMaps").show();

}

function hideHighMap() {
    $("#selectType").val("normal");
    $("#highMaps").hide();
}

var modalCnt = 0;

function modalMap(pageValue) {


    if (modalCnt == 0) {
        $("#map").attr("id", "maps");

        if (pageValue == "13") {
            $("#detail_poi").remove();
            $("#mapChangeBtn").remove();
        } else {
            $("#detail_poi").remove();
            $("#mapChangeBtn").remove();
            $("#mapChangeBtn1").remove();
        }


        init("daum");

        modalView();
        modalCnt = 1;
    }
}


//TODO 고도값 전달
function highValue() {

    return highData;
}

