console.log('App started')

let currentTime = (new Date().getTime())
let timelogArray = []
let currTableIndex = 0;
let totalTimeLog =  parseInt(localStorage.totalTimeLog)

//this is function to add new systems based on currently available fields:
//you need to create proper function for your system and update "addGeneralWorklog"
///requestID - self explanatory
///description - self explanatory
///tempWorkTime - time in minutes 
///credentials - JSON object
//// system - system name
//// baseURL - URL of system with "/" at the end!
//// apiKey - API key used to authenticate against the API
//// userID - identification of user, can be name or ID
/// endTime - time in which the timelog was sent
function addGeneralWorklog(requestID, description, tempWorktime, credentials, endTime){
    if(credentials.system=="SupportCenter"){
    addWorklogV3SupportCenter(requestID, description, tempWorktime, getPortalID(requestID),credentials.userID, credentials.baseURL,credentials.apiKey).then((val) => {
        console.log(val);
        if (val['response_status']['status'] != undefined && val['response_status']['status'] == "success") {
            ($("#worklogTable")[0].insertRow(1)).innerHTML = getRowHTML(++currTableIndex, requestID, description, tempWorktime.toString() + " mins", new Date(endTime).toLocaleString(), true,credentials.system)
            timelogArray.push({ "nr": currTableIndex, "id": requestID, "desc": description, "time": tempWorktime, "date": new Date(endTime).toLocaleString(), "status": true, "system":credentials.system })
        }
        else {
            ($("#worklogTable")[0].insertRow(1)).innerHTML = getRowHTML(++currTableIndex, requestID, description, tempWorktime.toString() + " mins", new Date(endTime).toLocaleString(), false,credentials.system)
            timelogArray.push({ "nr": currTableIndex, "id": requestID, "desc": description, "time": tempWorktime, "date": new Date(endTime).toLocaleString(), "status": false, "system":credentials.system })
        }
        localStorage.timelogArray = JSON.stringify(timelogArray)
        }
        )
    }
    else if(credentials.system="ServiceDesk"){
        addWorklogV3ServiceDesk(requestID, description, tempWorktime, getPortalID(requestID),credentials.userID, credentials.baseURL,credentials.apiKey).then((val) => {
            ($("#worklogTable")[0].insertRow(1)).innerHTML = getRowHTML(++currTableIndex, requestID, description, tempWorktime.toString() + " mins", new Date(endTime).toLocaleString(), true,credentials.system)
            timelogArray.push({ "nr": currTableIndex, "id": requestID, "desc": description, "time": tempWorktime, "date": new Date(endTime).toLocaleString(), "status": true, "system":credentials.system })
            localStorage.timelogArray = JSON.stringify(timelogArray)
            }).catch((error) => {
                ($("#worklogTable")[0].insertRow(1)).innerHTML = getRowHTML(++currTableIndex, requestID, description, tempWorktime.toString() + " mins", new Date(endTime).toLocaleString(), true,credentials.system)
                timelogArray.push({ "nr": currTableIndex, "id": requestID, "desc": description, "time": tempWorktime, "date": new Date(endTime).toLocaleString(), "status": false, "system":credentials.system })
                 localStorage.timelogArray = JSON.stringify(timelogArray)
                console.log("Network error - but adding time!")
              })
        }
    }


//compatible with SupportCenter
async function addWorklogV3SupportCenter(id, description, workminutes, portalid, userID, baseURL, apiKey) {
    let url = baseURL + "api/v3/worklog?TECHNICIAN_KEY=" + apiKey;
    let jsonStr = ""
    if (parseInt(userID) || 0) {
        jsonStr = { "id": userID.toString() }
    }
    else {
        jsonStr = { "name": userID }
    }

    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: "TECHNICIAN_KEY=" + apiKey + "&format=json&portalid=" + portalid + "&INPUT_DATA=" + JSON.stringify({
            "worklog": {
                "request": {
                    "id": id.toString()
                },
                "description": description,
                "technician": jsonStr,
                "total_time_spent": (workminutes * 60 * 1000).toString()
            }
        })

    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function addWorklogV3ServiceDesk(id, description, workminutes, portalid, userID, baseURL, apiKey) {
    let url = baseURL + "api/v3/worklog?TECHNICIAN_KEY=" + apiKey;
    let jsonStr = ""
    if (parseInt(userID) || 0) {
        jsonStr = { "id": userID.toString() }
    }
    else {
        jsonStr = { "name": userID }
    }

    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: "input_data=" + JSON.stringify({
            "worklog": {
                "request": {
                    "id": id.toString()
                },
                "description": description,
                "technician": jsonStr,
                "total_time_spent": (workminutes * 60 * 1000).toString()
            }
        })

    });
    return response.json(); // parses JSON response into native JavaScript objects
}

//unused function - leaving for history 
/*
async function addWorklogV1(id, description, workminutes, portalid) {
    let url = baseUrl + "sdpapi/request/" + id + "/worklog";
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: "format=json&TECHNICIAN_KEY=" + apikey + "&portalid=" + portalid + "&INPUT_DATA=" + JSON.stringify({
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
    return response.json(); // parses JSON response into native JavaScript objects
}
*/

function getRowHTML(index, requestid, description, timetaken, date, status, system) {
    if (status == true) {
        return '<th scope="row" style="background:#008000">' + index.toString() + '</th><td>' + requestid.toString() + '</td><td>' + description.toString() + '</td><td>' + timetaken.toString() + '</td><td>' + date + '</td><td>'+system+"</td>"
    }
    else if (status == false) {
        return '<th scope="row" style="background:orangered">' + index.toString() + '</th><td>' + requestid.toString() + '</td><td>' + description.toString() + '</td><td>' + timetaken.toString() + '</td><td>' + date + '</td><td>'+system+"</td>"
    }
    else {
        return '<th scope="row">' + index.toString() + '</th><td>' + requestid.toString() + '</td><td>' + description.toString() + '</td><td>' + timetaken.toString() + '</td><td>' + date + '</td><td>SupportCenter</td>'
    }
}

