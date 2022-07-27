

var dimmed;
window.onload = function(){

    //mask & layer popup close
    dimmed = document.querySelector(".mask");
    var popupClose = document.querySelector(".pop-close");
    var popup = document.querySelector(".popup");

    if(dimmed){
        dimmed.addEventListener("click", function(){
            this.style.display = "none";
            popup.style.display = "none";
        });
    }
    
    if(popupClose){
        popupClose.addEventListener("click", function(){
            popup.style.display = "none";
            dimmed.style.display = "none";
        });
    }


    //tab menu
    var btnTab = document.querySelectorAll(".tabList>li>button");
    if(btnTab){
        // btnTab.forEach(function(bt){
        //     bt.addEventListener("click", function(){
        //         console.log(this);
        //     })
        // });
        
        for(let i = 0; i < btnTab.length; i++){
            btnTab[i].addEventListener("click", function(e){
                let tabli = document.querySelectorAll(".tabList>li");
                let tabBox = document.querySelectorAll(".tabBox");

                // let tabli = document.querySelectorAll(".tabList>li>button");
                // console.log([].indexOf.call(tabli, e.target));
                tabli.forEach(e => {
                    e.classList.remove("active");
                });

                for(let j = 0; j < tabBox.length; j++){
                    tabBox[j].style.display = "none";
                }

                console.log(i);
                // console.log(this);
                // console.log(e.target.parentElement);

                let parentNode = e.target.parentElement;
                parentNode.classList.add("active");

                
                tabBox[i].style.display = "block";
                
            })

            console.log(i);
        }
    }    




};

// layer popup open
const openLayerPopup = () => {
    dimmed.style.display = "block";
    pop1.style.display = "block";
    popWid = pop1.offsetWidth;
    pop1.style.marginLeft  = "-" + popWid/2 + "px";
}



function alertPop(){
    let layerPopup = document.querySelector(".layerAlert");
    dimmed.style.display = "block";
    layerPopup.style.display = "block";
    popWid = layerPopup.offsetWidth;
    layerPopup.style.marginLeft  = "-" + popWid/2 + "px";    
}



function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myTable2");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }




// Calendar
var div, x, y, day, obj, mode, v_now_y, v_now_m;
var agent = navigator.userAgent;

function openCalendar(_obj, _mode) {
	div = document.createElement("div");
	div.id = "divCalendar";

	obj = _obj;
	mode = _mode;

    console.log(div);

    x = document.documentElement.clientLeft + GetObjectLeft(_obj);
    y = document.documentElement.clientTop + GetObjectTop(_obj);
	
	div.style.left = parseInt(x,10) + "px";
	div.style.top = parseInt(y + _obj.offsetHeight,10) + "px";

	var arrValue = _obj.value;

	if (arrValue.length == 10) {
		if (checkNumber(arrValue.substring(0,4) + arrValue.substring(5,7) + arrValue.substring(8,10))) {
			day = arrValue.substring(0,4) + "." + arrValue.substring(5,7) + "." + arrValue.substring(8,10);

			showCalendar(arrValue.substring(0,4), arrValue.substring(5,7), arrValue.substring(8,10), ' (현재선택)');
		}
	} else if (arrValue.length == 7) {
		if (checkNumber(arrValue.substring(0,4) + arrValue.substring(5,7))) {
			day = arrValue.substring(0,4) + "." + arrValue.substring(5,7);

			showCalendar(arrValue.substring(0,4), arrValue.substring(5,7), '01', ' (현재선택)');
		}
	}  else if (arrValue.length == 4) {
		if (checkNumber(arrValue.substring(0,4))) {
			day = arrValue.substring(0,4);

			showCalendar(arrValue.substring(0,4), '01', '01', ' (현재선택)');
		}
	} else {
		var now = new Date();

		day = now.getFullYear() + "." + ((parseInt(now.getMonth() + 1,10) < 10) ? "0" + (now.getMonth() + 1)  : (now.getMonth() + 1)) + "." + ((parseInt(now.getDate(),10) < 10) ? "0" + (now.getDate())  : (now.getDate()));

		showCalendar(now.getFullYear(), now.getMonth() + 1, now.getDate(), ' (오늘)');
	}
	
	if (mode == 'month') {
		document.getElementById("tableCalendarTitle").style.display = "none";
		document.getElementById("tableCalendar").style.display = "none";
		document.getElementById("tableMonthTitle").style.display = "";
		document.getElementById("tableMonth").style.display = "";
		document.getElementById("tableYearTitle").style.display = "none";
		document.getElementById("tableYear").style.display = "none";
	} else if (mode == 'year') {
		document.getElementById("tableCalendarTitle").style.display = "none";
		document.getElementById("tableCalendar").style.display = "none";
		document.getElementById("tableMonthTitle").style.display = "none";
		document.getElementById("tableMonth").style.display = "none";
		document.getElementById("tableYearTitle").style.display = "";
		document.getElementById("tableYear").style.display = "";
	}
}

