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

                var dropdownItem = document.createElement("semesterDropdownItem_" + x);
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
            //TODO: Why are first 3 elements not in alphabetical order?
            for (x = 0; x < data.length; x++) {
                var dropdownItemText = data[x];

                var dropdownItem = document.createElement("departmentDropdownItem_" + x);
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
