/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: caidong <caidong@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2016/01/28 23:59:27 by caidong           #+#    #+#             */
/*   Updated: 2016/02/20 00:21:30 by caidong          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function setCookie(name, value, expires, path, domain, secure) {
    var cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    if (expires instanceof Date)
        cookie += "; expires=" + expires.toGMTString();
    if (value)
        cookie += "; path=" + path;
    if (domain)
        cookie += "; domain=" + domain;
    if (secure)
        cookie += "; secure=" + secure;

    document.cookie = cookie;
}

function getCookie(name) {
    var cookieName = encodeURIComponent(name) + "=";
    var cookieStart = document.cookie.indexOf(cookieName);
    var cookieValue = null;
    if (cookieStart > -1) {
        var cookieEnd = document.cookie.indexOf(";", cookieStart);
        if (cookieEnd == -1) { //the last cookie
            cookieEnd = document.cookie.length;
        }
        cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    return cookieValue;
}

function removeCookie(name, path, domain) {
    setCookie(name, "", new Date(0), path, domain);
}

function closeLogin() {
    document.getElementsByClassName("m-mask")[0].style.display = "none";
    document.getElementsByClassName("m-formwrap")[0].style.display = "none";
}

function closeCheck() {
    var cookie = getCookie("closetop");
    if (cookie == "closetop") {
        document.getElementsByClassName("g-top")[0].style.display = "none";
    } else {
        document.getElementsByClassName("g-top")[0].style.display = "block";
    }
}

function closeTop() {
    document.getElementsByClassName("g-top")[0].style.display = "none";
    setCookie("closetop", "closetop");
}

function cancelFollow() {
    document.getElementsByClassName("userAttr-after")[0].style.display = "none";
    document.getElementsByClassName("userAttr")[0].style.display = "block";
    removeCookie("followSuc");
}

function isFollow() {
    // document.getElementsByClassName("userAttr-after")[0].style.display = "block";
    var cookie = getCookie("followSuc");
    if (!!cookie) {
        document.getElementsByClassName("userAttr-after")[0].style.display = "block";
        document.getElementsByClassName("userAttr")[0].style.display = "none";
    } else {
        document.getElementsByClassName("userAttr-after")[0].style.display = "none";
        document.getElementsByClassName("userAttr")[0].style.display = "block";
    }
}

function login() {
    var cookie = getCookie("loginSuc");
    if (!!cookie) {
        follow();
    } else {
        document.getElementsByClassName("m-mask")[0].style.display = "block";
        document.getElementsByClassName("m-formwrap")[0].style.display = "block";
    }
}

function follow() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                if (xhr.responseText == 1) {
                    setCookie("followSuc", "followSuc");
                    document.getElementsByClassName("userAttr-after")[0].style.display = "block";
                    document.getElementsByClassName("userAttr")[0].style.display = "none";
                }
            }
        }
    };
    xhr.open("get", "http://study.163.com/webDev/attention.htm", true);
    xhr.send(null);
}

var loginForm = document.forms.loginForm;

function submit() {
    var nameInput = loginForm.username;
    var name = nameInput.value;
    var pwdInput = loginForm.password;
    var pwd = pwdInput.value;
    var verifiedName = "studyOnline",
        verifiedPwd = "study.163.com";
    var warning = document.getElementsByClassName("warning-msg")[0];
    //form validation
    if (name != verifiedName) {
        warning.style.visibility = "visible";
        warning.innerHTML = "请使用studyOnline账号登录";
        return;
    }
    if (pwd != verifiedPwd) {
        warning.style.visibility = "visible";
        warning.innerHTML = "请使用正确密码：study.163.com";
        return;
    }

    //use md5 to encrypt data
    var username = md5(name),
        password = md5(pwd);
    //use Ajax to login
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                if (xhr.responseText == 1) {
                    follow();
                    closeLogin();
                    setCookie("loginSuc", "loginSuc");
                }
            } else {
                alert("登录失败");
            }
        }
    };
    var url = "http://study.163.com/webDev/login.htm";
    url = addURLParam(url, "userName", username);
    url = addURLParam(url, "password", password);
    xhr.open("get", url, true);
    xhr.send(null);
}

function hideWarning() {
    document.getElementsByClassName("warning-msg")[0].style.visibility = "hidden";
}

function addURLParam(url, name, value) {
    url += (url.indexOf("?") === -1 ? "?" : "&");
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
    return url;
}

function closePlayer() {
    document.getElementsByClassName("m-mask")[0].style.display = "none";
    document.getElementsByClassName("m-player")[0].style.display = "none";
    var video = document.getElementById("video");
    video.pause();
}

function showPlayer() {
    document.getElementsByClassName("m-mask")[0].style.display = "block";
    document.getElementsByClassName("m-player")[0].style.display = "block";
}

var TOP_COURSE_NUM = 5;

function getTopRank() {
    var xhr = new XMLHttpRequest();
    var listNum = 0;
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                var topRank = JSON.parse(xhr.responseText);
                for (var i = 0; i < TOP_COURSE_NUM; i++) {
                    var topi = document.getElementsByClassName("rank-item")[i];
                    var imgi = topi.getElementsByTagName("img")[0];
                    var titlei = topi.getElementsByClassName("detail-title")[0];
                    var hoti = topi.getElementsByClassName("detail-hot")[0];
                    titlei.innerHTML = topRank[i].name;
                    titlei.title = topRank[i].name;
                    imgi.src = topRank[i].smallPhotoUrl;
                    hoti.innerHTML = topRank[i].learnerCount;
                }
                listNum = 1;
                var refreshHot = setInterval(function() {
                    listNum = !listNum;
                    for (var i = 0; i < TOP_COURSE_NUM; i++) {
                        topi = document.getElementsByClassName("rank-item")[i];
                        imgi = topi.getElementsByTagName("img")[0];
                        titlei = topi.getElementsByClassName("detail-title")[0];
                        hoti = topi.getElementsByClassName("detail-hot")[0];
                        xhri = i + TOP_COURSE_NUM * listNum;
                        titlei.innerHTML = topRank[xhri].name;
                        titlei.title = topRank[xhri].name;
                        hoti.innerHTML = topRank[xhri].learnerCount;
                        imgi.src = topRank[xhri].smallPhotoUrl;
                    }
                }, 5000);
            }
        }
    }
    xhr.open("get", "http://study.163.com/webDev/hotcouresByCategory.htm", true);
    xhr.send(null);
}

var COURSE_NUM = 16;
var DESIGN_TYPE = 10;
var PROGRAM_TYPE = 20;
var courseType = DESIGN_TYPE;
var page = document.getElementById("pager");

function SwitchCourseType() {
    var tab = document.getElementsByClassName("m-tab")[0];
    var designTab = tab.getElementsByTagName("a")[0];
    var programTab = tab.getElementsByTagName("a")[1];

    if (courseType === DESIGN_TYPE) {
        courseType = PROGRAM_TYPE;
        designTab.className = "tab f-fl";
        programTab.className = "tab-select f-fl";
    } else {
        courseType = DESIGN_TYPE;
        designTab.className = "tab-select f-fl";
        programTab.className = "tab f-fl";
    }
    loadCourse(courseType.toString(), COURSE_NUM.toString(), "1");
    var pagex = page.getElementsByClassName("page");
    pagex[0].className = "page pagei-selected f-fl";
}

function loadCourse(tabi, psize, pageNo) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                var courseList = JSON.parse(xhr.responseText);
                for (var i = 0; i < COURSE_NUM; i++) {
                    var course = document.getElementsByClassName("m-course")[i];
                    var title = course.getElementsByClassName("title")[0];
                    var name = title.getElementsByTagName("a")[0];
                    var dtlTitle = course.getElementsByClassName("dtl-title")[0];
                    var dtlName = dtlTitle.getElementsByTagName("a")[0];
                    var img = course.getElementsByTagName("img");
                    var dtlCategory = course.getElementsByClassName("dtl-category")[0];
                    var learner = course.getElementsByClassName("learner");
                    var provider = course.getElementsByClassName("provider");
                    var description = course.getElementsByClassName("m-desc")[0];
                    var price = course.getElementsByClassName("price")[0];
                    name.innerHTML = courseList.list[i].name;
                    name.title = courseList.list[i].name;
                    dtlName.innerHTML = courseList.list[i].name;
                    dtlName.title = courseList.list[i].name;
                    price.innerHTML = courseList.list[i].price == 0 ? "免费" : ("¥" + courseList.list[i].price);
                    for (var n = 0; n < img.length; n++) {
                        img[n].src = courseList.list[i].middlePhotoUrl;
                    }
                    dtlCategory.innerHTML = courseList.list[i].categoryName;
                    description.innerHTML = courseList.list[i].description;
                    learner[0].innerHTML = courseList.list[i].learnerCount;
                    learner[1].innerHTML = courseList.list[i].learnerCount + "人在学";
                    for (var n = 0; n < provider.length; n++) {
                        provider[n].innerHTML = courseList.list[i].provider;
                    }
                }
            }
        }
    };

    var url = "http://study.163.com/webDev/couresByCategory.htm";
    url = addURLParam(url, "pageNo", pageNo);
    url = addURLParam(url, "psize", COURSE_NUM);
    url = addURLParam(url, "type", tabi);
    xhr.open("get", url, true);
    xhr.send(null);
}

function switchPage() {
    var getElement = function(eve, filter) {
        var element = eve.target;
        while (element) {
            if (filter(element)) {
                return element;
            }
            element = element.parentNode;
        }
    };

    return function(event) {
        var pagei = getElement(event, function(ele) {
            return ((ele.className.indexOf("pagei") !== -1) || (ele.className.indexOf("prev-page") !== -1) || (ele.className.indexOf("next-page") !== -1));
        });
        event.preventDefault();
        var index = pagei.dataset.index;
        var indexOn = index;
        var pageOn = document.getElementsByClassName("page pagei-selected f-fl")[0];
        if (index == "prev") {
            if (pageOn.dataset.index == "1") return;
            indexOn = parseInt(pageOn.dataset.index) - 1;
        } else if (index == "next") {
            if (pageOn.dataset.index == "8") return;
            indexOn = parseInt(pageOn.dataset.index) + 1;
        } else {
            indexOn = pagei.dataset.index;
        }
        var pagex = page.getElementsByClassName("page");
        for (var i = 0; i < pagex.length; i++) {
            if (pagex[i].dataset.index == indexOn) {
                pagex[i].className = "page pagei-selected f-fl";
            } else {
                pagex[i].className = "page pagei f-fl";
            }
        }
        loadCourse(courseType, COURSE_NUM, indexOn);
    };
}

/*------------------轮播--------------*/
var SPEED = 500;
var STEP = 10;
var NUMBER = 3;
// var INTERVAL = 50;
var DURATION = 5000;
var ANIMATED = false;
var WIDTH = 1330;
var imgIdx = 0;
var imgList = document.getElementById("img-list");
// var imgArr = imgList.getElementsByTagName("li");
var ctrlList = document.getElementsByClassName("circle-wrap")[0];
var ctrlArr = ctrlList.getElementsByTagName("span");
var next = document.getElementById("next-arrow");
var prev = document.getElementById("prev-arrow");
imgList.style.left = "-1330px"; //????

