// API base URL
const baseUrl = "http://127.0.0.1:5000/api/data";

// function to fetch data from API
// called in 
// - index.js document.ready($) Funtion 
async function getData(sheetName, onSuccess) {
    fetch(`${baseUrl}/${sheetName}`).then((response) => {
        console.log(response);
        return response.json();
    }).then((data) => {
        console.log(data);
        onSuccess(data);
    });
}

async function login(username, password) {
    let response = await fetch("http://localhost:52488/api/Login", {
        headers: {
            'Content-Type': "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            Username: username,
            Password: password
        }),

    });
    let data = await response.json();
    console.log(data);
    sessionStorage.setItem("token", data['Token']);
}
// function to update stauts in API
// called in 
// - index.js document.ready($) when checkbox is clicked 
async function updateStatus(id, sheetName, onSuccess) {
    console.log(id);
    $.ajax({
        url: `${baseUrl}/updateStatus/${id}/${sheetName}`,
        method: "PUT",
        success: function (data) {
            console.log(data)
            getData(sheetName, onSuccess)
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error:", error);
        }
    });

}
// / function to update revision in API
// called in 
// - index.js document.ready($) when star checkbox is clicked 
async function updateRivision(id, sheetName, onSuccess) {
    console.log(id);

    try {
        let response = await fetch(`${baseUrl}/updateRivision/${id}/${sheetName}`, {
            method: "PUT",
        })
        let parsedData = await response.json();
        console.log(parsedData);
        getData(sheetName, onSuccess)

    } catch (e) {
        console.log(e);

    }

}


export { getData, updateStatus, updateRivision, login };