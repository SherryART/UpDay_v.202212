app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});

app.directive('exportToCsv',function() {
  	return {
    	restrict: 'A',
    	link: function (scope, element, attrs) {
    		var el = element[0];
	        element.bind('click', function(e){
	        	var table = e.target.nextElementSibling;
				var csvString = "Name, Email, Phone, Session, Attend, Source, Medium, Campaign, Key, Remark\n";
				for (var i=0; i<scope.EventDetailAry.length; i++)
				{
					var name = "\""+ scope.EventDetailAry[i].Name + "\",";
					var email = "\""+ scope.EventDetailAry[i].Email + "\",";
					var phone = "\""+ scope.EventDetailAry[i].Phone + "\",";
					var eventSession = "\""+ scope.EventDetailAry[i].EventSession + "\",";
					var numOfAttendee = "\""+ scope.EventDetailAry[i].NumOfAttendee + "\",";
					var utmSource = "\""+ scope.EventDetailAry[i].UtmSource + "\",";
					var utmMedium = "\""+ scope.EventDetailAry[i].UtmMedium + "\",";
					var utmCampaign = "\""+ scope.EventDetailAry[i].UtmCampaign + "\",";
					var utmTerm = "\""+ scope.EventDetailAry[i].UtmTerm + "\",";
					var remark = "\""+ scope.EventDetailAry[i].Remark + "\"";
					csvString = csvString + name + email + phone + eventSession + numOfAttendee + utmSource + utmMedium + utmCampaign + utmTerm + remark + "\n";
				}
	         	csvString = csvString.substring(0, csvString.length - 1);
	         	var a = $('<a/>', {
					style:'display:none',
					template: '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
		            href:'data:application/vnd.ms-excel;base64,'+btoa(unescape(encodeURIComponent(csvString))),
		            download:'eventAttend.csv'
		        }).appendTo('body')
		        a[0].click()
		        a.remove();
	        });
    	}
  	}
});

//Thomas for Home index 熱門物件　要到資料後每五個分一組　在跑兩層ng repeat (repeat class= row then inside data repaet)
function SliceAndGroupArray(input, count = 5) {
    
        var out = [];
       
        // console.log(input.length);
        if (typeof input === "object") {
            for (var i = 0, j = input.length; i < j; i += count) {
                out.push(input.slice(i, i + count));
            }
        }
    $.each(out, function (index, value) {
        // console.log(value+'see');        
        while (value.length < 5) {
            value.push([]);
        }       
    });

        return out;
    
};