// var autoChange = setInterval(function() {
//     if (imgIdx < NUMBER) {
//         imgIdx++;
//     } else {
//         imgIdx = 0;
//     }
//     changePic(imgIdx);
// }, DURATION);
function getNum(str) {
    if (!str) {
        return 0;
    } else {
        return parseInt(str.split("px")[0]);
    }
}

function showControl(idx) {
    for (var i = 0; i < NUMBER; i++) {
        if (i === idx) {
            ctrlArr[i].id = "circleOn";
        } else {
            ctrlArr[i].id = "";
        }
    }
}

// var fadeIn = function(ele) {
//     ele.style.opacity = 0;
//     var stepLength = STEP / SPEED;
//     var step = function() {
//         if (stepLength <= 1.0) {
//             ele.styel.opacity += stepLength;
//         } else {
//             clearInterval(intervalId);
//             ele.style.opacity = 1;
//         }
//     };
//     var intervalId = setInterval(step, INTERVAL);
// };

function animate(offset) {
    if (offset == 0) {
        return;
    }

    ANIMATED = true;
    var stepLength = Math.floor(offset * STEP / SPEED);
    var left = getNum(imgList.style.left) + offset;

    var go = function() {
        if (stepLength > 0 & getNum(imgList.style.left) <= left || stepLength < 0 & getNum(imgList.style.left) >= left) {
            imgList.style.left = getNum(imgList.style.left) + stepLength + "px";
            setTimeout(go, STEP);
        } else {
            imgList.style.left = left + "px";
            if (left > -100) {
                imgList.style.left = -WIDTH * NUMBER + "px"; //变回最后一张的位置
            }
            if (left < (-WIDTH * NUMBER)) {
                imgList.style.left = -WIDTH + "px";
            }
            ANIMATED = false;
        }
    };
    go();
}

