console.log('Settings opened')

function init(){
    //$("#baseURL")[0].value=localStorage.baseUrl
    //$("#apiKey")[0].value=localStorage.apiKey
    //$("#name")[0].value=localStorage.name
}

function saveSettings(){
    localStorage.baseUrl=$("#baseURL")[0].value
    localStorage.apiKey=$("#apiKey")[0].value
    localStorage.name=$("#name")[0].value
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