app.controller('homeCtrl', function ($scope, $timeout, $sce) {
	// angular.element(document).ready(function () {
	// 	$('#article-carousel').owlCarousel({
	// 		navigation : true, // Show next and prev buttons
	// 		slideSpeed : 300,
	// 		paginationSpeed : 400,
	// 		singleItem: true			
	// 		// loop: true,
	// 		// margin: 10,
	// 		// responsiveClass: true,
	// 		// responsive: {
	// 		// 	0: {items: 1, nav: true},
	// 		// 	600: {items: 1, nav: true},
	// 		// 	1000: {items: 2, nav: true,	loop: false}
	// 		// }
	// 	})
	// });
	   
    $scope.Rows = null;
	$scope.RecipientArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

	$scope.Investmentypes = [];
	$scope.Locationtypes = [];
	$scope.AllPopularRealestates = [];//熱門
	$scope.PopularRealestates = [];//熱門
	$scope.NewArrivalHouses = [];
    $scope.Realestatetypes = [];
	$scope.PromotionalAds = [];
	$scope.NewsAds = [];
	$scope.FinNewsAds = [];
	$scope.EventDetailAry = [];
	$scope.Sessions = [];
	$scope.sessSelected = 0;
	$scope.dataLoaded = false;

	//下拉式選單的兩個變數 用來跟兩個input value binding
	$scope.MinMutiplyResult = null;
	$scope.MaxMutiplyResult = null;
	//下拉式選單select data binding 
	$scope.SelectCM2TValueRange = "";
	$scope.clickCount = 0;
	$scope.popularItmeCount =10;//預设10筆'
	$scope.CurrentCulture = "";
	$scope.CultureQueryString = "";
	$scope.ShowBuyNowButton = false;
	$scope.RegMessage = "";

	$scope.orderByField = 'EventSession';
	$scope.PropertyFilterValue = [];
	$scope.PropertyFilterIndex = [true, false, false, false, false];
	$scope.SearchInput = "";
	$scope.SelectedOrder = 1;
	$scope.ShowMap = false;
	$scope.MapHouseAry = [];
	$scope.SelectedMapOrder = 0;
	$scope.IsNewPropertyList = "N";

	$scope.DefaultMapCenter = ["47.9053454","106.9179488"];
	$scope.DefaultZoom = 14;
	$scope.SelectedPing = 0;
	$scope.SelectedPrice = 0;
	$scope.SelectedCity = "ALL";
	$scope.CityAry = [];
	$scope.MapCenterAry = [];

	$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
		console.log("hello");
	});

	$scope.invoiceDistributionInit = function (data) {
		console.log(data);
	}

	$scope.ClosePopup = function () {
		$('.realestate_pop').hide();
		$('.pop_bg').hide();
	}

	$scope.crmInit = function () {
		$('header').addClass('white');
		$('.jqimgFill').imgLiquid();
	}

	$scope.homeInit = function (culture, googleMapApiKey, isNewPropertyList, source) {
		$scope.IsNewPropertyList = isNewPropertyList;
        if ($scope.CurrentCulture == "")
        {
            $scope.CurrentCulture = culture;
            $scope.CultureQueryString = 'culture='+culture+'&ui-culture='+culture;
        }
		//$("#marketTag").addClass("active");
		// //cara
		// if (msgCode != null && msgCode.length > 0)
		// {
		// 	$scope.RegMessage = msgCode;
		// 	$('.realestate_pop').show();
		// 	$('.pop_bg').show();
		// }
	
		//console.log("window.location.origin: " + window.location.origin);//window.location.origin + window.location.pathname + 
		//console.log("window.location.pathname: " + window.location.pathname);
        //console.log("=======homeInit==========");
		$.ajax({
		    url: '/Home/IndexApi?'+$scope.CultureQueryString,
			method: 'GET',
			data: {
                source: source
            },
		    dataType: "json"
		}).done(function (result) {
		    //console.log(result);
		    //var source = JSON.parse(result);
		    //console.log(source);
            // console.log("=======popularItmeCount done==========");
		    if (result.IsSucess) {
		        var status = result['IsSucess'];
		        //console.log(status);
                //console.log("=======popularItmeCount IsSucess==========");
		        var data = result['Data'];
		        //console.log(data);

		        //console.log($scope.Investmentypes);
		        $scope.Investmentypes = data['Investmentypes'];
				$scope.PopularRealestates = data['PopularRealestates'];
				$scope.CityAry = [];
				$.each($scope.PopularRealestates, function (i, v) {
					v.Index = i;
					v.CurrentPrice = v.CurrentPrice;
					v.CurrentPriceDisplay = $scope.formatNumberWithCommas(v.CurrentPrice, 2); 
					v.ReferencePrice = $scope.formatNumberWithCommas(v.ReferencePrice, 2);
					v.HouseProfit = $scope.formatNumberWithCommas(v.HouseProfit, 1);
					v.AreaSizePercent = $scope.formatNumberWithCommas(v.AreaSizePercent, 1);
					v.TotalRentalIncomeInUSD = v.TotalRentalIncomeInUSD;
					v.TotalRentalIncomeInUSDDisplay = $scope.formatNumberWithCommas(v.TotalRentalIncomeInUSD, 2);
					v.LatLong = v.LatLong;
					if (!$scope.CityAry.includes(v.Location))
					{
						var city = new Object();
						city.Name = v.Location;
						city.MapCenter = v.LocationMapCenter;
						$scope.CityAry.push(v.Location);
						$scope.MapCenterAry.push(city);
					}
				});
				$scope.AllPopularRealestates = $scope.PopularRealestates;
				$scope.NewArrivalHouses = data['NewArrivalHouses'];
				$.each($scope.NewArrivalHouses, function (i, v) {
					v.CurrentPrice = v.CurrentPrice;
					v.CurrentPriceDisplay = $scope.formatNumberWithCommas(v.CurrentPrice, 2);
					v.ReferencePrice = $scope.formatNumberWithCommas(v.ReferencePrice, 2);
					v.HouseProfit = $scope.formatNumberWithCommas(v.HouseProfit, 1);
					v.AreaSizePercent = $scope.formatNumberWithCommas(v.AreaSizePercent, 1);
					v.TotalRentalIncomeInUSD = v.TotalRentalIncomeInUSD;
					v.TotalRentalIncomeInUSDDisplay = $scope.formatNumberWithCommas(v.TotalRentalIncomeInUSD, 2);
				});
				$scope.dataLoaded = true;
                //debugger;
                $scope.Rows=SliceAndGroupArray($scope.PopularRealestates);

                //console.log($scope.PopularRealestates);
		        $scope.Realestatetypes = data['Realestatetypes'];
                $scope.Locationtypes = data['Locationtypes'];
                //console.log($scope.Locationtypes);
				if (source == "Market")
				{
					$scope.PromotionalAd = data['PromotionalAds'][0];		// only get one here
					$scope.PromotionalAdHouse = data['PromotionalAdHouses'][0];
					$scope.PromotionalAdHouse.CurrentPrice = $scope.PromotionalAdHouse.CurrentPrice;
					$scope.PromotionalAdHouse.CurrentPriceDisplay = $scope.formatNumberWithCommas($scope.PromotionalAdHouse.CurrentPrice, 2);
					$scope.PromotionalAdHouse.ReferencePrice = $scope.formatNumberWithCommas($scope.PromotionalAdHouse.ReferencePrice, 2);
					$scope.PromotionalAdHouse.HouseProfit = $scope.formatNumberWithCommas($scope.PromotionalAdHouse.HouseProfit, 1);
					$scope.PromotionalAdHouse.AreaSizePercent = $scope.formatNumberWithCommas($scope.PromotionalAdHouse.AreaSizePercent, 1);
					$scope.PromotionalAdHouse.TotalRentalIncomeInUSD = $scope.PromotionalAdHouse.TotalRentalIncomeInUSD;
					$scope.PromotionalAdHouse.TotalRentalIncomeInUSDDisplay = $scope.formatNumberWithCommas($scope.PromotionalAdHouse.TotalRentalIncomeInUSD, 2);
				}
                //console.log($scope.PromotionalAds);
				$scope.NewsAds = data['NewsAds'];
				$scope.FinNewsAds = data['FinNewsAds'];
				$scope.ShowBuyNowButton = true;
				$scope.ShowHousesInOrder();
				if ($scope.IsNewPropertyList == "Y")
				{
					$scope.MapInit(googleMapApiKey);
				}
		        $scope.$apply();
				$('.jqimgFill').imgLiquid();	
		    }
		});
	};

	$scope.MapInit = function(googleMapApiKey) {
        $scope.GoogleMapApiKey = googleMapApiKey;
        $scope.AddToLatLongAry($scope.PopularRealestates);
        var centerLatLong = $scope.DefaultMapCenter;
        var mapOptions = {
            zoom: $scope.DefaultZoom,
            styles: mapstyle,
            center: {lat:parseFloat(centerLatLong[0]), lng: parseFloat(centerLatLong[1])}
        }
        $scope.Map = new google.maps.Map(document.getElementById('market_mapArea'), mapOptions);

        // Add some markers to the map.
        // Note: The code uses the JavaScript Array.prototype.map() method to
        // create an array of markers based on a given "locations" array.
        // The map() method here has nothing to do with the Google Maps API.
        $scope.MapMarkers = $scope.LatLongAry.map(function(location, i) {
            var marker = $scope.CreateMarkers(location);
            $scope.AddMarkerListener(marker);
            return marker;
        });

        $scope.CreateMarkerCluster();
        $scope.AddMarkerClusterListener();
	};

    $scope.AddToLatLongAry = function(mapMarkers) {
        $scope.LatLongAry = [];
        $.each(mapMarkers, function (i, v) {
			var LatLong = $scope.AddHouseToLatLongAry(v);
            $scope.LatLongAry.push(LatLong);
        });        
	};
	
	$scope.AddHouseToLatLongAry = function(v) {
		var LatLong = new Object();
		var ll = v.LatLong.split(",");
		LatLong.index = v.Index;
		LatLong.estateId = v.EstateId;
		LatLong.name = v.Name;
		LatLong.location = v.Location;
		LatLong.picturePath = v.PicturePath;
		LatLong.latitude = parseFloat(ll[0]);
		LatLong.longtitude = parseFloat(ll[1]);
		LatLong.zoom = parseFloat(ll[2]);
		LatLong.googleMapUrl = $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/place?q="+LatLong.latitude+","+LatLong.longtitude+"&key="+$scope.GoogleMapApiKey);
		LatLong.latLong = {lat: LatLong.latitude, lng: LatLong.longtitude};
		LatLong.estateCatagory = v.EstateCatagory;
		LatLong.icon = (v.EstateCatagoryCode.includes("COMMERCIAL")) ? 
							(v.ZoningCode.includes("REZONE") ? comm_rezone : comm_goldenlot) : 
							(v.ZoningCode.includes("REZONE") ? res_rezone : res_goldenlot);
		LatLong.currentPrice = v.CurrentPrice;
		LatLong.currentPriceDisplay = v.CurrentPriceDisplay;
		LatLong.totalRentalIncomeInUSD = v.TotalRentalIncomeInUSD;
		LatLong.totalRentalIncomeInUSDDisplay = v.TotalRentalIncomeInUSDDisplay;
		LatLong.areaSizePercent = v.AreaSizePercent;
		LatLong.priceGuarantee = v.PriceGuarantee;
		LatLong.areaInPing = v.AreaInPing;
		return LatLong;
	};

    $scope.CreateMarkers = function(location) {
		var marker = new MarkerWithLabel({
			position: location.latLong,
			map: $scope.Map,
			// icon: mapStyles.uavSymbolBlack,
			labelContent: location.areaSizePercent+"%",
			labelAnchor: new google.maps.Point(30, 0),
			labelClass: "map_label",
			labelStyle: {display: 'inline-flex'},
			icon: location.icon,
            price: location.currentPrice,
            percentage: location.areaSizePercent,
			index: location.index
		});	
        return marker;
	};

    $scope.AddMarkerListener = function(marker) {
        marker.addListener('click', function() {
            $scope.ShowMapHouses([marker]);
            if (!($('#cm2-house').hasClass("active")))
            {
                $('#cm2-house').toggleClass('active');
            }
            $scope.$apply();
        });
	};

    $scope.CreateMarkerCluster = function() {
        // Add a marker clusterer to manage the markers.
        $scope.MapMarkerCluster = new MarkerClusterer($scope.Map, $scope.MapMarkers, {
            zoomOnClick: false,
            styles: clusterStyle,
            calculator: function(markers, numStyles) {
                result = {
                    text: markers.length,
                    index: 0
                };
                return result; 
            }
        });
    };

    $scope.AddMarkerClusterListener = function() {
        $scope.MapMarkerCluster.addListener('click', function(s) {
            var markers = s.getMarkers();  // this can get array of locations within the cluster, use id to identify what to display at #cube-house
            // var center = s.getCenter(); 
            // var clusterSize = s.getSize();
            // calculate average up/down by percentage
            $scope.ShowMapHouses(markers);
            if (!($('#cm2-house').hasClass("active")))
            {
                $('#cm2-house').toggleClass('active');
            }
            $scope.ShowLimit = 3;
            $scope.$apply();
            // $('.mark-pop').toggleClass('active');
        });
	};

    $scope.selectSession = function(index) {
		$scope.sessSelected = index; 
	};

	$scope.seminarInit = function (culture, source) {
        if ($scope.CurrentCulture == "")
        {
            $scope.CurrentCulture = culture;
            $scope.CultureQueryString = 'culture='+culture+'&ui-culture='+culture;
        }
		$.ajax({
			url: '/Home/SeminarInit?'+$scope.CultureQueryString,
			data: {
                source: source
            },
		    method: 'GET',
		    dataType: "json"
		}).done(function (result) {
		    if (result.IsSucess) {
		        var status = result['IsSucess'];
		        var data = result['Data'];
				$scope.NewsAds = data['NewsAds'];
				$scope.Sessions = data['Sessions'];
				$.each($scope.Sessions, function(i, v) {
					v.Session.GoogleMapLoc = $sce.trustAsResourceUrl(v.Session.GoogleMapLoc);
				});
				$scope.dataLoaded = true;
		        $scope.$apply();
				$('.jqimgFill').imgLiquid();	
		    }
		});
	};

	//CM2下拉式選單事件
	$scope.CM2TDropDownListValueChange = function () {
		var selectValue = $scope.SelectCM2TValueRange;
		selectValue = selectValue.replace(/\s+/g, '');
		var CM2MaxValue = selectValue.split('-');
		//將最大值最小值個別放入對應的變數中(對應到各個input Value)

		$scope.MinMutiplyResult = CM2MaxValue[0];
		$scope.MaxMutiplyResult = CM2MaxValue[1];
		// console.log($scope.MaxMutiplyResult);
		// console.log($('#MaxMutiplyResult').val());
	};

	//Cara home/index click more get next 10 
	$scope.LoadMore = function (popularItmeCount) {
		$scope.clickCount=$scope.clickCount+1;
	$.ajax({
		url: '/Home/IndexMoreApi?popularItmeCount=' + $scope.popularItmeCount+ '&clickCount=' + $scope.clickCount,
		    method: 'GET',
		    dataType: "json"
		}).done(function (result) {
		    if (result.IsSucess) {
		        var status = result['IsSucess'];
		        var data = result['Data'];
				// console.log(data);
                $.each(data.PopularRealestates, function (i, v) {
                    $scope.PopularRealestates.push(data.PopularRealestates[i]);
                    //$scope.$apply();
                });
                // console.log($scope.PopularRealestates);
                $scope.Rows = SliceAndGroupArray($scope.PopularRealestates);//Thomas Lin 笙加
                // console.log($scope.Rows);
                $scope.$apply();
		    }
		});
	};

    $scope.EventDetailInit = function (culture) {
        if ($scope.CurrentCulture == "")
        {
            $scope.CurrentCulture = culture;
            $scope.CultureQueryString = 'culture='+culture+'&ui-culture='+culture;
        }
        $.ajax({
            url: '/Home/GetEventDetail?'+$scope.CultureQueryString,
            method: "GET",
            dataType: "json"
        }).done(function (data) {
            $.each(data["Data"], function (i, v) {
                var eventItem = new Object();
                eventItem.Name = v.Name;
                eventItem.Email = v.Email;
                eventItem.Phone = v.Phone;
                eventItem.EventSession = v.EventSession;
                eventItem.NumOfAttendee = v.NumOfAttendee;
                eventItem.UtmSource = v.UtmSource;
                eventItem.UtmMedium = v.UtmMedium;
				eventItem.UtmCampaign = v.UtmCampaign;
				eventItem.UtmTerm = v.UtmTerm;
				eventItem.Remark = v.Remark;
                $scope.EventDetailAry.push(eventItem);
            });
            $scope.$apply();
        }).fail(function (err) {
            console.log("Request failed: " + err.responseText + err.statusText);
        });
	};

	$scope.SetSelectedCity = function()
	{
		var center = $scope.DefaultMapCenter;
		var zoom = $scope.DefaultZoom;
		if ($scope.SelectedCity != "ALL")
		{	// set map focus
			var cityCenter = $scope.MapCenterAry.find(function(element) {
								return element.Name == $scope.SelectedCity; 
							});
			var latlong = cityCenter.MapCenter.split(",");
			center = new google.maps.LatLng(latlong[0], latlong[1]);
			zoom = latlong[2];
		}
		$scope.Map.panTo(center);
		$scope.Map.setZoom(zoom);
		$scope.SetPropertyFilter(-1);
	}

    $scope.SetPropertyFilter = function(categoryZoningVal) 
    {
		let filterZone = categoryZoningVal;
		let buttonFilter = ["TRADITIONALLEASE", "COMMERCIALLEASE", "REZONE", "GOLDENLOT"]
		let propertyFilter = []
		if (filterZone > 0)
		{
			$scope.PropertyFilterIndex[0] = false;
			$scope.PropertyFilterIndex[categoryZoningVal] = !$scope.PropertyFilterIndex[categoryZoningVal];
		}
		if (!$scope.PropertyFilterIndex.includes(true))
		{
			filterZone = 0;
		}
		$scope.CloseCm2HouseTab();
        switch(filterZone) {
			case -1:
				break;
			case 0:
				$scope.PropertyFilterIndex = [true, false, false, false, false];
				$scope.PropertyFilterValue = [];
				$('.ckFilter-button').removeClass('active');		
				$('#ckFilterAll-button').addClass('active');
				break;
			default:
				$('.ckFilter-button').removeClass('active');
				for (var i = 1; i < $scope.PropertyFilterIndex.length; i++) {
					if ($scope.PropertyFilterIndex[i] == true)
					{
						propertyFilter.push(buttonFilter[i-1]);
						$('#ckFilter'+i+'-button').addClass('active');
					}
				}
				$scope.PropertyFilterValue = propertyFilter;
				break;
		}
		
		var minPing = ($scope.SelectedPing < 0) ? 50 : 0;
		var maxPing = ($scope.SelectedPing > 0) ? $scope.SelectedPing : 10000;

		var minPrice = ($scope.SelectedPrice < 0) ? 50 : 0;
		var maxPrice = ($scope.SelectedPrice > 0) ? $scope.SelectedPrice : 10000;

		var newPopularRealestates = ($scope.PropertyFilterValue.length < 1) ? 
										$scope.PopularRealestates : 
										$scope.PopularRealestates.filter(function(item) {
											return isSameCategoryAndZoning(item);
										}
									);
		newPopularRealestates = ($scope.SelectedPing == 0) ? 
										newPopularRealestates :
										newPopularRealestates.filter(function(item) {
																return isWithinAreaInPing(item, minPing, maxPing);
															});
		newPopularRealestates = ($scope.SelectedPrice == 0) ? 
										newPopularRealestates :
										newPopularRealestates.filter(function(item) {
																return isWithinPrice(item, minPrice, maxPrice);
															});
		newPopularRealestates = ($scope.SelectedCity == "ALL") ?
										newPopularRealestates :
										newPopularRealestates.filter(function(item) {
																return isSameCity(item)
															});
		$scope.AddToLatLongAry(newPopularRealestates);
		$scope.UpdateMapMarkers();
	};
	
	function isSameCity(item)
	{
		return (item.Location == $scope.SelectedCity);
	}
	function isWithinPrice(item, minPrice, maxPrice)
	{
		return ((item.CurrentPrice > minPrice) && (item.CurrentPrice <= maxPrice));
	}
	function isWithinAreaInPing(item, minPing, maxPing)
	{
		return ((item.AreaInPing > minPing) && (item.AreaInPing <= maxPing));
	}
	function isSameCategoryAndZoning(item)
	{
		let allCategory = (!($scope.PropertyFilterValue.includes("TRADITIONALLEASE") ^ $scope.PropertyFilterValue.includes("COMMERCIALLEASE")));
		let isSameCategory = allCategory || ($scope.PropertyFilterValue.indexOf(item.EstateCatagoryCode) > -1);
		let allZoning = (!($scope.PropertyFilterValue.includes("REZONE") ^ $scope.PropertyFilterValue.includes("GOLDENLOT")));
		let isSameZoning = allZoning || ($scope.PropertyFilterValue.indexOf(item.ZoningCode) > -1);
		return isSameCategory && isSameZoning;
	}

    $scope.PropertyFilter = function(item)
    {
		var sameCategoryAndZoning = ($scope.PropertyFilterValue.length < 1) ? true : isSameCategoryAndZoning(item);
		var minPing = ($scope.SelectedPing < 0) ? 50 : 0;
		var maxPing = ($scope.SelectedPing > 0) ? $scope.SelectedPing : 10000;
		var withinAreaInPing = ($scope.SelectedPing == 0) ? true : isWithinAreaInPing(item, minPing, maxPing);
		var minPrice = ($scope.SelectedPrice < 0) ? 50 : 0;
		var maxPrice = ($scope.SelectedPrice > 0) ? $scope.SelectedPrice : 10000;
		var withinPrice = ($scope.SelectedPrice == 0) ? true : isWithinPrice(item, minPrice, maxPrice);
		var sameCity = ($scope.SelectedCity == "ALL") ? true : isSameCity(item);
		return sameCategoryAndZoning && withinAreaInPing && withinPrice && sameCity;
	};

	$scope.SearchProperty = function(event) {
		$scope.CloseCm2HouseTab();
		$.ajax({
			url: '/Home/SearchProperty?'+$scope.CultureQueryString,
			data: {
                input: $scope.SearchInput
            },
			method: 'GET',
			dataType: "json"
		}).done(function (result) {
			if (result.IsSucess) {
				var data = result['Data'];
				$scope.PropertyFilterValue = [];
				$(".ckFilter-button").removeClass('active');
				$("#ckFilterAll-button").first().addClass('active');
				$scope.PopularRealestates = data['PopularRealestates'];
				$scope.CityAry = [];
				$.each($scope.PopularRealestates, function (i, v) {
					v.Index = i;
					v.CurrentPrice = v.CurrentPrice;
					v.CurrentPriceDisplay = $scope.formatNumberWithCommas(v.CurrentPrice, 2);
					v.AreaInPing = v.AreaInPing;
					v.AreaInPingDisplay = $scope.formatNumberWithCommas(v.AreaInPing, 2);
					v.ReferencePrice = $scope.formatNumberWithCommas(v.ReferencePrice, 2);
					v.HouseProfit = $scope.formatNumberWithCommas(v.HouseProfit, 1);
					v.AreaSizePercent = $scope.formatNumberWithCommas(v.AreaSizePercent, 1);
					v.TotalRentalIncomeInUSD = v.TotalRentalIncomeInUSD;
					v.TotalRentalIncomeInUSDDisplay = $scope.formatNumberWithCommas(v.TotalRentalIncomeInUSD, 2);
					v.LatLong = v.LatLong;
					if (!$scope.CityAry.includes(v.Location))
					{
						var city = new Object();
						city.Name = v.Location;
						city.MapCenter = v.LocationMapCenter;
						$scope.CityAry.push(v.Location);
						$scope.MapCenterAry.push(city);
					}
				});
				$scope.Rows=SliceAndGroupArray($scope.PopularRealestates);
				$scope.ShowHousesInOrder();
				// Update Map Markers and Clusters
				if ($scope.IsNewPropertyList == "Y")
				{
					$scope.AddToLatLongAry($scope.PopularRealestates);
					$scope.UpdateMapMarkers();
				}
				$scope.$apply();
			}
		});
	};

	$scope.UpdateMapMarkers = function() {
		$scope.MapMarkers = $scope.LatLongAry.map(function(location, i) {
			var marker = $scope.CreateMarkers(location);
			$scope.AddMarkerListener(marker);
			return marker;
		});
		$scope.MapMarkerCluster.clearMarkers();
		$scope.MapMarkerCluster.addMarkers($scope.MapMarkers);
	};

    $scope.ShowMapHouses = function(markers) {
        $scope.MapHouseAry = [];
        markers.forEach(function(m, i) {
			// $scope.MapHouseAry.push($scope.LatLongAry[m.index]);
			var h = $scope.LatLongAry.find(function(element) { 
				return element.index == m.index; 
			});
			$scope.MapHouseAry.push(h);
        });
		$scope.ShowHousesInOrder();
        $scope.$apply();
    };
	
	$scope.CloseCm2HouseTab = function() {
		$('#cm2-house').removeClass('active');
	};

    $scope.ShowHousesInOrder = function() {
		let sortBy = parseInt($scope.SelectedOrder);
		switch(sortBy) {
			case 0:
				$scope.PopularRealestates.sort((a, b) => (a.CurrentPrice > b.CurrentPrice) ? -1 : 1);
				$scope.MapHouseAry.sort((a, b) => (a.currentPrice > b.currentPrice) ? -1 : 1);
				break;
			case 1:
				$scope.PopularRealestates.sort((a, b) => (a.CurrentPrice < b.CurrentPrice) ? -1 : 1);
				$scope.MapHouseAry.sort((a, b) => (a.currentPrice < b.currentPrice) ? -1 : 1);
				break;
			case 2:
				$scope.PopularRealestates.sort((a, b) => (a.CurrentPrice*a.AreaInPing > b.CurrentPrice*b.AreaInPing) ? -1 : 1);
				$scope.MapHouseAry.sort((a, b) => (a.currentPrice*a.areaInPing > b.currentPrice*b.areaInPing) ? -1 : 1);
				break;
			case 3:
				$scope.PopularRealestates.sort((a, b) => (a.CurrentPrice*a.AreaInPing < b.CurrentPrice*b.AreaInPing) ? -1 : 1);
				$scope.MapHouseAry.sort((a, b) => (a.currentPrice*a.areaInPing < b.currentPrice*b.areaInPing) ? -1 : 1);
				break;
			case 4:
				$scope.PopularRealestates.sort((a, b) => (a.TotalRentalIncomeInUSD > b.TotalRentalIncomeInUSD) ? -1 : 1);
				$scope.MapHouseAry.sort((a, b) => (a.totalRentalIncomeInUSD > b.totalRentalIncomeInUSD) ? -1 : 1);
				break;
			case 5:
				$scope.PopularRealestates.sort((a, b) => (a.TotalRentalIncomeInUSD < b.TotalRentalIncomeInUSD) ? -1 : 1);
				$scope.MapHouseAry.sort((a, b) => (a.totalRentalIncomeInUSD < b.totalRentalIncomeInUSD) ? -1 : 1);
				break;
			case 6:
				$scope.PopularRealestates.sort((a, b) => (a.AreaInPing > b.AreaInPing) ? -1 : 1);
				$scope.MapHouseAry.sort((a, b) => (a.areaInPing > b.areaInPing) ? -1 : 1);
				break;
			case 7:
				$scope.PopularRealestates.sort((a, b) => (a.AreaInPing < b.AreaInPing) ? -1 : 1);
				$scope.MapHouseAry.sort((a, b) => (a.areaInPing < b.areaInPing) ? -1 : 1);
				break;			
		}
		$scope.$apply();
	};
	
	$scope.ShowPropertyMap = function() {
		$('#market_list').removeClass('active');
		$('#market_block').removeClass('active');
		$('#market_map').addClass('active');
		$('.all-estate').removeClass('market_list');
		$('.all-estate').removeClass('market_block');
		$scope.ShowMap = true;
		$scope.$apply();
	};

	$scope.ShowHousesByPing = function() {

	}

	$scope.ShowPropertyList = function() {
		$('#market_list').addClass('active');
		$('#market_block').removeClass('active');
		$('#market_map').removeClass('active');
		$('.all-estate').addClass('market_list');
		$('.all-estate').removeClass('market_block');
		$scope.CloseCm2HouseTab();
		$scope.ShowMap = false;
		$scope.$apply();
	};

	$scope.ShowPropertyBlock = function() {
		$('#market_block').addClass('active');
		$('#market_list').removeClass('active');
		$('#market_map').removeClass('active');
		$('.all-estate').addClass('market_block');
		$('.all-estate').removeClass('market_list');
		$scope.CloseCm2HouseTab();
		$scope.ShowMap = false;
		$scope.$apply();
	}
});