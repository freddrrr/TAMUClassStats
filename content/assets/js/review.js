var _professorsMap = [];

window.onload = async function () {
    //Populate auto-complete options for Professor field
    var professorDataList = document.getElementById("ProfessorsDataList")
    await $.ajax({
        type: "GET",
        url: "http://localhost:3001/query/professors",
        success: function (data, textStatus, xhr) {
            for (x = 0; x < data.length; x++) {
                var entry = data[x]
                _professorsMap.push(entry);

                var professor = entry[0];
                var option = document.createElement("option");
                //option.setAttribute("data-UIN", entry[1]);
                option.value = professor;
                professorDataList.appendChild(option);
            }
        }
    })
}

function professorOnFocusOutFunc() {
    var submitButton = document.getElementById("submitBtn");
    var professorUINInput = document.getElementById("professorUINInput");
    var professorSelected = event.target.value;

    for (x = 0; x < _professorsMap.length; x++) {
        if (professorSelected == _professorsMap[x][0]) {
            professorUINInput.value = _professorsMap[x][1];
            submitButton.disabled = false;
            return;
        }
    }
    submitButton.disabled = true;

}