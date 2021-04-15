window.onload = function () {
    //fetching data from data.json file
    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }

    //usage
    readTextFile("./sampleData.json", function(text){
    data = JSON.parse(text);
    updateData(0);
    function updateData(flag){
        var todayTask = document.querySelector('.task#task_cntr>div.today>div');
        var upcomingTask = document.querySelector('.task#task_cntr>div.upcoming>div');
        var events = document.querySelector(".events");
        if (flag===0) {
            events.innerHTML = "";
        }
        todayTask.innerHTML = "";
        upcomingTask. innerHTML = "";
        
        for (const key in data) {
            if (!document.querySelector(`.events #${data[key].event.slice(0,3)}` )) {
                var newNode = document.createElement('div');
                newNode.setAttribute('class', 'proj_list');
                newNode.setAttribute('id', `${data[key].event.slice(0,3)}`);
                newNode.innerHTML =`<div><b>${data[key].event[0]}${data[key].event[data[key].event.search(' ') + 1]}</b></div> <p>${data[key].event}</p>`;
                events.appendChild(newNode);
                if (flag === 0) {
                    document.getElementsByClassName('proj_list')[0].classList.add('active');
                }  
            }
            if (document.querySelector('.proj_list.active').childNodes[2].innerText === data[key].event) {
                document.querySelector('.container.right>.heading>h2').innerHTML = data[key].event;
                document.querySelector('.container.right>.heading>p').innerHTML = data[key].description;
                for(const key2 in data[key].tasks){
                    var div= document.createElement('div');
                    div.innerHTML= `<input type="checkbox" name="task${key2 + 1}" class="regular-checkbox" checked=${data[key].tasks[key2].checked} /> <p>${data[key].tasks[key2].task_description}</p>`;
                    div.setAttribute("class", "label");
                    div.setAttribute('id', `${data[key].event.slice(0,4)}`);
                    if (data[key].tasks[key2].when==="today") {
                        todayTask.appendChild(div);
                    }
                    else{
                        upcomingTask.appendChild(div)
                    }  
                }
            }   
        }  
    }
    document.querySelector('#taskAdd>#add').addEventListener('click', function () {
        var newData = {
                    "checked":false,
                    "task_description":document.querySelector('#taskAdd>#NtaskDes').value,
                    "when":document.querySelector('#taskAdd>input:checked').value
                } ;
        for (const key in data) {
            if (document.querySelector('.proj_list.active').childNodes[2].innerText === data[key].event) {
                data[key].tasks.push(newData);
                break;
            }
        }
        updateData(1);
    })

    document.querySelectorAll('.proj_list').forEach(item => {
        item.addEventListener('click', event => {
            console.log(event.target);
            if(event.target.className == "proj_list"){
                document.querySelector('.proj_list.active').classList.remove('active');
                    event.target.classList.add('active');
                        console.log(event.target.classList.add('active'));
                    }
                    else if(event.target.parentNode.className == "proj_list"){
                        document.querySelector('.proj_list.active').classList.remove('active');
                        event.target.parentNode.classList.add('active');
                        console.log(2);
                    }
                    else if(event.target.parentNode.parentNode.className == "proj_list"){
                        document.querySelector('.proj_list.active').classList.remove('active');
                        event.target.parentNode.parentNode.classList.add('active');
                        console.log(2);
                    }
            updateData(1);
        })
      })
    });

    // top left menu Icon
    var menuIcon = document.getElementById('main_cntr').childNodes[1];
    menuIcon.childNodes[1].addEventListener('click', function (){
         if(!menuIcon.getAttribute('class')){
            menuIcon.childNodes[1].innerHTML = "&#10005;"
         }
         else{
            menuIcon.childNodes[1].innerHTML = "&#9776;"
         }
        menuIcon.classList.toggle('active');
    })

    document.querySelector('button.addTask').addEventListener('click', function () {
        document.querySelector('button.addTask').classList.toggle('active');
        document.querySelector('#taskAdd').classList.toggle('active');
        document.querySelector('#right_heading').classList.toggle('inactive');
        document.querySelector('#task_cntr').classList.toggle('inactive');
    });
} ;