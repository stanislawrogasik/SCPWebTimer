console.log('Settings opened')

function init(){
    if(localStorage.localCredentials==undefined){
        console.log("Creating local credentials inside local storage as it do not exist!")
        localStorage.localCredentials=JSON.stringify([])
    }
    //$("#baseURL")[0].value=localStorage.baseUrl
    //$("#apiKey")[0].value=localStorage.apiKey
    //$("#name")[0].value=localStorage.name
}

function saveSettings(){
    let localCredentials=JSON.parse(localStorage.localCredentials)
    //{"system":"","baseURL":"","apiKey":"","userID":""}
    let sysSelected = $("#systemSelect")
    let selectedSystemName = sysSelected[0].selectedOptions[0].text
    if(localCredentials.filter(x=>x.system==selectedSystemName).length==0){
        localCredentials.push({"system":selectedSystemName,"baseURL":"","apiKey":"","userID":""})
    }
    for(i of localCredentials){
        if(i.system==selectedSystemName){
            i.baseURL=$("#baseURL")[0].value
            i.apiKey=$("#apiKey")[0].value
            i.userID=$("#name")[0].value
        }
    }
    localStorage.localCredentials=JSON.stringify(localCredentials)

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
  let sysSelected = $("#systemSelect")
  let settings = $("#settingsInputs")[0]
  switch (sysSelected[0].selectedIndex) {
    case 0:
        
        alert("Choose different than 'Select system'")
        break;
    //case when supportcenter
    case 1:
        settings.classList.remove("d-none")
        break;
    //case when servicedesk
    case 2:
        settings.classList.remove("d-none")
        break;
    default:
        break;
  }
  console.log(sysSelected);
}

$('#save')
    .on('click', () => saveSettings())

$('#activeHelpCards').on('click', () => hideUnhideHelp())

$('#systemSelect').on('click',()=>systemSelected())

init()
