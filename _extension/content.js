console.log("CONTENT PAGE LETS GO");

if (jQuery) {  
    console.log('jquery loaded')
} else {
    console.log("jQuery not loaded")
}


chrome.storage.sync.get('procrastinate_better', function(result) {
	console.log(result);
	var saved_sites = result.procrastinate_better.saved_sites;
	$.each(saved_sites, function(i ,item) {
		console.log(item);
		var title = item.title;
		var url = item.pageUrl;
		var icon = item.favicon ? item.favicon : "icon.png";
		var output = `
			<a href="${url}" class="list-group-item list-group-item-action waves-effect">
				<img src="${icon}">
				${title}
			</a>
		`;
		$('.list-group').append(output);
	})
})

