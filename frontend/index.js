import { getData, updateStatus, updateRivision } from "./api.js";
let dataList = [];
let sheetID;


// funtion to get clear the sheet and call the shee on button click
// called in 
//  - index.js in document.ready() whhen Basic GUI button is pressed
//  - index.js in document.ready() whhen Basic API button is pressed
let GetSheet = (sheetName) => {
    let rivisionBtn = $(".rivisionButton");
    if (rivisionBtn.text() == "Hide Revision") {
        rivisionBtn.text("Show Revision");
    }
    $("#accordianbody").html("")
    $("#sidebar").removeClass("showSidebar");
    getData(sheetName, createAccordian);
}

// document.ready Funtion
$(function () {

    // to fetch Data from backend 
    getData("GUI", createAccordian);
    // Basic GUI SIdebar Button
    $("#sheetGUI").on("click", function (e) {
        GetSheet("GUI");
    });
    // Basic Api SIdebar Button
    $("#sheetAPI").on("click", function (e) {
        GetSheet("API");
    });
    // login Button onClick
    $("#btnLogin").on("click", function () {

        $(location).attr('href', "./login.html");
    });
    // to check on click in checkbox 
    $(document).on("click", ".tableCheckbox", async function (e) {
        console.log("Checkbox clicked:", e.target.id);
        // to update Status 
        await updateStatus(e.target.id, sheetID, createAccordian);
    });
    $(document).on("click", ".star", function (e) {
        console.log("Checkbox clicked:", e.target.id);
        // to update Status 
        updateRivision(e.target.id, sheetID, createAccordian);
    });
    // to show sidebar on menu click
    $("#menu").on("click", function () {
        $("#sidebar").toggleClass("showSidebar");
    });
    $(".rivisionButton").on("click", function (e) {
        // console.log(this);
        console.log($(this).text() == "Show Rivision");
        if ($(this).text() == "Show Revision") {
            GetRevisionList();
            $(this).text("Hide Revision");
        } else if ($(this).text() == "Hide Revision") {
            $("#accordianbody").html("")
            $(this).text("Show Revision");
            getData(sheetID, createAccordian);
        }
        // GetRevisionList();
    });

    $(document).on("click", function (e) {
        console.log("clickedd");
        const $sidebar = $("#sidebar");
        const $menuButton = $("#menu");
        if (!$sidebar.is(e.target) && $sidebar.has(e.target).length === 0 &&
            !$menuButton.is(e.target) && $menuButton.has(e.target).length === 0) {
            $sidebar.removeClass("showSidebar");
        }
    });
});


// it is a  function to create accordian 
// called in 
//  - as a callback function in index.js getData()
let createAccordian = function (data) {
    sheetID = data['id'];
    console.log(data);
    let taskCompleted = 0;
    let totalTask = 0;
    const outerAccordion = $('<div class="accordion" id="outerAccordion"></div>');
    dataList = data['topics'];

    dataList.forEach((item, index) => {

        item.children.forEach((topic) => {
            topic.Content.forEach((content) => {

                if (content.status) {
                    taskCompleted++;
                }
                totalTask++;
            })

        });

        outerAccordion.append(CreateAccordionItem(item, index + 1, `collapse${index + 1}`));
    });
    $(".sheetTitle").text(`${data['title']}`)
    $(".sheetDescription").text(` ${data['description']}`)
    $(".progressCount").text(`${taskCompleted}/${totalTask}`);
    let percentageComplete = Math.trunc(taskCompleted / totalTask * 100);
    console.log(percentageComplete);
    $(".progressPercentage").text(`${percentageComplete}% Complete`);
    $(".progress-bar").css("width", `${percentageComplete}%`)
    $("#accordianbody").append(outerAccordion);

}
// function to create data acordian 
// Called in 
//  - index.js CreateAccordionItem function
//  - index.js document Ready funtion as a callback to getData function
function CreateAccordionItem(item, index, outerId) {
    // checks if it is outer accordian or inner accordian
    if (item["children"] != null) {
        // creates a div for accordian
        const innerAccordion = $('<div class="accordion" id="Accordion${item.title}"></div>');
        // iterates for all the children and creates accordian item for each
        let taskCompleted = 0;
        item.children.forEach((childItem, childIndex) => {
            let data = CreateAccordionItem(childItem, childIndex + 1, `collapse${index}-${childIndex + 1}`);
            if (data.taskCompleted) {
                taskCompleted++;
            }
            innerAccordion.append(data.data);
        });
        let length = item.children.length;
        return $(`
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading${index}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${outerId}" aria-expanded="false" aria-controls="${outerId}">
                        <span class="title-text">${item.title}</span>
                        <div class="badge-container">
                            <span class="badge text-bg-secondary">${taskCompleted}/${length}</span>
                        </h2 >
                    </button >
                </div >
            <div id="${outerId}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#${outerId}">
                <div class="accordion-body">
                    ${innerAccordion.prop("outerHTML")}
                </div>
            </div>
            </div >
            `);
    }
    // it does not have children as it is innermost accordian
    else {
        // creates a table for the content 
        let tableContent = `
            <table class= "content-table" >
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Task</th>
                        <th>Link</th>
                        <th>Revision</th>
                    </tr>
                </thead>
                <tbody>
        `;
        let taskCompleted = 0;
        // checks if content is null 
        if (item.Content != null || item.content != undefined) {
            // creates table row for content and counts the completed tasks
            item.Content.forEach((taskitem, index) => {
                if (taskitem.status) {
                    taskCompleted++;
                }
                tableContent += `
                        <tr>
                            <td>
                                   <input type="checkbox" id="${outerId}-${index + 1}" class = "tableCheckbox" ${taskitem.status ? "Checked" : ""}>
                            </td>
                            <td>${taskitem.topic}</td>
                            <td>
                                ${taskitem.link}
                            </td>
                            <td>
                                <span class="revision-number">
                                    <input class = "star"  type="checkbox" id="${outerId}-${index + 1}"  ${taskitem.revision ? "Checked" : ""}>
                                 
                                </span>
                            </td>
                        </tr>
                    `;
            });
        }
        tableContent += `
            </tbody>
        </table > `;
        let contentLength = item.Content.length;
        return {
            taskCompleted: taskCompleted == contentLength,
            data:
                `<div class= "accordion-item" >
                <h2 class="accordion-header" id="heading${index}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${outerId}" aria-expanded="false" aria-controls="${outerId}">
                        <span class="title-text">${item.title}</span>
                         <div class="badge-container">
                            <span class="badge text-bg-secondary">${taskCompleted}/${contentLength}</span>
                        </div>
                    </button>
                </h2>
                <div id="${outerId}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#${outerId}">
                    <div class="accordion-body">
                      ${tableContent}
                    </div>
                </div>
            </div >
            `,
        };
    }
}

// to create the List of rivision items

let GetRevisionList = () => {
    const revisedList = $.map(dataList, section => {
        return {
            title: section.title,
            children: section.children.map(child => {
                return {
                    title: child.title,
                    Content: child.Content.filter(item => item.revision === true) // Filter based on revision
                };
            }).filter(child => child.Content.length > 0)
        };
    }).filter(section => section.children.length > 0);
    // console.log(revisedList);
    $("#accordianbody").html("");
    const outerAccordion = $('<div class="accordion" id="outerAccordion"></div>');
    $.each(revisedList, function (i) {
        console.log(this);
        outerAccordion.append(CreateAccordionItem(this, + 1, `collapse${i + 1} `))
    });
    $("#accordianbody").append(outerAccordion);

}