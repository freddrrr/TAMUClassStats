window.onload = async function () {
    //Populate Semesters dropdown
    var semesterDropdown = document.getElementById("SemesterDropdown");
    var semesterText = document.getElementById("SemesterText");
    await $.ajax({
        type: "GET",
        url: "http://localhost:3001/query/semesters",
        success: function (data, textStatus, xhr) {
            for (x = 0; x < data.length; x++) {
                var dropdownItemText = data[x];

                var dropdownItem = document.createElement("semesterDropdownItem");
                dropdownItem.classList = "dropdown-item";
                dropdownItem.innerText = dropdownItemText;

                //When dropdown item clicked set value of Semester field
                var onClickFunc = function (dropdownText) {
                    dropdownItem.onclick = function () {
                        semesterText.value = dropdownText;
                    }
                }
                onClickFunc(dropdownItemText);

                semesterDropdown.appendChild(dropdownItem);
            }
        }
    })

    //Populate Departments dropdown
    var departmentDropdown = document.getElementById("DepartmentDropdown");
    var departmentText = document.getElementById("DepartmentText");
    await $.ajax({
        type: "GET",
        url: "http://localhost:3001/query/departments",
        success: function (data, textStatus, xhr) {
            for (x = 0; x < data.length; x++) {
                var dropdownItemText = data[x];

                var dropdownItem = document.createElement("departmentDropdownItem");
                dropdownItem.classList = "dropdown-item";
                dropdownItem.innerText = dropdownItemText;

                //When dropdown item clicked set value of Department field
                var onClickFunc = function (dropdownText) {
                    dropdownItem.onclick = function () {
                        departmentText.value = dropdownText;
                    }
                }
                onClickFunc(dropdownItemText);

                departmentDropdown.appendChild(dropdownItem);
            }
        }
    })
}

function filterOnClickFunc() {
    var filterText = document.getElementById("FilterText");
    var dropdownText = event.target.innerText;

    filterText.value = dropdownText;
}

async function performSearch() {
    var semester = document.getElementById("SemesterText").value;
    var department = document.getElementById("DepartmentText").value.substring(0,4);
    var courseNumber = document.getElementById("CourseNumberText").value;
    var filter = document.getElementById("FilterText").value;

    await $.ajax({
        type: "POST",
        url: "http://localhost:3001/query/search",
        data: {
            "semester": semester,
            "department": department,
            "courseNumber": courseNumber,
            "filter": filter
        },
        success: function (data, textStatus, xhr) {
            var resultsColumn = document.getElementById("ResultsColumn");
            resultsColumn
            resultsColumn.innerHTML = generateResultsTable(data, filter).outerHTML;
        }
    })
}

function generateResultsTable(data, filter) {
    var tableResponsive = document.createElement("table-responsive");
    var table = document.createElement("table");

    //Assign headers to table
    var tableHeader = document.createElement("thead");
    var tableHeaderRow = document.createElement("tr");

    var tableHeaderCRN = document.createElement("th");
    tableHeaderCRN.style.backgroundColor = "black";
    tableHeaderCRN.style.color = "white";
    tableHeaderCRN.innerText = "CRN";
    tableHeaderRow.innerHTML += tableHeaderCRN.outerHTML;

    var tableHeaderProf = document.createElement("th");
    tableHeaderProf.style.backgroundColor = "black";
    tableHeaderProf.style.color = "white";
    tableHeaderProf.innerText = "Professor";
    tableHeaderRow.innerHTML += tableHeaderProf.outerHTML;

    var tableHeaderRating = document.createElement("th");
    tableHeaderRating.style.backgroundColor = "black";
    tableHeaderRating.style.color = "white";
    tableHeaderRating.innerText = filter;
    tableHeaderRow.innerHTML += tableHeaderRating.outerHTML;

    tableHeader.innerHTML += tableHeaderRow.outerHTML;
    table.innerHTML += tableHeader.outerHTML;

    var tableBody = document.createElement("tbody");

    //Generate body of table
    console.log(data)
    for (idx in data) {
        var profName = data[idx].LastName + ", " + data[idx].FirstInitial;

        var tableDataRow = document.createElement("tr");

        var tableDataCourseNumber = document.createElement("td");
        tableDataCourseNumber.innerText = data[idx].CRN;
        tableDataRow.innerHTML += tableDataCourseNumber.outerHTML;

        var tableDataProfessor = document.createElement("td");
        tableDataProfessor.innerText = profName;
        tableDataRow.innerHTML += tableDataProfessor.outerHTML;

        var tableDataFilter = document.createElement("td");
        tableDataFilter.innerText = data[idx].Rating.substring(0, 4);
        tableDataRow.innerHTML += tableDataFilter.outerHTML;

        tableBody.innerHTML += tableDataRow.outerHTML;
    }

    table.innerHTML += tableBody.outerHTML;
    tableResponsive.innerHTML = table.outerHTML;

    console.log(tableResponsive);

    return tableResponsive;
}