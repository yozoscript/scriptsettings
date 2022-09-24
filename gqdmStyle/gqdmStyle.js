// ==UserScript==
// @name        异世界动漫 功能优化
// @description 为异世界动漫进行界面优化，增加宽屏模式（默认启动），增加弹幕屏蔽词
// @namespace   gqdmStyle
// @grant       unsafeWindow
// @version     1.1.0
// @author      Yozo
// @match       https://www.gqdm.net/index.php/vod/play/*
// @match       https://bf.sbdm.cc/*
// @match       https://yozoscript.github.io/scriptsettings/gqdmStyle/
// @connect     gqdm.net
// @connect     www.gqdm.net
// @connect     bf.sbdm.cc
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @run-at      document-start
// @website     https://eric2788.github.io/scriptsettings/highlight-user
// @homepage    https://eric2788.neeemooo.com/scriptsettings/highlight-user
// ==/UserScript==

const DefaultList = [
  "蛙", "湾湾", "小日子", "美爹", "你国", "中国", "天朝", "难看", "你们只(.*)吗", "剧透"
]
var BanList = GM_getValue('BanList', DefaultList)

var rootWidth = GM_getValue('rootWidth', 70)

function domChange(domId, callback, runIm) {
    // select the target node
    var target = document.getElementById(domId);
    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (callback) callback();
        });
    });
    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };
    // pass in the target node, as well as the observer options
    observer.observe(target, config);
    // later, you can stop observing
    //observer.disconnect();
    if (runIm && callback) callback();
}
function domChangeClass(domClass, callback, runIm) {
    // select the target node
    var target = document.getElementsByClassName(domClass)[0];
    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (callback) callback(target);
        });
    });
    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };
    // pass in the target node, as well as the observer options
    observer.observe(target, config);
    // later, you can stop observing
    //observer.disconnect();
    if (runIm && callback) callback(target);
}

async function sleep(ms){
   return new Promise((res,) => setTimeout(res,ms))
}

var isKuan = false
var exec = async function () {
   'use strict';
    if (location.host == "www.gqdm.net" || location.host == "gqdm.net"){
        window.window.addEventListener('message', function(event) {
            if (event.data == "kuanping") {
                if (!isKuan) {
                    isKuan = true
                    if (document.getElementsByClassName("right_row fr hidden_xs hidden_mi").length > 0) {
                        document.getElementsByClassName("container")[0].setAttribute("style", `width:${rootWidth}%;`)
                        document.getElementsByClassName("right_row fr hidden_xs hidden_mi")[0].setAttribute("style", document.getElementsByClassName("right_row fr hidden_xs hidden_mi")[0].getAttribute("style") + "display:none;")
                        document.getElementsByClassName("left_row fl")[0].setAttribute("style", "width: 100%;")
                        document.getElementsByClassName("left_row fl")[0].children[0].setAttribute("style", "height: 100%;")
                        document.getElementsByClassName("MacPlayer embed-responsive")[0].style.setProperty("padding-block", "92px 56%")
                        document.getElementsByClassName("MacPlayer embed-responsive")[0].style.removeProperty("padding-bottom")
                    }

                    if (document.getElementById("root")) {
                        document.getElementById("root").setAttribute("style", "width: 85%;")
                        document.getElementById("ageframediv").attributes[1].value = "width: 85%;"
                        document.getElementsByClassName("MacPlayer embed-responsive embed-responsive-16by9")[0].style.setProperty("padding-top", "56%")
                    }
                } else {
                    isKuan = false
                    if (document.getElementsByClassName("right_row fr hidden_xs hidden_mi").length > 0) {
                        document.getElementsByClassName("container")[0].removeAttribute("style")
                        document.getElementsByClassName("right_row fr hidden_xs hidden_mi")[0].setAttribute("style", document.getElementsByClassName("right_row fr hidden_xs hidden_mi")[0].getAttribute("style").replace("display:none;",""))
                        document.getElementsByClassName("left_row fl")[0].removeAttribute("style")
                        document.getElementsByClassName("left_row fl")[0].children[0].removeAttribute("style")
                        document.getElementsByClassName("MacPlayer embed-responsive")[0].style.setProperty("padding-bottom", "56.25%")
                        document.getElementsByClassName("MacPlayer embed-responsive")[0].style.removeProperty("padding-block")
                    }

                    if (document.getElementById("root")) {
                        document.getElementById("root").removeAttribute("style")
                        document.getElementById("ageframediv").attributes[1].value = "width: 980px; height: 540px;"
                        document.getElementsByClassName("MacPlayer embed-responsive embed-responsive-16by9")[0].style.setProperty("padding-top", "45%")
                    }
                }
            }
        })
        window.window.postMessage("kuanping")

    }
    else if (location.host == "bf.sbdm.cc"){
        domChange("player", () => {
          var pp = document.getElementById("player_pause")
          if(pp) pp.setAttribute("style", "display: none;")
        })

        var danmakuI = setInterval(() => {
          if (document.getElementsByClassName("leleplayer-danmaku").length <= 0) return
          console.log("danmaku obversing")
          clearInterval(danmakuI)
          domChangeClass("leleplayer-danmaku", (target) => {
            for (let i = 0; i < target.children.length; i++ ) {
              let inner = target.children[i].innerText
              if (inner) {
                let hasbw = false
                for(let bw in BanList) {
                  if (inner.match(BanList[bw])) {
                    hasbw = true
                    break
                  }
                }
                if (hasbw) {
                  target.removeChild(target.children[i])
                }
              }
            }
          })
        }, 100)

        var btnI = setInterval(() => {
            if (!$("#enterhzh").length) return
            clearInterval(btnI)

            $("#enterhzh").after(`<button id="enterkuan" class="leleplayer-icon leleplayer-full-in-icon" data-balloon="宽屏模式" data-balloon-pos="up">
                <span class="leleplayer-icon-content"><svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><g fill="#E6E6E6" fill-rule="evenodd">
                  <!-- <path d="M17 4a2 2 0 012 2v11h-2V6.8a.8.8 0 00-.8-.8H4.8a.8.8 0 00-.794.7L4 6.8v8.4a.8.8 0 00.7.794l.1.006H18v2H4a2 2 0 01-2-2V6a2 2 0 012-2h13z"></path> -->
                  <rect id="huazhonghua" x="2.5" y="5" width="16" height="12" rx="1" style=" fill-opacity:0;stroke-width:2;stroke:white"></rect>
                  <rect id="huazhonghua" x="7" y="8" width="7" height="6" rx="1"></rect>
                  </g></svg></span>
                </button>`)
            document.getElementById("enterkuan").onclick = () => {
                window.parent.postMessage("kuanping", "*")
            }
        })
    }
	else if (location.host == "yozoscript.github.io"){
		while(!unsafeWindow.mdui){
           console.debug('cannot find mdui, wait one second')
           await sleep(1000)
        }
		//BanList
		var banstr = BanList..join(';')
		$('#banListStr')[0].value = banstr
		
		$('#rootWidth')[0].value = rootWidth
		
		$('#saveBtn').on('click', e => {
			var list = $('#banListStr')[0].value.replaceAll("；",";").split(';')
			GM_setValue('BanList', list)
			var width = parseInt(($('#rootWidth')[0].value).toString())
			GM_setValue('rootWidth', )
            mdui.snackbar('保存成功')
        })
	}
}
onload = () => {
    exec();
}