window.onload = function () {
    // styling with javascript
        document.querySelector('button.addTask').addEventListener('click', function () {
                document.querySelector('button.addTask').classList.toggle('active');
                document.querySelector('#taskAdd').classList.toggle('active');
            });
                document.querySelector('#main_cntr>span').addEventListener('click', function (){
                    document.querySelector('#left_cntr').classList.toggle('active');
                 if(!document.querySelector('#main_cntr>span').getAttribute('class')){
                    this.innerHTML = "&#10005;";
                    if (window.innerWidth<880) {
                        document.querySelector('#left_cntr').style.display="block";
                        document.querySelector('#right_cntr').style.display="none";
                    } 
                 }
                 else{
                    this.innerHTML = "&#9776;";
                    if (window.innerWidth<880) {
                        document.querySelector('#left_cntr').style.display="none";
                        document.querySelector('#right_cntr').style.display="block";
                    }
                 }
                 document.querySelector('#main_cntr>span').classList.toggle('active');
            }) 
            
           
    //fetching data from data.json file
    function readTextFile(file) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                main(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }
    readTextFile("./sampleData.json");

    function main(text){
        data = JSON.parse(text);

        // Initiator Function
        function init() {
            var events = document.querySelector(".events");
            var todayTask = document.querySelector('.task#task_cntr>div.today>div');
            var upcomingTask = document.querySelector('.task#task_cntr>div.upcoming>div');
            var activeEventIndex = parseInt(document.querySelector('.event.active').id[2]);

            todayTask.innerHTML = "";
            upcomingTask.innerHTML = "";
            for (const key in data) {
                if (!document.querySelector(`.event#id${data[key]._id}`)) {
                    var newNode = document.createElement('div');
                    newNode.setAttribute('class', 'event');
                    newNode.setAttribute('id', `id${data[key]._id}`);
                    newNode.innerHTML =`<div><b>${data[key].event[0]}${data[key].event[data[key].event.search(' ') + 1]}</b></div> <p>${data[key].event}</p> <input type="hidden" value=${data[key].description} >`;
                    events.appendChild(newNode);
                }
                if (activeEventIndex === data[key]._id) {
                    document.querySelector('.container.right>.heading>p').innerHTML = data[key].description;
                    console.log()
                    if (!data[key].tasks.length) {
                        todayTask.innerHTML = "";
                        upcomingTask.innerHTML = "";
                    }
                    for(const key2 in data[key].tasks){ 
                        var checked = '';
                        if (data[key].tasks[key2].checked) {
                            checked= "checked";
                        }
                        var div= document.createElement('div');
                        div.innerHTML= `<input type="checkbox" class="regular-checkbox" ${checked} /> <p>${data[key].tasks[key2].task_description}</p>`;
                        div.setAttribute("class", "label");
                        if (data[key].tasks[key2].when==="today") {
                            todayTask.appendChild(div);
                        }
                        else if(data[key].tasks[key2].when==="later"){
                            upcomingTask.appendChild(div)
                        }
                    }
                } 
            }
            if(activeEventIndex === 0){
                document.querySelector('.container.right>.heading>p').innerHTML = '';
                todayTask.parentElement.style.display = "none";
                upcomingTask.parentElement.style.display = "none";
                document.querySelector('.task#task_cntr>.addEvent').style.display = "block";
            }
            else{
                todayTask.parentElement.style.display = "initial";
                upcomingTask.parentElement.style.display = "initial";
                document.querySelector('.task#task_cntr>.addEvent').style.display = "none";
            }
            document.querySelector('.container.right>.heading>h2').innerHTML = document.querySelector('.event.active p').innerHTML ;  
        }
        init();

        // Adding data to local storage
        function addLocalItem() {
            const Storage = window.localStorage; 
            if(!Storage){
                    console.log('error');
            }
            else{
                for (const key in data) {
                    Storage.setItem(data[key].events, data[key]);
                    console.log(Storage.getItem(data[key].events));
                }    
            }
        }
        //addLocalItem();

        // function to add new event
        function addEvent(newEvent) {
            data.push(newEvent);
            
            if (!document.querySelector(`.event#id${newEvent._id}`)) {
                var newNode = document.createElement('div');
                newNode.setAttribute('class', 'event');
                newNode.setAttribute('id', `id${newEvent._id}`);
                newNode.innerHTML =`<div><b>${newEvent.event[0]}${newEvent.event[newEvent.event.search(' ') + 1]}</b></div> <p>${newEvent.event}</p> <input type="hidden" value=${newEvent.description} >`;
                document.querySelector('.events').appendChild(newNode); 
                //console.log(document.querySelector('.event:last-of-type')) ;
            }
            document.querySelector('.event.active').classList.remove('active');
            document.querySelector('.event:last-of-type').classList.add('active');
            init();
             
        }

        // function to add new Task in active event
        function addTask(newTask){
            var activeEventIndex = parseInt(document.querySelector('.event.active').id[2]);
            for (const key in data) {
                if (data [key]._id === activeEventIndex) {
                    data[key].tasks.push(newTask);
                    init();
                }
            }
            
        }

        document.querySelector('#taskAdd>#add').addEventListener('click', function () {
            if (!parseInt(document.querySelector('.event.active').id[2])) {
                alert("Cannot add Task here or Create event first");
            } 
            else {
                if (!document.querySelector('#taskAdd>#NewTaskDes').value) {
                    alert('Enter Task Description');
                } else {
                    var newTask = {
                            checked:false,
                            task_description:document.querySelector('#taskAdd>#NewTaskDes').value,
                            when:document.querySelector('#taskAdd>input:checked').value
                        } ;
                    addTask(newTask);
                }
                document.querySelector('#taskAdd>#NewTaskDes').value='';
                document.querySelector('#taskAdd>input[value="today"]').checked=true;
            } 
        })
    
        document.querySelectorAll('.event').forEach(item => {
            item.addEventListener('click', event => {
                if(event.target.className == "event"){
                    document.querySelector('.event.active').classList.remove('active');
                    event.target.classList.add('active');
                }
                else if(event.target.parentNode.className == "event"){
                    document.querySelector('.event.active').classList.remove('active');
                    event.target.parentNode.classList.add('active');
                }
                else if(event.target.parentNode.parentNode.className == "event"){
                    document.querySelector('.event.active').classList.remove('active');
                    event.target.parentNode.parentNode.classList.add('active');
                }
                init();
            })
          })

          document.querySelector('#addEvent>#add').addEventListener('click', function () {
            if (!document.querySelector('#addEvent>#NewEventName').value || !document.querySelector('#addEvent>#NewEventDes').value) {
                alert('Enter Fields');
            }
            else {
                var newEvent = {
                    _id:data.length+1,
                    event:document.querySelector('#addEvent>#NewEventName').value ,
                    description:document.querySelector('#addEvent>#NewEventDes').value,
                    tasks:[]
                } ;
                addEvent(newEvent);
                document.querySelector('#addEvent>#NewEventName').value='';
                document.querySelector('#addEvent>#NewEventDes').value='';
            }
        })
//   end of main()
        }
    
} ;