function showCalendar(_year, _month, _day, _stat) {
	if (_stat) {
		var _title = _stat;
	}
	if(document.getElementById("divCalendar")) {
		document.getElementById("divCalendar").parentNode.removeChild(document.getElementById("divCalendar"));

		for(var i = document.getElementsByTagName("roundrect").length - 1; i > -1; i--) {
			document.getElementsByTagName("roundrect")[i].parentNode.removeChild(document.getElementsByTagName("roundrect")[i]);
		}

		div = document.createElement("div");
		div.id = "divCalendar";
		div.style.left = parseInt(x,10) + "px";
		div.style.top = parseInt(y + obj.offsetHeight,10) + "px";
	}

	var arrMonth = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
	var arrLastDay = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

	if(((parseInt(_year,10) % 4 == 0) && (parseInt(_year,10) % 100 != 0)) || (parseInt(_year,10) % 400 == 0)) {
		arrLastDay[2] = 29;
	}

	switch(parseInt(_month,10)) {
		case 1 :
			preYear = _year - 1;
			preMonth = 12;
			nxtYear = _year;
			nxtMonth = 2;
			break;
		
		case 12 :
			preYear = _year;
			preMonth = 11;
			nxtYear = _year + 1;
			nxtMonth = 1;
			break;
		
		default :
			preYear = _year;
			preMonth = parseInt(_month,10) - 1;
			nxtYear = _year;
			nxtMonth = parseInt(_month,10) + 1;
			break;
	}

	var firstDay = new Date(_year, _month -1, 1);
	var firstWeek = firstDay.getDay();
	var lastDay = arrLastDay[parseInt(_month,10)];
	var printDay = 1;

	var table, caption, colgroup, col, thead, tbody, tr, th, td, a, span;

	table = document.createElement("table");
	table.id = "tableYearTitle";
	table.style.display = "none";
	table.style.paddingBottom = "10px";

	colgroup = document.createElement("colgroup");
	col = document.createElement("col");
	col.style.width = "15%";
	
	colgroup.appendChild(col);

	col = document.createElement("col");
	col.style.width = "70%";
	
	colgroup.appendChild(col);

	col = document.createElement("col");
	col.style.width = "15%";
	
	colgroup.appendChild(col);
	table.appendChild(colgroup);

	tr = document.createElement("tr");
	td = document.createElement("td");
	
	a = document.createElement("a");
	a.href = "javascript:void(0);";
	a.id = "aFirstY";
	a.onclick = new Function("showYear(" + (parseInt(_year,10) - 12) + ", " + _month + ", " + _day + ");");
	a.innerHTML = "이전";

	td.appendChild(a);
	tr.appendChild(td);

	td = document.createElement("td");
	td.innerHTML = (parseInt(_year,10) - 5) + "년 ~ " + (parseInt(_year,10) + 6) + "년";

	tr.appendChild(td);

	td = document.createElement("td");

	a = document.createElement("a");
	a.href = "javascript:void(0);";
	a.onclick = new Function("showYear(" + (parseInt(_year,10) + 12) + ", " + _month + ", " + _day + ");");
	a.innerHTML = "다음";

	td.appendChild(a);
	tr.appendChild(td);
	table.appendChild(tr);
	div.appendChild(table);

	table = document.createElement("table");
	table.id = "tableYear";
	table.style.display = "none";

	caption = document.createElement("caption");

	colgroup = document.createElement("colgroup");
	
	for(var i = 0; i < 4; i++) {
		col = document.createElement("col");
		col.style.width = "25%";

		colgroup.appendChild(col);
	}

	table.appendChild(colgroup);
	tr = document.createElement("tr");
	
	checkNum = 1;

	for(var i = (parseInt(_year,10) - 5); i <= (parseInt(_year,10) + 6); i++) {
		if(checkNum == 5 || checkNum == 9) {
			tr = document.createElement("tr");
		}

		td = document.createElement("td");
		a = document.createElement("a");
		a.href = "javascript:void(0);";

		if (mode == 'year') {
			var _yy = i;

			a.title = _yy;
			a.onclick = new Function("clickCalendar(this, 'year');");
			if(_year == i && _year == parseInt(day.split(".")[0], 10)) {
				a.setAttribute("class", "today");
				a.title += _title;
			}
		} else {
			a.onclick = new Function("showMonth(" + i + ", " + _month + ", " + _day + ");");
		}

		a.innerHTML = i + "년";

		if(checkNum == 12) {
			a.onkeydown = new Function("if(event.keyCode == 9){clickCalendar('');}");
		}
		
		td.appendChild(a);
		tr.appendChild(td);
		table.appendChild(tr);

		checkNum ++;
	}
	
	div.appendChild(table);

	table = document.createElement("table");
	table.id = "tableMonthTitle";
	table.style.display = "none";
	table.style.paddingBottom = "10px";
	colgroup = document.createElement("colgroup");
	col = document.createElement("col");
	col.style.width = "15%";
	
	colgroup.appendChild(col);

	col = document.createElement("col");
	col.style.width = "70%";
	
	colgroup.appendChild(col);

	col = document.createElement("col");
	col.style.width = "15%";
	
	colgroup.appendChild(col);
	table.appendChild(colgroup);

	colgroup.appendChild(col);
	table.appendChild(colgroup);

	tr = document.createElement("tr");
	td = document.createElement("td");

	a = document.createElement("a");
	a.id = "aFirstM";
	a.href = "javascript:void(0);";
	a.onclick = new Function("showMonth(" + (parseInt(_year,10) - 1) + ", " + _month + ", " + _day + ");");
	a.innerHTML = "이전";

	td.appendChild(a);
	tr.appendChild(td);

	td = document.createElement("td");
	a = document.createElement("a");
	a.title = "연도선택 바로가기"
	a.href = "javascript:void(0);";
	a.onclick = new Function("showYear(" + _year + ", " + _month + ", " + _day + ");");
	a.innerHTML = _year + "년";

	td.appendChild(a);
	tr.appendChild(td);
	td = document.createElement("td");

	a = document.createElement("a");
	a.href = "javascript:void(0);";

	a.onclick = new Function("showMonth(" + (parseInt(_year,10) + 1) + ", " + _month + ", " + _day + ");");
	a.innerHTML = "다음";

	td.appendChild(a);
	tr.appendChild(td);
	table.appendChild(tr);		
	div.appendChild(table);

	table = document.createElement("table");
	table.id = "tableMonth";
	table.style.display = "none";

	colgroup = document.createElement("colgroup");
	
	for(var i = 0; i < 4; i++) {
		col = document.createElement("col");
		col.style.width = "25%";

		colgroup.appendChild(col);
	}

	table.appendChild(colgroup);

	tr = document.createElement("tr");

	for(var i = 1; i < 13; i++) {
		if(i == 5 || i == 9) {
			tr = document.createElement("tr");
		}

		td = document.createElement("td");
		a = document.createElement("a");
		a.href = "javascript:void(0);";

		if (mode == 'month') {
			var _mm = i;

			if(_mm < 10) {
				_mm = '0' + _mm;
			}
			a.title = _year + "." + _mm;
			a.onclick = new Function("clickCalendar(this, 'month');");
			if(_month == i && _year == parseInt(day.split(".")[0], 10)) {
				a.setAttribute("class", "today");
				a.title += _title;
			}
		} else {
			a.onclick = new Function("showCalendar(" + _year + ", " + i + ", " + _day + ");");
		}

		a.innerHTML = i + "월";

		if(i == 12) {
			a.onkeydown = new Function("if(event.keyCode == 9){clickCalendar('');}");
		}
		
		td.appendChild(a);
		tr.appendChild(td);
		table.appendChild(tr);
	}
	
	div.appendChild(table);

	table = document.createElement("table");
	table.id = "tableCalendarTitle";
	table.style.paddingBottom = "10px";
	
	colgroup = document.createElement("colgroup");
	col = document.createElement("col");
	col.style.width = "10%";
	
	colgroup.appendChild(col);

	col = document.createElement("col");
	col.style.width = "80%";
	
	colgroup.appendChild(col);

	tr = document.createElement("tr");
	td = document.createElement("td");

	a = document.createElement("a");
	a.id = "aFirst";
	a.href = "javascript:void(0);";
	a.onclick = new Function("showCalendar(" + preYear + ", " + preMonth + ", " + _day + ");");
	a.setAttribute("class", "prev");
	a.innerHTML = "이전";

	td.appendChild(a);
	tr.appendChild(td);

	td = document.createElement("td");
	a = document.createElement("a");
	a.href = "javascript:void(0);";
	a.onclick = new Function("showMonth(" + _year + ", " + _month + ", " + _day + ");");
	a.innerHTML = _year + "년 " + parseInt(_month,10) + "월";

	td.appendChild(a);
	tr.appendChild(td);
	td = document.createElement("td");

	a = document.createElement("a");
	a.href = "javascript:void(0);";
	a.onclick = new Function("showCalendar(" + nxtYear + ", " + nxtMonth + ", " + _day + ");");
	a.setAttribute("class", "next");
	a.innerHTML = "다음";

	td.appendChild(a);
	tr.appendChild(td);
	table.appendChild(tr);
	div.appendChild(table);

	table = document.createElement("table");
	table.id = "tableCalendar";
	
	caption = document.createElement("caption");
	caption.innerHTML = "날짜를 선택할 수 있는 달력";

	table.appendChild(caption);

	colgroup = document.createElement("colgroup");

	for(var i = 0; i < 7; i++) {
		col = document.createElement("col");
		col.style.width = "14%";

		colgroup.appendChild(col);
	}

	table.appendChild(colgroup);

	var arrWeekName = new Array("일", "월", "화", "수", "목", "금", "토");

	thead = document.createElement("thead");
	tr = document.createElement("tr");
	
	for(var i = 0; i < 7; i++) {
		th = document.createElement("th");
		th.scope = "col";
		th.innerHTML = arrWeekName[i];

		tr.appendChild(th);
	}

	thead.appendChild(tr);
	table.appendChild(thead);

	tbody = document.createElement("tbody");

	for(var week = 1; week <=6; week++) {
		tr = document.createElement("tr");
		
		for(var dd =1; dd <= 7; dd++) {
			if(firstWeek > 0) {
				td = document.createElement("td");
				td.innerHTML = "&nbsp;";

				tr.appendChild(td);

				firstWeek--;
			} else {
				if(printDay > lastDay) {
					td = document.createElement("td");
					td.innerHTML = "&nbsp;";

					tr.appendChild(td);
				} else {
					 var prevDate = _year + ((parseInt(_month,10) < 10) ? "0" + parseInt(_month,10)  : _month) + ((parseInt(printDay + 1,10) < 11) ? "0" + parseInt(printDay,10)  : printDay);
					 var today = new Date();
					 var d = today.getDate();
					 var m = today.getMonth()+1;
					 var yyyy = today.getFullYear();

					 if(d<10) {
					     d='0'+d
					 } 

					 if(m<10) {
					     m='0'+m
					 } 

					var today = yyyy + m + d;
					td = document.createElement("td");
                    
					if(prevDate >= today ){
                        console.log(prevDate == today);
                        console.log("prevDate =====>>" + prevDate);
                        console.log("AAAA=============================");

						a = document.createElement("a");
						a.href = "javascript:void(0);";
						a.title = _year + "." + ((parseInt(_month,10) < 10) ? "0" + parseInt(_month,10)  : _month) + "." + ((parseInt(printDay + 1,10) < 11) ? "0" + parseInt(printDay,10)  : printDay);
						a.onclick = new Function("clickCalendar(this);");
						a.innerHTML = printDay;

						if(_day == printDay && _month == parseInt(day.split(".")[1], 10) && _year == parseInt(day.split(".")[0], 10)) {
                            console.log("_day=========>>>" + _day);
                            console.log("printDay=========>>>" + printDay);
                            a.setAttribute("class", "choice");
							a.title += _title;
						}

                        if(prevDate == today){
                            a.classList.add("today");
                        }

						
						td.appendChild(a);
						tr.appendChild(td);

                        console.log("111111")
						
					}else{
                        td.innerHTML = printDay;
						tr.appendChild(td);
                        
					}
				}
				
				printDay ++;
			}

			tbody.appendChild(tr);
		}

		if(printDay > lastDay) {
			break;
		}
	}

	table.appendChild(tbody);
	div.appendChild(table);

	span = document.createElement("span");
	span.setAttribute("class", "btn-cal-close");

	a = document.createElement("a");
	a.href = "javascript:void(0);";
	a.title = "닫기";
	a.onclick = new Function("clickCalendar('');");
	a.onkeydown = new Function("if(event.keyCode == 9){clickCalendar('');}");
	a.innerHTML = "닫기";
	span.appendChild(a);
	/* 닫기버튼 추가 */
	
	div.appendChild(span);

	document.body.appendChild(div);

	// if ($('.layer_popup.show').length) {
	// 	$('.layer_popup.show .layer_cont').append(div);
	// } else {
	// 	document.body.appendChild(div);
	// }
	
	// setTimeout(
	// 	function(){
	// 		if (mode == 'month') { 
	// 			document.getElementById("aFirstM").focus();	
	// 		} else if (mode == 'year') { 
	// 			document.getElementById("aFirstY").focus();	
	// 		} else {
	// 			document.getElementById("aFirst").focus();
	// 		}
			
	// 	},
	// 	100
	// );
}

