console.log('App started')

let apikey = ""
let name = ""
let currentTime = (new Date().getTime())
let totalTimeLog = 0;
let timelogArray=[]
let currTableIndex=0;
let baseUrl=""


async function addWorklogV3(id, description, startTime, endTime, portalid) {
    let url = baseUrl+"api/v3/worklog?TECHNICIAN_KEY=" + apikey;
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: "TECHNICIAN_KEY="+apikey+"&format=json&portalid="+portalid+"&INPUT_DATA=" + JSON.stringify({
            "worklog": {
                "request": {
                    "id": id.toString()
                },
                "description": description,
                "technician": {
                    "name": name
                },
                "start_time": {
                    "value": startTime.toString()
                },
                "end_time": {
                    "value": endTime.toString()
                }
            }
        })

    });
    return response; // parses JSON response into native JavaScript objects
}

async function addWorklogV1(id, description, workminutes, portalid) {
    let url = baseUrl+"sdpapi/request/" + id + "/worklog";
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: "format=json&TECHNICIAN_KEY="+apikey+"&portalid=" + portalid + "&INPUT_DATA=" + JSON.stringify({
            "operation": {
                "details": {
                    "worklogs": {
                        "worklog": {
                            "description": description,
                            "technician": name,
                            "workMinutes": workminutes.toString()
                        }
                    }
                }
            }
        })

    });
    return response; // parses JSON response into native JavaScript objects
}


function getRowHTML(index, requestid, description, timetaken, date) {
    return '<th scope="row">' + index.toString() + '</th><td>' + requestid.toString() + '</td><td>' + description.toString() + '</td><td>' + timetaken.toString() + '</td><td>' + date + '</td>'
}

function hideUnhideTable() {
    let table = $("#worklogTable")[0]
    if (table.classList.contains("d-none")) {
        table.classList.remove("d-none")
    } else {
        table.classList.add("d-none")
    }
}

function sendTime() {
    let requestid = $("#requestid")[0].value
    let description = $("#description")[0].value
    let endTime = (new Date().getTime())
    let manTime = $("#manTime")[0].value
    //getting minutes
    let tempWorktime = Math.ceil((endTime - currentTime) / (1000 * 60)) + parseInt(manTime)
    totalTimeLog += tempWorktime
    addWorklogV1(requestid, description, tempWorktime, getPortalID(requestid))
    //addWorklogV3(requestid, description, currentTime, (endTime+parseInt(manTime)*1000*60), getPortalID(requestid))
    //////we're past sending data
    currentTime = endTime
    //setting current time
    $("#currentTime")[0].value = "Current time: " + (new Date(endTime).toLocaleString())
    $("#totalTimelog")[0].value = "Total timelog: " + totalTimeLog.toString() + " mins";
    ($("#worklogTable")[0].insertRow(1)).innerHTML = getRowHTML(++currTableIndex, requestid, description, tempWorktime.toString()+" mins",new Date(endTime).toLocaleString())
    timelogArray.push({"nr":currTableIndex,"id":requestid,"desc":description,"time":tempWorktime,"date":new Date(endTime).toLocaleString()})
    localStorage.timelogArray=JSON.stringify(timelogArray)
    localStorage.lastEndTime=endTime
    $("#requestid")[0].value=""
    $("#description")[0].value=""
}

function getPortalID(id){
    let ret = 0;
    switch(true){
        case(id<100000000): return 1;
        case(id<800000000): return 301;
        case(id>800000000): return 907;
    }
}

function clearWorklog(){
    let confirm=window.confirm("Are you sure?");
    if(confirm){
        console.log("SURE!")
        localStorage.timelogArray=[]
        timelogArray = []
        let table=$("#worklogTable")[0]
        while(table.rows.length!=1){
            table.deleteRow(1)
        }
        currTableIndex=0;
    }

}

function init(){
    $("#manTime")[0].value=1
    if(localStorage.debug!=undefined){
        $("#manTime")[0].classList.remove("d-none")
    }
    apikey = localStorage.apiKey
    name = localStorage.name
    baseUrl = localStorage.baseUrl
    lastEndTime=localStorage.lastEndTime
    //just to check
    console.log("Local storage loaded. Name: '"+name +"', Base URL: '"+baseUrl+"', APIKEY: '"+apikey+"'")

    //if last endTime is today, then set-it
    if((new Date(lastEndTime/1).toDateString())==(new Date().toDateString())){
        console.log("Last end time is today! Restoring proper date!")
        currentTime = lastEndTime
    }
    $("#currentTime")[0].value = "Current time: " + (new Date(currentTime/1).toLocaleString())
    //getting data from local storage
    try {
        timelogArray = JSON.parse(localStorage.timelogArray)
    } catch (error) {
        timelogArray=[]
    }
    //putting previous time requests
    if(timelogArray.length>0){
            for(entry of timelogArray){
            ($("#worklogTable")[0].insertRow(1)).innerHTML = getRowHTML(entry.nr, entry.id, entry.desc, entry.time.toString()+" mins",entry.date)
            }
        currTableIndex=timelogArray[timelogArray.length-1].nr
    }
    //setting current index for table

}

$('#addTimeBtn')
    .on('click', () => sendTime())

$('#showTimeLog').on('click', () => hideUnhideTable())

$('#clearWorklog').on('click', () => clearWorklog())

init()
