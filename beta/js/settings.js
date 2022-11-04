console.log('Settings opened')

function init() {
    //new version
    if (localStorage.localCredentialsJSON == undefined) {
        console.log("Creating local credentials inside local storage as it do not exist!")
        console.log("Moving SupportCenter to proper JSON format!")
        localStorage.localCredentialsJSON = JSON.stringify([{ "system": "SupportCenter", "baseURL": localStorage.baseURL, "apiKey": localStorage.apiKey, "userID": localStorage.name }])
    }

    //old version -- for historic purpose
    //$("#baseURL")[0].value=localStorage.baseUrl
    //$("#apiKey")[0].value=localStorage.apiKey
    //$("#name")[0].value=localStorage.name
}

function saveSettings() {
    //JSON with local credentials for all systems
    let localCredentialsJSON = JSON.parse(localStorage.localCredentials)
    let systemDropdownObj = $("#systemSelect")
    let selectedSystemText = systemDropdownObj[0].selectedOptions[0].text
    //in case there's no local credentials in local storage
    if (localCredentialsJSON.filter(x => x.system == selectedSystemText).length == 0) {
        localCredentialsJSON.push({ "system": selectedSystemText, "baseURL": "", "apiKey": "", "userID": "" })
    }
    for (i of localCredentialsJSON) {
        if (i.system == selectedSystemText) {
            i.baseURL = $("#baseURL")[0].value
            i.apiKey = $("#apiKey")[0].value
            i.userID = $("#name")[0].value
        }
    }
    localStorage.localCredentials = JSON.stringify(localCredentialsJSON)

}

function loadDetailsAboutSystem(){
    let systemDropdownObj = $("#systemSelect")
    let selectedSystemText = systemDropdownObj[0].selectedOptions[0].text
    let localCredentialsJSON = JSON.parse(localStorage.localCredentials)
    let selectedData=localCredentialsJSON.filter(x => x.system == selectedSystemText)[0]
    if(selectedData!=undefined){
        $("#baseURL")[0].value=selectedData.baseURL
        $("#apiKey")[0].value=selectedData.apiKey
        $("#name")[0].value=selectedData.userID
    }
    else{
        $("#baseURL")[0].value=""
        $("#apiKey")[0].value=""
        $("#name")[0].value=""
    }
}

function hideUnhideHelp() {
    let table = $("#helpcards")[0]
    if (table.classList.contains("d-none")) {
        table.classList.remove("d-none")
    } else {
        table.classList.add("d-none")
    }
}

function systemSelected() {
    let systemDropdownObj = $("#systemSelect")
    let settings = $("#settingsInputs")[0]
    switch (systemDropdownObj[0].selectedIndex) {
        case 0:
            //alert("Choose different than 'Select system'")
            settings.classList.add("d-none")
            break;
        //case when supportcenter
        case 1:
            settings.classList.remove("d-none")
            loadDetailsAboutSystem()
            break;
        //case when servicedesk
        case 2:
            settings.classList.remove("d-none")
            loadDetailsAboutSystem()
            break;
        default:
            break;
    }
    console.log(systemDropdownObj);
}

$('#save')
    .on('click', () => saveSettings())

$('#activeHelpCards').on('click', () => hideUnhideHelp())

$('#systemSelect').on('click', () => systemSelected())

init()