function clickCalendar(_obj, _mode) {
	if(_obj) {
		var inputVal;
		if (_mode == "month") {
			inputVal = _obj.title.substring(0,7);
			obj.value = inputVal;
		} else if (_mode == "year") {
			inputVal = _obj.title.substring(0,4);
			obj.value = inputVal;
		} else {
			inputVal = _obj.title.substring(0,10);
			obj.value = inputVal;
		} 
		/* 콜백 함수 */
		if(typeof fn_cals != "undefined"){
			fn_cals(obj);
		}
		/* // 콜백 함수 */
	}
	
	div.parentNode.removeChild(div);

	for(var i = document.getElementsByTagName("roundrect").length - 1; i > -1; i--) {
		document.getElementsByTagName("roundrect")[i].parentNode.removeChild(document.getElementsByTagName("roundrect")[i]);
	}
	obj.focus();
}

function showMonth(_year, _month, _day) {
	showCalendar(_year, _month, _day);
	document.getElementById("tableCalendarTitle").style.display = "none";
	document.getElementById("tableCalendar").style.display = "none";
	document.getElementById("tableMonthTitle").style.display = "";
	document.getElementById("tableMonth").style.display = "";
	document.getElementById("tableYearTitle").style.display = "none";
	document.getElementById("tableYear").style.display = "none";
	setTimeout(
		function(){
			document.getElementById("aFirstM").focus(); // 포커싱 추가
		},
		100
	);
}

