window.onload = function(){
	var doc = document;
	var clearAll = doc.getElementById('clear');
	var uli = doc.getElementById('list-div').getElementsByTagName('ul')[0];
	var li = doc.getElementById('list-div').getElementsByTagName('li');
	var addlist = doc.getElementById('addlist');

	var mli = doc.getElementById('uli');
	var addtask = doc.getElementById('addtask');

	var file =doc.getElementById('file');
	var time = doc.getElementById('time');
	var area = doc.getElementById('area');

	var iconModify = doc.getElementById('iconModify');
	var iconSave = doc.getElementById('iconSave');

	var ullist = doc.getElementById('list-list').getElementsByTagName('ul')[0];
	var lilist = doc.getElementById('list-list').getElementsByTagName('li');

	var alltask = doc.getElementById('alltask');
	var unfinished = doc.getElementById('unfinished');
	var finished = doc.getElementById('finished');

	var folderName = '';
	var folderFileName = '';
	var dataJSON = [];//文件夹名和文件名
	var dataName = [];//文件夹名
	var dataTask = [];//详细任务，具体内容

	var fileCount = 0;
	var unfinishedCount = 0;

	addlist.onclick = function(){
		var value = prompt('请在文本框输入:','');
		if(value != ""){
			folderName = value;
			createFolder(value);
			localStorage.setItem("lastFolderName", value);
			addFolder(value);
			save();
		}
	};

	clearAll.onclick = function(){
		localStorage.clear();
		deleteShow();
		deleteShowTask();
	};

	function clear(){
		localStorage.clear();
	};

	getJSONContent();
	save();

	allCount();
	doc.getElementById('all').innerText = "所有任务(" + fileCount + ")";
	//unfinishedTaskCount();
	//folderUnfinishedTaskCount();

	function createContent(){
		file.disabled = false;
		time.disabled = false;
		area.disabled = false;
		file.value = '';
		time.value = '';
		file.focus();
		area.value = '';
		alert("第一行为标题输入，请输入3-8个字符！第二行为日期输入，请输入如yyyy-mm-dd格式的日期！第三行为内容输入，请输入“完成了”某某任务或者“未完成”某某任务！");
	};

	function modify(){
		file.disabled = false;
		time.disabled = false;
		area.disabled = false;
		file.focus();
		alert("在修改中请注意：第一行为标题输入，请输入3-8个字符！第二行为日期输入，请输入如yyyy-mm-dd格式的日期！第三行为内容输入，请输入“完成了”某某任务或者“未完成”某某任务！");
	};

	function modifyRecord(fileName, timeName, areaName){
		for(var index in dataTask){
			if(dataTask[index].folderContent.fileName == fileName &&
				dataTask[index].folderContent.time == timeName){
				var taskName = dataTask[index].fileTask;
				delete dataTask[index].fileTask;
				delete dataTask[index].folderContent.fileName;
				delete dataTask[index].folderContent.time;
				delete dataTask[index].folderContent.detail;
				addDataTask(taskName, file.value, time.value, area.value);
				save();
			}
		}
	};

	function disabled(){
		file.disabled = true;
		time.disabled = true;
		area.disabled = true;
	};


	function createFolder(value){
		var li = doc.createElement('li');
		var textNode = doc.createTextNode(value);
		var icon = doc.createElement('i');
		icon.className='fa fa-folder-open fa-lg';

		li.setAttribute("name", "folder");

		li.appendChild(icon);
		li.appendChild(textNode);

		uli.appendChild(li);

		icon.onclick = function(){
			li.className = 'uli';
		};

		var iconD = doc.createElement('div');
		iconD.className = 'fa fa-close fa-lg';
		iconD.style.width = '50px';
		iconD.style.height = '20px';
		iconD.style.float = 'right';
		iconD.style.padding = '5px 20px 0 0';
		iconD.style.display = "none";
		li.appendChild(iconD);

		li.onmouseover = function(){
			iconD.style.display = "block";
			this.style.cursor = "pointer";
			iconD.onclick = function(){
				if(confirm("确认删除此文件夹全部内容吗？")){
					deleteFolder(li.innerText);
				}
			};
		};

		li.onmouseout = function(){
			iconD.style.display = 'none';
		};
		li.onclick = function(){
			selectEmptyBackground();
			deleteShowTask();
			mli.className = "";
			this.className = "uli";
			addlist.onclick = function(){
				var fileName = prompt("请在文本框中输入：", '');
				addData(li.innerText, fileName);
				save();
				deleteShow();
				show();
			};
		};
	};

	function deleteFolder(folderName ){
		for(var index in dataName){
			if(dataName[index].folderName == folderName){
				delete dataName[index].folderName;
			}
		}
		for(var index in dataJSON){
			if(dataJSON[index].folderName == folderName){
				var fileTask = dataJSON[index].fileTask;
				delete dataJSON[index].folderName;
				delete dataJSON[index].fileTask;
				for(var indexTask in dataTask){
					if(dataTask[indexTask].fileTask == fileTask){
						delete dataTask[indexTask].fileTask;
						delete dataTask[indexTask].folderContent.fileName;
						delete dataTask[indexTask].folderContent.time;
						delete dataTask[indexTask].folderContent.detail;
					}
				}
			}
		}
		save();
		deleteShow();
		show();
	};

	function createFile(value){
		var li = doc.createElement('li');
		var textNode = doc.createTextNode(value);
		var icon = doc.createElement('i');
		icon.className='fa fa-file-o fa-lg indent';
		li.style.cursor = "pointer";
		li.appendChild(icon);
		li.appendChild(textNode);
		li.setAttribute("name", "file");

		uli.appendChild(li);

		li.onclick = function(){
			displayNone(li.innerText);
			mli.className = "";
			selectEmptyBackground();
			deleteShowTask();
			this.className = 'uli';
			alltask.className = "uli";
			showTask(li.innerText);
			addtask.onclick = function(){
				createContent();
				iconSave.onclick = function(){
					var parttTime = new RegExp("^\\d{4}-\\d{1,2}-\\d{1,2}$");
					var parttName = new RegExp("^.{3,8}$");
					var parttFinishied = new RegExp("完成了");
					var parttUnfinished = new RegExp("未完成");
					if(parttName.test(file.value)){
						if(parttTime.test(time.value)){
							if(parttFinishied.test(area.value)||parttUnfinished.test(area.value)){
								if(confirm("确认完成?")){
									disabled();
									addDataTask(li.innerText, file.value, time.value, area.value);
									save();
									//createList(time.value);
									//createList(file.value);
								}
								if(confirm("更新?")){
									allCount();
									doc.getElementById('all').innerText = "所有任务(" + fileCount + ")";
									deleteShow();
									show();

									deleteShowTask();
									showTask(li.innerText);
								}
							}else{
								alert("内容输入错误，请输入“完成了”或“未完成”某某任务！")
							}
						}else{
							alert("日期输入错误，请按yyyy-mm-dd正确输入！")
						}
					}else{
						alert("名字输入错误，请输入3-8个任意字符！")
					}
				};
				iconModify.onclick = function(){
					var fileName = file.value;
					var timeName = time.value;
					var areaName = time.value;
					modify();
					iconSave.onclick = function(){
						var parttTime = new RegExp("^\\d{4}-\\d{1,2}-\\d{1,2}$");
						var parttName = new RegExp("^.{3,8}$");
						var parttFinishied = new RegExp("完成了");
						var parttUnfinished = new RegExp("未完成");
						if(parttName.test(file.value)){
							if(parttTime.test(time.value)){
								if(parttFinishied.test(area.value)||parttUnfinished.test(area.value)){
									if(confirm("确认完成?")){
										disabled();
										modifyRecord(fileName, timeName, areaName);
									}
									if(confirm("更新?")){
										allCount();
										doc.getElementById('all').innerText = "所有任务(" + fileCount + ")";
										deleteShow();
										show();

										deleteShowTask();
										showTask(li.innerText);
									}
								}else{
									alert("内容输入错误，请输入“完成了”或“未完成”某某任务！")
								}
							}else{
								alert("日期输入错误，请按yyyy-mm-dd正确输入！")
							}
						}else{
							alert("名字输入错误，请输入3-8个任意字符！")
						}
					};
				};
			};

			alltask.onclick = function(){
				finished.className = "";
				unfinished.className = "";
				this.className = "uli";
				deleteShowTask();
				showTask(li.innerText);
			};
			unfinished.onclick = function(){
				alltask.className = "";
				finished.className = "";
				this.className = "uli";
				unfinishedTask(li.innerText);
			};
			finished.onclick = function(){
				alltask.className = "";
				unfinished.className = "";
				this.className = "uli";
				finishiedTask(li.innerText);
			};

		};
	};


	function selectEmptyBackground(){
		for(var i = 0; i < li.length; i++){
			li[i].className = "";
		}
		for(var j = 0; j < lilist.length; j++){
			lilist[j].className ="";
		}
	}

	function createList(value){
		var li = doc.createElement('li');
		var textNode = doc.createTextNode(value);

		li.appendChild(textNode);
		ullist.appendChild(li);
	};

	function setTaskBackground(value){
		var parttFinishied = new RegExp("完成了");
		var parttUnfinished = new RegExp("未完成");
		for(var index in dataTask){
			if(dataTask[index].folderContent.fileName == value){
				if(dataTask[index].folderContent.detail != "" && dataTask[index].folderContent.detail != undefined){
					if(parttFinishied.test(dataTask[index].folderContent.detail)){
						return true;
					}
					if(parttUnfinished.test(dataTask[index].folderContent.detail)){
						return false;
					}
				}
			}
		}
	};

	function save(){
		localStorage.setItem("json",JSON.stringify(dataJSON));
		localStorage.setItem("json_name", JSON.stringify(dataName));
		localStorage.setItem("json_task", JSON.stringify(dataTask));
		if(localStorage.getItem('json') != null){
	 		dataJSON = JSON.parse(localStorage.getItem('json'));
	 	}
	 	if(localStorage.getItem('json') != null){
	 		dataName = JSON.parse(localStorage.getItem('json_name'));
	 	}
	 	if(localStorage.getItem('json_task') != null){
	 		dataTask = JSON.parse(localStorage.getItem('json_task'));
	 	}
	};

	//文件夹名
	function addFolder(folderName){
		var contentDetail = {
			"folderName":folderName,
		};
		dataName.push(contentDetail);
		save();
	};
	//文件内容
	function addDataTask(taskName, name, time, content){
		var contentDetail = {
			"fileTask":taskName,
			"folderContent":{
				"fileName":name,
				"time":time,
				"detail":content
			}
		};
		dataTask.push(contentDetail);
		save();
	};
	//文件夹名和文件名
	function addData(folder, taskName){
		var contentDetail = {
			"folderName":folder,
			"fileTask":taskName
		};
		dataJSON.push(contentDetail);
		save();
	};

	function getJSONContent(){
	 	var json_data = JSON.parse(localStorage.getItem('json'));
	 	var json_name = JSON.parse(localStorage.getItem('json_name'));
	 	var json_task = JSON.parse(localStorage.getItem("json_task"));
	 	if(json_data != null){
	 		dataJSON = json_data;
	 	}
	 	if(json_name != null){
	 		dataName = json_name;
	 	}
	 	if(json_task != null){
	 		dataTask = json_task;
	 	}
	 	//deleteShow();
	 	show();
	}

	//有关的数字显示
	function allCount(){
	 	fileCount = 0;
		for(var index in dataTask){
			if(dataTask[index].folderContent.fileName != "" && dataTask[index].folderContent.fileName != undefined){
				fileCount ++;
			}
		}
	};

	function taskCount(name){
		deleteShowTask();
		unfinishedCount = 0;
		showTask(name);
		for(var i = 0; i < lilist.length; i++){
			if(lilist[i].className == 'textColor'){
				unfinishedCount ++;
			}
		}
		deleteShowTask();
	};

	function unfinishedTaskCount(){
		for(var i = 0; i < li.length; i++){
			if(li[i].innerText != undefined && li[i].innerText != ""){
				if(li[i].getAttribute("name") == "file"){
					taskCount(li[i].innerText);
					var div = doc.createElement("i");
					var text = "(" + unfinishedCount + ")";
					var nodeText = doc.createTextNode(text);
					div.appendChild(nodeText);
					li[i].appendChild(div);
					//folderUnfinishedTask(li[i].innerText, unfinishedCount);
				}
			}
		}
	};

	var count = 0;
	var folderName = '';
	function folderUnfinishedTask(fileTask, value){
		for(var index in dataJSON){
			if(dataJSON[index].fileTask == fileTask){
				count = value;
				if(folderName != dataJSON[index].folderName){

				}

				folderName = dataJSON[index].folderName;
			}
		}
	}

	function displayNone(value){
		for(var i = 0; i < li.length; i++){
			var childNode = li[i].childNodes;
			if(li[i].innerText == value){
				li[i].removeChild(childNode[2]);
			}else if(childNode[2] == undefined){
				taskCount(li[i].innerText);
				var div = doc.createElement("i");
				var text = "(" + unfinishedCount + ")";
				var nodeText = doc.createTextNode(text);
				div.appendChild(nodeText);
				li[i].appendChild(div);
			}
		}
	};

	//setFolderCount();关于文件夹显示未完成任务数目还没有想到好的实现方法。
	function setFolderCount(){
		var num = 0;
		for(var i = 0; i < li.length; i++){
			var childNode = li[i].childNodes;
			var sum = num + childNode[2].innerText;
			num = childNode[2].innerText;
		}
	}

	function folderUnfinishedTaskCount(){
		var count = 0;
		for(var i = 0; i < li.length; i++){
			if(li[i].innerText != undefined && li[i].innerText != ""){
				if(li[i].getAttribute("name") == "folder"){
					for(var index in dataJSON){
						if(dataJSON[index].folderName == li[i].innerText){
							count = 0;
							for(var indexTask in dataTask){
								if(dataJSON[index].fileTask == dataTask[indexTask].fileTask){
									taskCount(dataTask[indexTask].fileTask);
									count += unfinishedCount;
								}
							}
						}
					}
					var text = '(' + count + ')';
					li[i].appendChild(doc.createTextNode(text));
				}
			}
		}
	};



	function show(){
		var folderName;
		for(var index in dataName){
			if(dataName[index].folderName != "" && dataName[index].folderName != undefined){
				createFolder(dataName[index].folderName);
			}
			for(var fileIndex in dataJSON){
				if(dataJSON[fileIndex].folderName == dataName[index].folderName){
					if(dataJSON[fileIndex].fileTask != "" && dataJSON[fileIndex].fileTask != undefined){
						createFile(dataJSON[fileIndex].fileTask);
					}
				}
			}
		}
		unfinishedTaskCount();
	};
/*	function showTask(value){
		for(var index in dataTask){
			if(dataTask[index].fileTask == value
				&& dataTask[index].folderContent.time != "" && dataTask[index].folderContent.fileName != ""){
				createList(dataTask[index].folderContent.time);
				createList(dataTask[index].folderContent.fileName);
			}
		}
		showDetial();
	};
*/
	function showTask(value){
		var dataTime = [];
		var data = [];
		var dataSort = [];
		for(var index in dataTask){
			if(dataTask[index].fileTask == value
				&& dataTask[index].folderContent.time != "" && dataTask[index].folderContent.fileName != ""){
				dataTime.push(dataTask[index].folderContent.time);
			}
		}
		data = dataTime.sort();
		for(var i = 0; i < data.length; i++){
			if(data[i] != data[i+1]){
				dataSort.push(data[i]);
			}
		}
		for(var indexTask in dataSort){
			createList(dataSort[indexTask]);
			for(var index in dataTask){
				if(dataTask[index].fileTask == value
					&& dataTask[index].folderContent.time == dataSort[indexTask]){
					createList(dataTask[index].folderContent.fileName);
				}
			}
		}
		showDetial();
	};
	function finishiedTask(value){
		deleteShowTask();
		showTask(value);
		var finishedData = [];
		for(var index in lilist){
			if(lilist[index].className == "data"){
				finishedData.push(lilist[index].innerText);
			}
		}
		deleteShowTask();
		for(var index in finishedData){
			createList(finishedData[index]);
		}
		showDetial();
	};

	function unfinishedTask(value){
		deleteShowTask();
		showTask(value);
		var unfinishedData = [];
		for(var index in lilist){
			if(lilist[index].className == "textColor"){
				unfinishedData.push(lilist[index].innerText);
			}
		}
		deleteShowTask();
		for(var index in unfinishedData){
			createList(unfinishedData[index]);
		}
		showDetial();
	};

	function deleteShowTask(){
		while (ullist.hasChildNodes()) {
            ullist.removeChild(ullist.firstChild);
        }
	};
	function deleteShow(){
		while (uli.hasChildNodes()) {
            uli.removeChild(uli.firstChild);
        }
	};

	function showDetial(){
		for(var i = 0; i < lilist.length; i ++){
			var partt = new RegExp("^\\d{4}-\\d{1,2}-\\d{1,2}$");
			if(!partt.test(lilist[i].innerText)){
				if(setTaskBackground(lilist[i].innerText)){
					lilist[i].className = "data";
				}else{
					lilist[i].className = "textColor";
				}
				lilist[i].style.cursor = "pointer";
				lilist[i].onclick = function(){
					var value = this.innerText;
					var valueTask;
					for(var index in dataTask){
						if(dataTask[index].folderContent.fileName == value){
							file.value = dataTask[index].folderContent.fileName;
							time.value = dataTask[index].folderContent.time;
							area.value = dataTask[index].folderContent.detail;
							valueTask = dataTask[index].fileTask;
						}
					}
					iconModify.onclick = function(){
						var fileName = file.value;
						var timeName = time.value;
						var areaName = time.value;
						modify();
						iconSave.onclick = function(){
							var parttTime = new RegExp("^\\d{4}-\\d{1,2}-\\d{1,2}$");
							var parttName = new RegExp("^.{3,8}$");
							var parttFinishied = new RegExp("完成了");
							var parttUnfinished = new RegExp("未完成");
							if(parttName.test(file.value)){
								if(parttTime.test(time.value)){
									if(parttFinishied.test(area.value)||parttUnfinished.test(area.value)){
										if(confirm("确认完成?")){
											disabled();
											modifyRecord(fileName, timeName, areaName);
										}
										if(confirm("更新?")){
											allCount();
											doc.getElementById('all').innerText = "所有任务(" + fileCount + ")";
											deleteShow();
											show();

											deleteShowTask();
											showTask(li.innerText);
										}
									}else{
										alert("内容输入错误，请输入“完成了”或“未完成”某某任务！")
									}
								}else{
									alert("日期输入错误，请按yyyy-mm-dd正确输入！")
								}
							}else{
								alert("名字输入错误，请输入3-8个任意字符！")
							}
						};
					};
				};
			}
		}
	};

};

window.onresize = b
