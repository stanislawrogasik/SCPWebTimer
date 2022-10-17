console.log('Settings opened')

function init(){
    $("#baseURL")[0].value=localStorage.baseUrl
    $("#apiKey")[0].value=localStorage.apiKey
    $("#name")[0].value=localStorage.name
}

function saveSettings(){
    localStorage.baseUrl=$("#baseURL")[0].value
    localStorage.apiKey=$("#apiKey")[0].value
    localStorage.name=$("#name")[0].value
}

$('#save')
    .on('click', () => saveSettings())


init()