function showYear(_year, _month, _day) {
	showCalendar(_year, _month, _day);
	document.getElementById("tableCalendarTitle").style.display = "none";
	document.getElementById("tableCalendar").style.display = "none";
	document.getElementById("tableMonthTitle").style.display = "none";
	document.getElementById("tableMonth").style.display = "none";
	document.getElementById("tableYearTitle").style.display = "";
	document.getElementById("tableYear").style.display = "";
	setTimeout(
		function(){
			document.getElementById("aFirstY").focus(); // 포커싱 추가
		},
		100
	);
}

function checkNumber(_value) {
	var pattern = /^[0-9]+$/;

	if(_value.replace(/\s/g,"").length < 1 && !pattern.test(_value)) {
		return false;
	}

	return true;
}

function GetObjectTop(_obj) {
	var intTopSum = _obj.offsetTop;

	while(_obj.nodeName.indexOf("HTML") != 0 && _obj.nodeName.indexOf("BODY") != 0) {
		_obj = _obj.offsetParent;
		intTopSum += _obj.offsetTop;
	}

	return intTopSum-1;
}

function GetObjectLeft(_obj) {
	var intLeftSum = _obj.offsetLeft;

	while(_obj.nodeName.indexOf("HTML") != 0 && _obj.nodeName.indexOf("BODY") != 0) {
		_obj = _obj.offsetParent;
		intLeftSum += _obj.offsetLeft;
	}

	return intLeftSum;
}