next.onclick = function() {
    if (ANIMATED) {
        return;
    }
    if (imgIdx === NUMBER - 1) {
        imgIdx = 0;
    } else {
        imgIdx += 1;
    }
    animate(-WIDTH);
    showControl(imgIdx);
};

prev.onclick = function() {
    if (ANIMATED) {
        return;
    }
    if (imgIdx === 0) {
        imgIdx = 2;
    } else {
        imgIdx -= 1;
    }
    animate(WIDTH);
    showControl(imgIdx);
};

var autoChange = setInterval(function() {
    next.onclick();
}, DURATION);

var play = function() {
    autoChange;
};

var stop = function() {
    clearInterval(autoChange);
};

// imgList.addEventListener("mouseover", (function() {
//     return function() {
//         clearInterval(autoChange);
//     };
// })());

// imgList.addEventListener("mouseout", (function() {
//     return autoChange;
// })());
imgList.addEventListener("mouseover", function() {
    stop();
});
imgList.addEventListener("mouseout", function() {
    autoChange = setInterval(function() {
        next.onclick();
    }, DURATION);
});


ctrlList.addEventListener("click", function() {
    var event = window.event || arguments[0];
    var ele = event.target || event.srcElement;
    var myIdx = getNum(ele.dataset.index);
    var offset = -WIDTH * (myIdx - imgIdx);
    animate(offset);
    showControl(myIdx);
    imgIdx = myIdx;
}, false);

window.onload = function() {
    isFollow();
    play();
    getTopRank();
    // loadCourse(DESIGN_TYPE.toString(), COURSE_NUM.toString(), "1");
    SwitchCourseType();
    page.addEventListener("click", switchPage(), false);
};
