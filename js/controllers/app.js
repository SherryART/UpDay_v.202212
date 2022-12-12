'use strict';

(function () {
function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

// Decimal round
if (!Math.round10) {
    Math.round10 = function(value, exp) {
        return decimalAdjust('round', value, exp);
    };
}
// Decimal floor
if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
        return decimalAdjust('floor', value, exp);
    };
}
// Decimal ceil
if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
        return decimalAdjust('ceil', value, exp);
    };
}
})();

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$(document).ready(function(){
	if($("#breadcrumbs-without-anim").html()!=undefined){
		$("#breadcrumbs-without-anim").rcrumbs({animation: {activated: false}});
	}

	//if ($("#login").html() != undefined) {
	//    if (getCookie("LoginError") != "") {
	//        $("#loginErrorMsg").html(getCookie("LoginErrorMsg"));

	//        $("#login .loginError").show();
	//        setCookie("LoginError", "", -1);
	//        setCookie("LoginErrorMsg", "", -1);
	//	}

	//	if (getCookie("apiIsDev") != "") {
	//	    alert();
	//	    setCookie("apiIsDev", "", -1);
	//	}
 //   }

    //$("#wopoAmount").on('change', function () {
    //    $("#wopoAmount").val(convertAmountFormat($("#wopoAmount").val(), 2));
    //});
    //yako �p���I�|�ˤ��J��X��
    function convertAmountFormat(val, precision) {
        return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
    }
    
	//$(".decimal4").on('input', function () {
	//    this.value = this.value
    //      .replace(/[^\d.]/g, '')             // numbers and decimals only
    //      .replace(/(^[\d]{2})[\d]/g, '$1')   // not more than 2 digits at the beginning
    //      .replace(/(\..*)\./g, '$1')         // decimal can't exist more than once
    //      .replace(/(\.[\d]{2})./g, '$1');    // not more than 4 digits after decimal
	//});
});
var app = angular.module('app', ['ngSanitize', 'ngTouch', 'AxelSoft', 'infinite-scroll', 'slick']).config(config);

app.filter('abs', function () {
    return function (val) {
        return Math.abs(val);
    }
});

function config($provide) {

    function currencyFilter($delegate, numberFilter) {

        return function (amount, currencySymbol, fractionSize) {
            // Get the existing currency filter
            var currency = $delegate.apply($delegate, arguments);
            // Format the value with our chosen fraction size
            var fraction = numberFilter(amount, fractionSize);
            // Reformat the filtered value with our fraction size
            return currency.replace(/[0-9]+.*[0-9]+/, fraction);
        };
    }
    currencyFilter.$inject = ['$delegate', 'numberFilter'];

    $provide.decorator('currencyFilter', currencyFilter);
}
config.$inject = ['$provide'];

app.directive('repeatDone', function() {
    return function(scope, element, attrs) {
        if (scope.$last) { // all are rendered
            scope.$eval(attrs.repeatDone);
        }
    }
});

app.directive('repeatProgress', function() {
    return function(scope, element, attrs) {
        scope.$eval(attrs.repeatProgress);
    }
});

//cara 20180518 add
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

app.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            element.hover(function(){
                // on mouseenter
                element.tooltip('show');
            }, function(){
                // on mouseleave
                element.tooltip('hide');
            });
        }
    };
});

