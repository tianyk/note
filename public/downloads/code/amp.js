(function () {
	function onerror(msg, source, line, col, error) {
		//没有URL不上报！上报也不知道错误
		if (msg != 'Script error.' && !source) {
			return true;
		}

		setTimeout(function () {
			var data = {};
			// 不一定所有浏览器都支持col参数
			col = col || (window.event && window.event.errorCharacter) || 0;

			data.source = source;
			data.line = line;
			data.col = col;

			if (!!error && !!error.stack) {
				// 如果浏览器有堆栈信息
				// 直接使用
				data.msg = error.stack.toString();
			} else if (arguments.callee) {
				// 尝试通过callee拿堆栈信息
				var ext = [];
				var f = arguments.callee.caller,
					c = 3;
				// 这里只拿三层堆栈信息
				while (f && (--c > 0)) {
					ext.push(f.toString());
					if (f === f.caller) {
						break; // 如果有环
					}
					f = f.caller;
				}
				ext = ext.join(',');
				data.msg = ext;
			}

			// 上报
			var REPORT_URL = 'http://training.51talk.com/amp/report?'; // 收集上报数据的信息
			var m = ['logtime=' + (new Date()).toISOString()];
			for (var key in data) m.push(key + '=' + data[key]);
			var url = REPORT_URL + m.join('&'); // 组装错误上报信息内容URL
			var img = new Image;
			img.onload = img.onerror = function () {
				img = null;
			};
			img.src = url;
		}, 0);

		return true;
	};


	function _performance() {
		var perf = (window.webkitPerformance ? window.webkitPerformance : window.msPerformance),
			perf = perf ? perf : window.performance;
		if (perf && perf.timing) {
			var timing = perf.timing;

			// https://w3c.github.io/navigation-timing/timestamp-diagram.svg
			var data = {};
			// 重定向次数：
			data.redirectCount = perf.navigation.redirectCount;
			// 跳转耗时：
			data.redirect = timing.redirectEnd - timing.redirectStart;
			// APP CACHE 耗时：
			data.appcache = Math.max(timing.domainLookupStart - timing.fetchStart, 0);
			// DNS 解析耗时：
			data.dns = timing.domainLookupEnd - timing.domainLookupStart;
			// TCP 链接耗时：
			data.conn = timing.connectEnd - timing.connectStart;
			// 等待服务器响应耗时（注意是否存在cache）：
			data.request = timing.responseStart - timing.requestStart;
			// 内容加载耗时（注意是否存在cache）:
			data.response = timing.responseEnd - timing.responseStart;
			// 总体网络交互耗时，即开始跳转到服务器资源下载完成：
			data.network = timing.responseEnd - timing.navigationStart;
			// 渲染处理：
			data.processing = (timing.domComplete || timing.domLoading) - timing.domLoading;
			// 抛出 load 事件：
			data.load = timing.loadEventEnd - timing.loadEventStart;
			// 总耗时：
			data.total = (timing.loadEventEnd || timing.loadEventStart || timing.domComplete || timing.domLoading) - timing.navigationStart;
			// 可交互：
			data.active = timing.domInteractive - timing.navigationStart;
			// 请求响应耗时，即 T0，注意cache：
			data.t0 = timing.responseStart - timing.navigationStart;
			// 首次出现内容（白屏时间），即 T1：
			data.t1 = timing.domLoading - timing.navigationStart;
			// 内容加载完毕，即 T3：
			data.t3 = timing.loadEventEnd - timing.navigationStart;

			var REPORT_URL = 'http://training.51talk.com/amp/perf?';
			var m = ['logtime=' + (new Date()).toISOString()];
			for (var key in data) m.push(key + '=' + data[key]);
			// for (var key in timing) m.push(key + '=' + timing[key]);
			var url = REPORT_URL + m.join('&'); // 组装错误上报信息内容URL
			var img = new Image;
			img.onload = img.onerror = function () {
				img = null;
			}
			img.src = url;
		}
	}

	function onload() {
		setTimeout(_performance, 0);
	}

	if (window.addEventListener) {
		window.addEventListener('error', function (evt) {
			console.log(evt.filename)
			onerror(evt.message, evt.filename, evt.lineno, evt.colno, evt.error);
		});
		window.addEventListener('load', onload);
	} else if (window.attachEvent) {
		// window.attachEvent('onerror', function (evt) {
		// 	onerror(evt.message, evt.filename, evt.lineno, evt.colno, evt.error);
		// });
		window.attachEvent('onload', onload);
	} else {
		var errorHandler = window.onerror;
		window.onerror = function () {
			console.log(Array.prototype.slice.call(arguments))
			var args = Array.prototype.slice.call(arguments);
			onerror(args);
			if (typeof errorHandler === 'function') errorHandler.apply(window, args);
		}

		var loadHandler = window.onload;
		window.onload = function (evt) {
			onload(evt); // loadHandler may throws, so call log first
			if (typeof loadHandler === 'function') loadHandler.call(window, evt);
		}
	}
})();
