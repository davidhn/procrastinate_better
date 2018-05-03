console.log("THIS IS THE BACKGROUND!");

// chrome.storage.sync.clear();

// should probably give users ability to destroy or save the sites
//need to initialize previously stored data
var init_storage = {
	procrastinate_better: {
		pb_status: 'on',
		saved_sites: new Array()
	}
}

// seeding the plugin with previously stored data
// chrome.storage.sync.set(init_storage, function() {
// 	// get chrome storage object
// 	chrome.storage.sync.get( null, function(result) {
// 		console.log(result.procrastinate_better);
// 	})
// });	

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "add_to_pb_list",
    title: "Add to Procrastination List",
    type: 'normal',
    contexts: ['all'],
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    console.log(info);
    console.log(tab);
	chrome.storage.sync.get('procrastinate_better', function(result) {

		var pb = result.procrastinate_better.saved_sites,
			new_saved_site = {
				favicon: tab.favIconUrl,
				pageUrl: tab.url,
			 	title: tab.title
			}

		pb.unshift(new_saved_site);

		chrome.storage.sync.set({'procrastinate_better': result.procrastinate_better}, function() {
			console.log(result.procrastinate_better);
		})
	})
})


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    chrome.storage.sync.get('procrastinate_better', (items) => {
        console.log(items.procrastinate_better.pb_status);

        if (items.procrastinate_better.pb_status == "on" && changeInfo.status == "loading") {
            var newUrl = tab.url;
            console.log(newUrl);
            if (newUrl.includes("facebook.com")) {
                redirectToSite(tab)
            }
        } 
    }); 

    
    // when popup value changes, update the chrome value

});


chrome.alarms.onAlarm.addListener(function( alarm ) {
  console.log("Got an alarm!", alarm);
});


// chrome.tabs.query({'active': true}, function(tabs) {
// 	console.log(tabs);	
//   chrome.tabs.update(tabs[0].id, {url: newUrl});
// });

// chrome.tabs.onUpdated.addListener(function() {
//   alert('updated from background');
// });

// chrome.webRequest.onBeforeRequest.addListener(
//   function(tabs) { 
//     console.log(tabs);
//     chrome.tabs.update(tabs[0].id, {url: "https://google.com"});
//   }, {urls: ["*://*.facebook.com/"]}, []
// );

function reloadTabs() {
    getLinkList(function (storageObj) {
        getForceRefresh(function (refreshObj) {
            if (refreshObj == 1) {
                var linkList = storageObj;
                linkList.forEach(matchTab);
            }
        });

    });

}

function reloadForeverTabs() {
    getForeverLinkList(function (storageObj) {
        getForceRefresh(function (refreshObj) {
            if (refreshObj == 1) {
                var linkList = storageObj;
                linkList.forEach(matchTab);
            }
        });

    });

}


function matchTab(element, index, array) {
    var patternedUrl = ["http://*." + element + "/*", "https://*." + element + "/*"];
    chrome.tabs.query({
        url: patternedUrl
    }, function (tabArray) {

        if (typeof tabArray != 'undefined' && tabArray instanceof Array) {
            tabArray.forEach(reloadTab);
        }

    });

}

function reloadTab(element, index, array) {
    chrome.tabs.reload(element.id, function () {
        console.log(element.id + " reloaded");
    });
}

function redirectToSite(tab, uriObj) {
    var locale = chrome.i18n.getUILanguage();
    var prev = "";
    if (uriObj) {
        prev = "&prev=";
        prev += encodeURIComponent(uriObj.domain());
    }
    chrome.tabs.update(tab.id, {
        url: "https://procrastinatebetter.com/"
        // ?lang=" + locale + prev
    });
}

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        chrome.runtime.openOptionsPage();
    }
});

chrome.runtime.onStartup.addListener(function () {
    buildBreakAlarms();
});



window.addEventListener("PassToBackground", function(evt) {
  chrome.runtime.sendMessage(evt.detail);
}, false);



// chrome.alarms.onAlarm.addListener(function (alarm) {
//     getForceRefresh(function (refreshObj) {
//         if (refreshObj == 1) {
//             console.log("alarm fired");
//             reloadTabs();
//         }
//     });
// });

// chrome.storage.onChanged.addListener(function (changes, namespace) {
//     if (changes.noPause) {
//         if (changes.noPause.newValue == 1) {
//             getForceRefresh(function (refreshObj) {
//                 if (refreshObj == 1) {
//                     console.log("noPause Changed");
//                     reloadTabs();
//                 }
//             });
//         }
//     }
//     if (changes.forceRefresh) {
//         if (changes.forceRefresh.newValue == 1) {
//             console.log("Refresh On");
//             getBlockTime(function (blockTime) {
//                 if (blockTime == 0) {
//                     reloadTabs();
//                 } else {
//                     reloadForeverTabs();
//                 }
//             });
//         }
//     }


//     if (changes.linkList) {
//         console.log("List Changed");
//         getBlockTime(function (blockTime) {
//             getForceRefresh(function (refreshObj) {
//                 if (refreshObj == 1) {
//                     if (blockTime == 0) {
//                         reloadTabs();
//                     }
//                 }
//             });


//         });

//     }

//     if (changes.foreverLinkList) {
//         console.log("Forever List Changed");
//         getForceRefresh(function (refreshObj) {
//                 if (refreshObj == 1) {
//                     reloadForeverTabs();
//                 }
            
//         });
// }


// });

//Open Exit Page
chrome.runtime.setUninstallURL("https://www.procrastinatebetter.com/bye.html");