app.controller('MainCtrl', function ($scope, $timeout, $interval) {
    $scope.currentLanguage = "zh-TW";   // default language culture setting
    //$scope.apiDomain = window.location.origin + (window.location.pathname == '/' ? '' : window.location.pathname);
    $scope.defaultRedirectToAction = "../Home"; //�w�]���~�ɾɤJ��
    $scope.redirectToLoginPage = function (page) {//�ɤJ�����
        window.location = page;
    }; 
    $scope.layout = {};
    $scope.layout.notificationCount = 0;
    $scope.layout.contactUsFirstName = "";
    $scope.layout.contactUsLastName = "";
    $scope.layout.contactUsCompany = "";
    $scope.layout.contactUsName = "";
    $scope.layout.contactUsEmail = "";
    $scope.layout.contactUsPhoneNumber = "";
    $scope.layout.contactUsMessage = "";
    //$timeout(function () {
    //    $interval(function () { $scope.checkSessionTimeout();}, (15 * 60 * 1000)) // 15 minutes;
    //}, (60*1000))

    $scope.AppInit = function (userId) {
        if (userId.length > 0)
        {
            $.ajax({
                url: '/Home/GetUserInfoAndNotificationCount',
                method: "GET",
                dataType: "json",
                data: {
                    userId: userId
                }
            }).done(function (data) {
                if (data.IsSucess) {
                    $scope.layout.notificationCount = data.Data.NotificationCount;
                    $scope.layout.contactUsName = data.Data.Name;
                    $scope.layout.contactUsEmail = data.Data.Email;
                    $scope.layout.contactUsPhoneNumber = data.Data.PhoneNumber;
                }
                else {
                    $scope.layout.notificationCount = 0;
                }
                $scope.$apply();
            }).fail(function (jqXHR, textStatus) {
                console.log("Notification count request failed: " + textStatus);
                console.log(jqXHR);
            });
        }
    };

    $scope.ContactUsV3 = function (culture, tryFree) {
        var companyName = "(" + $scope.layout.contactUsCompany + ")";
        var extraMessage = tryFree ? "(Try free)" : "(Contact for information)";
        var emailmodel = {
            ContactName: $scope.layout.contactUsLastName + ' ' + $scope.layout.contactUsFirstName + companyName,
            ContactEmail: $scope.layout.contactUsEmail,
            ContactPhoneNumber: $scope.layout.contactUsPhoneNumber,
            ContactMessage: $scope.layout.contactUsMessage + ' ' + extraMessage
        };
        if (tryFree) {
            $("#start-free-content").hide();
            $("#start-free-thanks").show();
            fbq('track', 'CompleteRegistration');
        } else {
            $("#contact-us-content").hide();
            $("#contact-us-thanks").show();
            fbq('track', 'Contact');
        }
        $.ajax({
            type: "POST",
            url: "/api/IndexSendMailAsync",
            contentType: "application/json",
            data: JSON.stringify(emailmodel)
        }).done(function (data) {
            if (data.IsSucess) {
                $scope.layout.notificationCount = data.Data.NotificationCount;
                $scope.layout.contactUsName = data.Data.Name;
                $scope.layout.contactUsEmail = data.Data.Email;
                $scope.layout.contactUsPhoneNumber = data.Data.PhoneNumber;
            }
            else {
                $scope.layout.notificationCount = 0;
            }
            $scope.$apply();
            if (tryFree) {
                $("#start-free-content").show();
                $("#start-free-thanks").hide();
            } else {
                $("#contact-us-content").show();
                $("#contact-us-thanks").hide();
            }
        }).fail(function (jqXHR, textStatus) {
            console.log("Notification count request failed: " + textStatus);
            console.log(jqXHR);
            if (tryFree) {
                $("#start-free-content").show();
                $("#start-free-thanks").hide();
            } else {
                $("#contact-us-content").show();
                $("#contact-us-thanks").hide();
            }
        });
        $scope.layout.contactUsName = "";
        $scope.layout.contactUsEmail = "";
        $scope.layout.contactUsPhoneNumber = "";
        $scope.layout.contactUsMessage = "";
    };

    $scope.SetLanguage = function (newLang) {
        $scope.currentLanguage = newLang;
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = key.includes("culture") ? newLang : value;
        });
        var newParams = Object.entries(vars).map(entry => entry.join('=')).join('&');
        if (!newParams.includes("culture"))
        {
            newParams = "culture="+newLang+"&ui-culture="+newLang+"&"+newParams;
        }
        var newLocation = location.pathname+"?"+newParams
        // var searchArray = location.search.split('&');
        // var newLocation = location.pathname+"?culture="+newLang+"&ui-culture="+newLang;
        // for(var i=0; i<searchArray.length; i++)
        // {
        //     if ((searchArray[i]).indexOf('culture=') < 0)
        //     {
        //         newLocation += ('&' + searchArray[i]);
        //     }
        // }
        window.location = newLocation;
    }

    $scope.findObjectByKey = function (array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }

    $scope.getArrayName = function (arr, code) {
        for (var i = 0; i < arr.length; i++) {
            var type = arr[i];
            if (code == type['Code']) {
                return type['Name'];
            }
        }
        return "";
    }

    $scope.getClassOfTravelName = function (code) {
        return $scope.getArrayName($scope.classTravelList, code);
    }

    $scope.getTransportationTypeName = function (code) {
        return $scope.getArrayName($scope.transportationTypeList, code);
    }

    $scope.getMealTypeName = function (code) {
        return $scope.getArrayName($scope.mealTypeList, code);
    }

    $scope.expenseInputValidation = function (validationText) {
        var _objId = "";
        $(validationText).each(function (i, v) {
            if ($(this).val().trim().length == 0) {
                _objId = $(this).attr('id');
                return false;
            }
        });
        return _objId;
    }

    $scope.convertAPIDateFormat = function (date) {
        if (date != null && date != "") {
            var _dateObj = date.split("/");
            //return new Date(_dateObj[2], parseInt(_dateObj[1]) - 1, _dateObj[0]);
            //console.log(_dateObj[1]);
            return (_dateObj[2] + "-" + _dateObj[1] + "-" + _dateObj[0]);
        } else {
            return date;
        }
	}
	
    $scope.convertDisplayDateFormat = function (date) {
        if (date != null && date != "") {
            var _dateObj = date.split("-");
            //var _dateObj = date.split("T");
            //_dateObj = _dateObj[0].split("-");
            return (_dateObj[2] + "/" + _dateObj[1] + "/" + _dateObj[0]);
        } else {
            return date;
        }
    }

    $scope.convertAPITimeFormat = function (time) {
        if (time != null && time != "") {
            return time + ":00";
        } else {
            return time;
        }
    }

    $scope.convertAPIDbDateTimeFormatToDisplay = function (datetime) {
        if (datetime != null && datetime != "") {
            var SubmitDate = datetime.split("T");
            var SubmitTime = SubmitDate[1];
            SubmitDate = SubmitDate[0].split("-");
            return SubmitDate[2] + "/" + SubmitDate[1] + "/" + SubmitDate[0] + " " + SubmitTime.slice(0, -1);
        } else {
            return datetime;
        }
    }

    $scope.convertAPIDbDateFormatToDisplay = function (datetime) {
        if (datetime != null && datetime != "") {
            var SubmitDate = datetime.split("T");
            SubmitDate = SubmitDate[0].split("-");
            return SubmitDate[2] + "/" + SubmitDate[1] + "/" + SubmitDate[0];
        } else {
            return datetime;
        }
    }

    $scope.convertDisplayTimeFormat = function (time) {
        if (time != null && time != "") {
            var _dateObj = time.split(":");
            return (_dateObj[0] + ":" + _dateObj[1]);
        } else {
            return time;
        }
    }

    ////yako �p���I�|�ˤ��J��X��
    $scope.convertAmountFormat = function (val, precision) {
        return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
    }

    $scope.formatNumberWithCommas = function (val, precision) {
        var t = parseFloat(Math.round(val * (10**precision))/(10**precision)).toFixed(precision);
        var num = Number(t).toLocaleString("en-US", {minimumFractionDigits: precision});
        return num;
    }

    //yako json or string
    $scope.isJsonFormat = function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    //yako string��bool
    $scope.appCheckBooleanValue = function (value) {
        if (value == null || value == "") {
            return false;
        }
        return (value.toLowerCase() == "true" ? true : false);
    }

    $scope.globalApiCall = function (path, callBack) {
        $scope.globalApiCallWithValue(path, "", callBack);
    }

    $scope.concatStr = function (arr) {
        var str = '';
        arr.forEach(function (element) {
            if (str != '')
            {
                str += ',';
            }
            str += element;
        });

        return str;
    }

    

    $scope.zeroToEmpty = function (num) {
        var obj = (num > 0) ? num : "";
        return obj;
    }

    $scope.getQueryString = function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    $scope.copyFunction = function (copyFromElement, copySucceedMessage) {
        var fromElem = $('#'+copyFromElement);
        var copyText = fromElem.is('input') ? fromElem.val() : fromElem.text();
        $('body').append('<textarea id="clip_area"></textarea>');
        //快速生成一個textareea
        var clip_area = $('#clip_area');
        //把文字丟到textarea 內
        clip_area.text(copyText);
        clip_area.select();
        //複製該area 文字
        document.execCommand('copy');
        //刪除area
        clip_area.remove();
        //==================
        alert(copySucceedMessage);
        //==================
    }
});
