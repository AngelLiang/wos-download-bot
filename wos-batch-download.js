// ==UserScript==
// @name         Wos Batch Download
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Batch download Wos
// @author       AngelLiang
// @match        https://www.webofscience.com/wos
// @match        https://www.webofscience.com/wos/woscc/summary/*/relevance/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webofscience.com
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// @connect      *
// @license      MIT
// ==/UserScript==


(function() {
    'use strict';

    const DOWNLOAD_URL = "https://www.webofscience.com/api/wosnx/indic/export/saveToFile";
    var total = "";
    var perPage = 500

    var uuid = ""
    var wosSid = ""
    var waitSecond = null

    function getTotal() {
        total = $(".brand-blue").text()
        total = total.replace(",", "")
        total = parseInt(total)
        return total
    }

    // 根据index获取页码数量
    function getNextPage(index) {
        let start = 1 + index * perPage
        let stop = perPage + index * perPage
        return [""+start, ""+stop]
    }

    // 获取期刊的uuid
    function getParentQid() {
        let currUrl = String(window.location.href);
        return currUrl.split('/')[6]
    }

    // 生成请求页面数
    function genRequestPageNumber() {
        total = getTotal()
        let number = total / perPage
        return Math.ceil(number)
    }

    function genRequestData(start, stop) {
        let uuid = getParentQid()
        let requestJson = {
            "parentQid": uuid,
            "sortBy": "relevance",
            "displayTimesCited": "true",
            "displayCitedRefs": "true",
            "product": "UA",
            "colName": "WOS",
            "displayUsageInfo": "true",
            "fileOpt": "othersoftware",
            "action": "saveToFieldTagged",
            "markFrom": start,
            "markTo": stop,
            "view": "summary",
            "isRefQuery": "false",
            "locale": "en_US",
            "filters": "fullRecordPlus",
            "bm-telemetry": "7a74G7m23Vrp0o5c9350811.75-1,2,-94,-100,"+navigator.userAgent+",uaend,12147,20030107,zh-CN,Gecko,5,0,0,0,408230,4830241,1920,1040,1920,1080,901,793,1806,,cpen:0,i1:0,dm:0,cwen:0,non:1,opc:0,fc:0,sc:0,wrc:1,isc:0,vib:1,bat:1,x11:0,x12:1,8101,0.0127919236,829577445530.5,0,loc:-1,2,-94,-131,"+navigator.userAgent+"-1,2,-94,-101,do_en,dm_en,t_en-1,2,-94,-105,-1,2,-94,-102,0,-1,1,0,1022,831,0;0,-1,1,0,1023,622,0;0,-1,0,0,-1,1004,0;0,-1,1,0,1328,-1,0;0,-1,1,0,1650,-1,0;0,-1,0,0,2108,2108,0;-1,2,-94,-108,0,1,70702,-2,0,0,831;1,3,70706,-2,0,0,831;2,2,70819,-2,0,0,831;3,1,72131,-2,0,0,622;4,3,72132,-2,0,0,622;5,2,72243,-2,0,0,622;-1,2,-94,-110,0,1,1428,415,821;1,1,1437,416,821;2,1,1450,417,822;3,1,1460,418,823;4,1,1461,418,824;5,1,1468,420,824;6,1,1483,422,826;7,1,1484,422,827;8,1,1493,423,828;9,1,1500,425,828;10,1,1528,427,830;11,1,1530,429,831;12,1,1539,430,832;13,1,1540,432,833;14,1,1554,435,836;15,1,1555,437,838;16,1,1566,440,841;17,1,1571,442,843;18,1,1583,443,845;19,1,1587,445,847;20,1,1600,446,848;21,1,1651,447,848;22,1,1660,448,848;23,1,1683,448,847;24,1,1694,451,846;25,1,1731,454,843;26,1,1732,456,841;27,1,1743,457,837;28,1,1749,462,832;29,1,1761,467,828;30,1,1773,480,812;31,1,1794,494,802;32,1,1796,515,790;33,1,1798,541,771;34,1,1827,658,679;35,1,1829,700,646;36,1,1840,739,619;37,1,1849,769,600;38,1,1851,795,589;39,1,1861,818,586;40,1,1868,837,584;41,1,1876,851,583;42,1,1883,866,583;43,1,1893,880,583;44,1,1899,891,583;45,1,1914,905,583;46,1,1915,916,588;47,1,1923,926,589;48,1,1931,937,594;49,1,1939,948,600;50,1,1951,954,605;51,1,1955,961,611;52,1,1963,965,614;53,1,1971,968,617;54,1,1979,970,621;55,1,2044,970,622;56,1,2052,969,622;57,1,2060,967,621;58,1,2068,964,620;59,1,2076,963,616;60,1,2085,962,610;61,1,2093,961,601;62,1,2100,961,592;63,1,2110,965,580;64,1,2116,974,567;65,1,2126,981,552;66,1,2132,989,537;67,1,2140,997,521;68,1,2148,1005,505;69,1,2156,1014,493;70,1,2164,1025,481;71,1,2173,1035,467;72,1,2180,1044,453;73,1,2187,1051,437;74,1,2196,1058,424;75,1,2204,1065,412;76,1,2211,1072,402;77,1,2219,1078,394;78,1,2228,1085,386;79,1,2266,1106,369;80,1,2268,1110,366;81,1,2279,1113,364;82,1,5509,1117,429;83,1,21588,965,720;84,1,21596,964,720;85,1,21603,961,720;86,1,21611,961,719;87,1,21652,960,718;88,1,21725,957,717;89,1,21819,958,716;90,1,21827,959,715;91,1,21851,961,714;92,1,21876,962,714;93,1,21891,963,714;94,1,21899,965,714;95,1,21955,966,714;96,1,21979,967,714;97,1,46935,798,396;98,1,46935,798,396;99,1,46956,797,396;360,3,64288,666,398,-1;363,4,64359,666,397,-1;364,2,64360,666,397,-1;497,3,66932,625,472,2577;498,4,67034,625,472,2577;499,2,67035,625,472,2577;578,3,68052,239,610,-1;579,4,68131,239,610,-1;580,2,68132,239,610,-1;581,2,68137,239,610,1716;674,3,69388,311,623,831;676,4,69405,269,626,578;677,2,69405,269,626,-1;779,3,71217,416,627,622;797,4,71580,377,627,-1;798,2,71581,377,627,-1;884,3,73219,449,750,-1;886,4,73283,449,750,-1;887,2,73284,449,750,-1;947,3,74276,411,836,-1;948,4,74364,411,836,-1;949,2,74364,411,836,-1;988,3,75900,251,804,-1;989,4,76452,251,804,-1;990,2,76452,251,804,-1;-1,2,-94,-117,-1,2,-94,-111,-1,2,-94,-109,-1,2,-94,-114,-1,2,-94,-103,2,2970;3,64284;-1,2,-94,-112,"+window.location.href+"(overlay:export/exp)-1,2,-94,-115,433108,2557265,32,0,0,0,2990340,76458,0,1659154891061,21,17749,6,991,2958,16,0,76460,5257213,0,E55226E933D4E02F778267D79B043483~0~YAAQr4FtaPwq5y6CAQAAzZ5VTQg9iuzUIoxOSG31h5KDYk4QiodZfGkFl/5XtA2eYoG9xM+HiCOL0qkBMtTHjPYT0RNO5fwe5Dj2KrRxvj9OwNHvKpmYf+rA6BRl2AktB2ny8+2Q+GlhwrXfVdMZ8HLdJX77kBbGZ0Ls8OumdAYYNvRkDIhnBiCplQzG7gSPyz2ijr0jbKetFCVuzPd1gSbmRoaIN4pA92crowkdQRDNwB/53YhRQj+FH0rQ1k2YKgFJr9qCns1ZF3tRP+iuKJ2mFt5kZQ++IA/TSsJO5OvIY6dCkyFz8ZWPfODQluh3RFTNTpGcR68cm4No6hsy9Uq3K8fiOmUxQh3096zr9vGw1+n607vBZETsQNfKx0ZrvenhuixVrU+eqpl6mEQc6ReZQocb646lKiHIEFvt~-1~-1~-1,38807,71,277344428,30261693,PiZtE,90331,83,0,-1-1,2,-94,-106,1,0-1,2,-94,-119,-1-1,2,-94,-122,0,0,0,0,1,0,0-1,2,-94,-123,-1,2,-94,-124,-1,2,-94,-126,-1,2,-94,-127,-1,2,-94,-70,420217769;1243744842;dis;,7;true;true;true;-480;true;24;24;true;false;-1-1,2,-94,-80,5437-1,2,-94,-116,72453624-1,2,-94,-118,238047-1,2,-94,-129,-1,2,-94,-121,;4;7;0"
        }
        let requestData = JSON.stringify(requestJson)
        return requestData
    }

    function downloadFile(fileName, data){
        var a = document.createElement("a");
        a.href = "data:text," + data;   //content
        a.download = fileName;            //file name
        a.click();
    }

    function sleep(delay) {
        for(var t = Date.now(); Date.now() - t <= delay;);
    }

    // 生成随机数
    function randomNum(minNum, maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
            default:
                return 0;
        }
    }

    function enableDownloadButton(){
        $("#downloadButton").val('正在下载...')
        $("#downloadButton").attr("disabled", false);
    }

    function disableDownloadButton(){
        $("#downloadButton").val('一键下载')
        $("#downloadButton").attr("disabled", true);
    }

    function requestFile(i, number, total, callback) {
        if (waitSecond == null) {
            waitSecond = prompt("请输入下载间隔时间，单位秒", "60");
            if (waitSecond ==  null) {
                return
            }
            waitSecond = parseInt(waitSecond)
            if(waitSecond < 20 ) {
                alert("下载间隔时间不建议小于20s");
                return
            }
        }
        if (waitSecond == null) {
            return
        }

        disableDownloadButton()
        var nextPageParam = getNextPage(i - 1)
        var start = nextPageParam[0]
        var stop = nextPageParam[1]
        if (stop > total) {
            stop = "" + total;
        }
        //console.log(nextPageParam)

        var requestData = genRequestData(start, stop)
        console.log("正在下载" + start + "到" + stop + "份数据，总共" + total + "份")

        let reqAjax = $.ajax({
            url:DOWNLOAD_URL,
            type: 'POST',
            headers: {
                "x-1p-wos-sid": wosSid,
                "content-type": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9"
            },
            "crossDomain": true,
            data: requestData,
            success: function(result){
                //console.log(result);
                let filename = ""+ nextPageParam[0] + '-' + nextPageParam[1] + '.txt'
                downloadFile(filename, result)
            },
            error: function(err){
                console.log(err);
                enableDownloadButton()
                alert('下载出错')
            }
        })

        $.when(reqAjax).done(function(){
            var nextIndex = i+1
            if (nextIndex > number) {
                enableDownloadButton()
                console.log("===下载完成===");
                alert('下载完成')
                return
            }
            var sleepNum = randomNum(waitSecond - 5, waitSecond + 5)
            console.log("等待" + sleepNum + "秒后再下载")
            sleep(sleepNum*1000)
            callback(nextIndex, number, total, callback)
        })
    }

    function getSessionID(doc) {
        const sidRegex = /sid=([a-zA-Z0-9]+)/i;

        // session ID is embedded in the static page inside an inline <script>
        // if you have the right HttpOnly cookie set. if we can't find it, we
        // initialize our session as the web app does
        for (let scriptTag of doc.querySelectorAll('script')) {
            let sid = scriptTag.textContent.match(sidRegex);
            if (sid) {
                return sid[1];
            }
        }
        return null
    }

    function downloadCallback() {
        console.log("===下载文件===")
        wosSid = getSessionID(document)
        console.log(wosSid)
        uuid = getParentQid()
        console.log(uuid)
        let total = getTotal()
        console.log(total)
        let number = genRequestPageNumber(total)
        requestFile(1, number, total, requestFile)
    }

    function addButton() {
        console.log("addButton")
        $('body').append('<button id="downloadButton">一键下载</button>')
        $('#downloadButton').css('width', '120px')
        $('#downloadButton').css('position', 'absolute')
        $('#downloadButton').css('top', '120px')
        $('#downloadButton').css('right', '50px')
        $('#downloadButton').css('background-color', '#5e33bf')
        $('#downloadButton').css('color', 'white')
        $('#downloadButton').css('font-size', 'large')
        $('#downloadButton').css('z-index', 100)
        $('#downloadButton').css('border-radius', '5px')
        $('#downloadButton').css('text-align', 'center')

        $('#downloadButton').click(downloadCallback)
    };

    $(document).ready(function () {
        if (window.location.href.startsWith('https://www.webofscience.com')) {
            addButton()
        }
    })

})();
