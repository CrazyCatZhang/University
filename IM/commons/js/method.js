export default {
	dateTime(e) {
		let old = new Date(e);
		let now = new Date();
		//获取old时间
		let d = old.getTime();
		let h = old.getHours();
		let m = old.getMinutes();
		let Y = old.getFullYear();
		let M = old.getMonth() + 1;
		let D = old.getDate();
		//获取now时间
		let nd = now.getTime();
		let nh = now.getHours();
		let nm = now.getMinutes();
		let nY = now.getFullYear();
		let nM = now.getMonth() + 1;
		let nD = now.getDate();

		if (D === nD && M === nM && Y === nY) {
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return h + ':' + m;
		}

		if (D + 1 === nD && M === nM && Y === nY) {
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return '昨天' + h + ':' + m;
		} else {
			return Y + '/' + M + '/' + D;
		}
	},


	//详细时间
	detailTime(e) {
		let old = new Date(e);
		//获取old时间
		let d = old.getTime();
		let h = old.getHours();
		let m = old.getMinutes();
		let Y = old.getFullYear();
		let M = old.getMonth() + 1;
		let D = old.getDate();

		if (M < 10) {
			M = '0' + M;
		}
		if (D < 10) {
			D = '0' + D;
		}
		if (h < 10) {
			h = '0' + h;
		}
		if (m < 10) {
			m = '0' + m;
		}

		return Y + '-' + M + '-' + D + ' ' + h + ':' + m;
	}
}