//we need to hide table based on button
function hideUnhideTable() {
    let table = $("#worklogTable")[0]
    if (table.classList.contains("d-none")) {
        table.classList.remove("d-none")
    } else {
        table.classList.add("d-none")
    }
}

function sendTime() {
    let requestID = $("#requestid")[0].value
    let description = $("#description")[0].value
    let endTime = (new Date().getTime())
    //manipulate time
    let manTime = $("#manTime")[0].value
    //getting minutes rounded to higher value
    let tempWorktime = Math.ceil((endTime - currentTime) / (1000 * 60)) + parseInt(manTime)
    //calculating totalTimeLog
    totalTimeLog += tempWorktime

    //get current credentials to push data(in case somebody changed the settings)
    //object localCredentialsJSON exists due to "loadSystemsIntoMainPage" function
    let systemDropdownObj = $("#selectedSystemDropdown")
    let selectedSystemText = systemDropdownObj[0].selectedOptions[0].text
    let selectedCreds = localCredentialsJSON.filter(x=>x.system==selectedSystemText)[0]
    
    //debugging selected creds!
    console.log("Selected credentials!")
    console.log(selectedCreds)

    //asynchronous function to add worklog
    //todo - try catch around add worklog
    addGeneralWorklog(requestID, description, tempWorktime, selectedCreds, endTime)
    //we need to have new "beggining" time instead of previous one
    currentTime = endTime

    //in case if we will close the webpage - we're saving the data into local storage
    $("#currentTime")[0].value = "Current time: " + (new Date(endTime).toLocaleString())
    $("#totalTimelog")[0].value = "Total timelog: " + totalTimeLog.toString() + " mins";
    localStorage.lastEndTime = endTime
    localStorage.totalTimeLog = totalTimeLog
    //we're clearing the inputs after sending time and getting back response
    $("#requestid")[0].value = ""
    $("#description")[0].value = ""
}

//this functtion can be modified in case of unsupported SupportCenter
function getPortalID(id) {
    //this is used for SupportCenter and portal IDs - change if neccessarry!
    let ret = 0;
    switch (true) {
        case (id < 100000000): return 1;
        case (id < 800000000): return 301;
        case (id > 800000000): return 907;
    }
}

function clearWorklog() {
    let confirm = window.confirm("Are you sure to clear worklog?");
    if (confirm) {
        console.log("SURE!")
        localStorage.timelogArray = []
        timelogArray = []
        let table = $("#worklogTable")[0]
        while (table.rows.length != 1) {
            table.deleteRow(1)
        }
        currTableIndex = 0;
    }

}

function resetTime() {
    let confirm = window.confirm("Are you sure that you want to reset time?");
    if (confirm) {
        let endTime = (new Date().getTime())
        currentTime = endTime
        $("#currentTime")[0].value = "Current time: " + (new Date(endTime).toLocaleString())
        localStorage.lastEndTime = endTime
    }
}

function loadSystemsIntoMainPage(){
    let objPointer = $("#selectedSystemDropdown")[0]
    localCredentialsJSON = JSON.parse(localStorage.localCredentials)
    for(i of localCredentialsJSON){
        objPointer.add(new Option(i.system))
    }
    if(localCredentialsJSON.length==0){
        objPointer.add(new Option("Configure timer - in settings!"))
        //alert("You didn't configure the local credentials - please head up to settings!")
    }
}

function init() {
    //if we don't have a proper object!
    if(localStorage.localCredentials==undefined){
        console.log("Creating empty local creds")
        localStorage.localCredentials=JSON.stringify([])
    }
    if(localStorage.totalTimeLog==undefined){
        localStorage.totalTimeLog=0;
    }
    //default adding minutes
    $("#manTime")[0].value = 1
    //if debugMode is enabled!
    if (localStorage.debug != undefined) {
        $("#manTime")[0].classList.remove("d-none")
    }
    //loading systems from the localStorage into the HTML
    loadSystemsIntoMainPage()

    //in case somebody did exit from a webpage
    lastEndTime = localStorage.lastEndTime
    $("#totalTimelog")[0].value = "Total timelog: " + localStorage.totalTimeLog.toString() + " mins";
    //just to check
    console.log("Local credentials: "+localStorage.localCredentials)

    //if last endTime is today, then set-it
    if ((new Date(lastEndTime / 1).toDateString()) == (new Date().toDateString())) {
        console.log("Last end time is today! Restoring proper date!")
        currentTime = lastEndTime
        $("#totalTimelog")[0].value = "Total timelog: "+parseInt(localStorage.totalTimeLog)+" mins";
    }
    $("#currentTime")[0].value = "Current time: " + (new Date(currentTime / 1).toLocaleString())
    //getting data from local storage

    try {
        timelogArray = JSON.parse(localStorage.timelogArray)
    } catch (error) {
        timelogArray = []
    }
    //putting previous time requests
    if (timelogArray.length > 0) {
        for (entry of timelogArray) {
            ($("#worklogTable")[0].insertRow(1)).innerHTML = getRowHTML(entry.nr, entry.id, entry.desc, entry.time.toString() + " mins", entry.date, entry.status, entry.system)
        }
        currTableIndex = timelogArray[timelogArray.length - 1].nr
    }
    //setting current index for table

}

$('#addTimeBtn')
    .on('click', () => sendTime())

$('#showTimeLog').on('click', () => hideUnhideTable())

$('#clearWorklog').on('click', () => clearWorklog())

$('#resetTimeBtn').on('click', () => resetTime())

init()
