//get patientID from url params
 const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get("patientId");
    console.log(patientId);

    //show all prescriptions
    const showAllPrescriptions= async () => {
      //call 4 functions here
      getAllGivenMedicine();
      getAllGivenAdvice();
      getAllGivenTests();
        getAllGivenTestResults();
    }
    
   //1 
   const getAllGivenMedicine = async () => {
    const options = {
      method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
        }),
    };
    const url = "http://localhost:3000/prescription/getAllGivenMedicine";
    const response = await fetch(url, options);
    const givenMedicine = await response.json();
    console.log(givenMedicine);
    //displayGiven medicine in a table
    displayGivenMedicine(givenMedicine);
}
//display given medicine in a table
const displayGivenMedicine = (givenMedicine) => {
    const givenMedicineDiv = document.getElementById("givenMedicine");
    givenMedicineDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in givenMedicine[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let medicine of givenMedicine){
        const row = document.createElement("tr");
        for(let key in medicine){
            const cell = document.createElement("td");
            cell.textContent = medicine[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Medicine
    const header = document.createElement("h2");
    header.textContent = "All Given Medicine";
    givenMedicineDiv.appendChild(header);

    givenMedicineDiv.appendChild(table);
}
//2
//get all given advice
const getAllGivenAdvice = async () => {
    const options = {
      method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
        }),
    };
    const url = "http://localhost:3000/prescription/getAllGivenAdvice";
    const response = await fetch(url, options);
    const givenAdvice = await response.json();
    console.log(givenAdvice);
    //displayGivenAdvice in a table
    displayGivenAdvice(givenAdvice);
}
//display given advice in a table
const displayGivenAdvice = (givenAdvice) => {
    const givenAdviceDiv = document.getElementById("givenAdvice");
    givenAdviceDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in givenAdvice[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let advice of givenAdvice){
        const row = document.createElement("tr");
        for(let key in advice){
            const cell = document.createElement("td");
            cell.textContent = advice[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Advice
    const header = document.createElement("h2");
    header.textContent = "All Given Advice";
    givenAdviceDiv.appendChild(header);

    givenAdviceDiv.appendChild(table);
}

//3
//get all given tests
const getAllGivenTests = async () => {
    const options = {
      method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
        }),
    };
    const url = "http://localhost:3000/prescription/getAllGivenTests";
    const response = await fetch(url, options);
    const givenTests = await response.json();
    console.log(givenTests);
    //displayGivenTests in a table
    displayGivenTests(givenTests);
}
//display given tests in a table
const displayGivenTests = (givenTests) => {
    const givenTestsDiv = document.getElementById("givenTests");
    givenTestsDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in givenTests[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let test of givenTests){
        const row = document.createElement("tr");
        for(let key in test){
            const cell = document.createElement("td");
            cell.textContent = test[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Tests
    const header = document.createElement("h2");
    header.textContent = "All Given Tests";
    givenTestsDiv.appendChild(header);

    givenTestsDiv.appendChild(table);
}
//4
//get result of all given tests
const getAllGivenTestResults = async () => {
    const options = {
      method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
        }),
    };
    const url = "http://localhost:3000/prescription/getAllGivenTestResults";
    const response = await fetch(url, options);
    const givenTestResults = await response.json();
    console.log(givenTestResults);
    //displayGivenTestResults in a table
    displayGivenTestResults(givenTestResults);
}
//display given test results in a table
const displayGivenTestResults = (givenTestResults) => {
    const givenTestResultsDiv = document.getElementById("givenTestResults");
    givenTestResultsDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in givenTestResults[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let testResult of givenTestResults){
        const row = document.createElement("tr");
        for(let key in testResult){
            const cell = document.createElement("td");
            cell.textContent = testResult[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Test Results
    const header = document.createElement("h2");
    header.textContent = "All Given Test Results";
    givenTestResultsDiv.appendChild(header);

    givenTestResultsDiv.appendChild(table);
}

//APPOINTMENT specific type 
const showPrescriptionOnaGivenAppointment= async () => {
    //call 4 functions here
    getAllGivenMedicineOnaGivenAppointment();
    getAllGivenAdviceOnaGivenAppointment();
    getAllGivenTestsOnaGivenAppointment();
    getAllGivenTestResultsOnaGivenAppointment();
}

//1
//get all given medicine on a given appointment
const getAllGivenMedicineOnaGivenAppointment = async () => {
    //get appointmentId from input
    const appointmentId = document.getElementById("appointmentIDForPrescription").value;
    const options = {
      method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
            appointmentId: appointmentId,
        }),
    };
    const url = "http://localhost:3000/prescription/getAllGivenMedicineOnaGivenAppointment";
    const response = await fetch(url, options);
    const givenMedicineOnaGivenAppointment = await response.json();
    console.log(givenMedicineOnaGivenAppointment);
    //displayGiven medicine in a table
    displayGivenMedicineOnaGivenAppointment(givenMedicineOnaGivenAppointment);
}
//display given medicine in a table
const displayGivenMedicineOnaGivenAppointment = (givenMedicineOnaGivenAppointment) => {
    const givenMedicineOnaGivenAppointmentDiv = document.getElementById("givenMedicineOnaGivenAppointment");
    givenMedicineOnaGivenAppointmentDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in givenMedicineOnaGivenAppointment[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let medicine of givenMedicineOnaGivenAppointment){
        const row = document.createElement("tr");
        for(let key in medicine){
            const cell = document.createElement("td");
            cell.textContent = medicine[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Medicine
    const header = document.createElement("h2");
    header.textContent = "All Given Medicine On a Given Appointment";
    givenMedicineOnaGivenAppointmentDiv.appendChild(header);

    givenMedicineOnaGivenAppointmentDiv.appendChild(table);
}

//2
//get all given advice on a given appointment
const getAllGivenAdviceOnaGivenAppointment = async () => {
    //get appointmentId from input
    const appointmentId = document.getElementById("appointmentIDForPrescription").value;
    const options = {
      method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
            appointmentId: appointmentId,
        }),
    };
    const url = "http://localhost:3000/prescription/getAllGivenAdviceOnaGivenAppointment";
    const response = await fetch(url, options);
    const givenAdviceOnaGivenAppointment = await response.json();
    console.log(givenAdviceOnaGivenAppointment);
    //displayGivenAdvice in a table
    displayGivenAdviceOnaGivenAppointment(givenAdviceOnaGivenAppointment);
}
//display given advice in a table
const displayGivenAdviceOnaGivenAppointment = (givenAdviceOnaGivenAppointment) => {
    const givenAdviceOnaGivenAppointmentDiv = document.getElementById("givenAdviceOnaGivenAppointment");
    givenAdviceOnaGivenAppointmentDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in givenAdviceOnaGivenAppointment[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let advice of givenAdviceOnaGivenAppointment){
        const row = document.createElement("tr");
        for(let key in advice){
            const cell = document.createElement("td");
            cell.textContent = advice[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Advice
    const header = document.createElement("h2");
    header.textContent = "All Given Advice On a Given Appointment";
    givenAdviceOnaGivenAppointmentDiv.appendChild(header);

    givenAdviceOnaGivenAppointmentDiv.appendChild(table);
}

//3
//get all given tests on a given appointment
const getAllGivenTestsOnaGivenAppointment = async () => {
    //get appointmentId from input
    const appointmentId = document.getElementById("appointmentIDForPrescription").value;
    const options = {
      method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
            appointmentId: appointmentId,
        }),
    };
    const url = "http://localhost:3000/prescription/getAllGivenTestsOnaGivenAppointment";
    const response = await fetch(url, options);
    const givenTestsOnaGivenAppointment = await response.json();
    console.log(givenTestsOnaGivenAppointment);
    //displayGivenTests in a table
    displayGivenTestsOnaGivenAppointment(givenTestsOnaGivenAppointment);
}
//display given tests in a table
const displayGivenTestsOnaGivenAppointment = (givenTestsOnaGivenAppointment) => {
    const givenTestsOnaGivenAppointmentDiv = document.getElementById("givenTestsOnaGivenAppointment");
    givenTestsOnaGivenAppointmentDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in givenTestsOnaGivenAppointment[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let test of givenTestsOnaGivenAppointment){
        const row = document.createElement("tr");
        for(let key in test){
            const cell = document.createElement("td");
            cell.textContent = test[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Tests
    const header = document.createElement("h2");
    header.textContent = "All Given Tests On a Given Appointment";
    givenTestsOnaGivenAppointmentDiv.appendChild(header);

    givenTestsOnaGivenAppointmentDiv.appendChild(table);
}
//4
//get result of all given tests on a given appointment
const getAllGivenTestResultsOnaGivenAppointment = async () => {
    //get appointmentId from input
    const appointmentId = document.getElementById("appointmentIDForPrescription").value;
    const options = {
      method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
            appointmentId: appointmentId,
        }),
    };
    const url = "http://localhost:3000/prescription/getAllGivenTestResultsOnaGivenAppointment";
    const response = await fetch(url, options);
    const givenTestResultsOnaGivenAppointment = await response.json();
    console.log(givenTestResultsOnaGivenAppointment);
    //displayGivenTestResults in a table
    displayGivenTestResultsOnaGivenAppointment(givenTestResultsOnaGivenAppointment);
}
//display given test results in a table
const displayGivenTestResultsOnaGivenAppointment = (givenTestResultsOnaGivenAppointment) => {
    const givenTestResultsOnaGivenAppointmentDiv = document.getElementById("givenTestResultsOnaGivenAppointment");
    givenTestResultsOnaGivenAppointmentDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in givenTestResultsOnaGivenAppointment[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let testResult of givenTestResultsOnaGivenAppointment){
        const row = document.createElement("tr");
        for(let key in testResult){
            const cell = document.createElement("td");
            cell.textContent = testResult[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Test Results
    const header = document.createElement("h2");
    header.textContent = "All Given Test Results On a Given Appointment";
    givenTestResultsOnaGivenAppointmentDiv.appendChild(header);

    givenTestResultsOnaGivenAppointmentDiv.appendChild(table);
}




//new start
const showPrescribedMedicinesOfRecent= async () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
        }),
    };
    const url = "http://localhost:3000/prescription/getPrescribedMedicinesOfRecent";
    const response = await fetch(url, options);
    const prescribedMedicinesOfRecent = await response.json();
    console.log(prescribedMedicinesOfRecent);
    //displayGiven medicine in a table
    displayPrescribedMedicinesOfRecent(prescribedMedicinesOfRecent);

}
//display given medicine in a table
const displayPrescribedMedicinesOfRecent = (prescribedMedicinesOfRecent) => {
    //if size of prescribedMedicinesOfRecent is 0, then show a message
    if(prescribedMedicinesOfRecent.length === 0){
        const prescribedMedicinesOfRecentDiv = document.getElementById("prescribedMedicinesOfRecent");
        prescribedMedicinesOfRecentDiv.innerHTML = "";
        const header = document.createElement("h2");
        header.textContent = "No Prescribed Medicines Available";
        prescribedMedicinesOfRecentDiv.appendChild(header);
        return;
    }
    const prescribedMedicinesOfRecentDiv = document.getElementById("prescribedMedicinesOfRecent");
    prescribedMedicinesOfRecentDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in prescribedMedicinesOfRecent[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let medicine of prescribedMedicinesOfRecent){
        const row = document.createElement("tr");
        for(let key in medicine){
            const cell = document.createElement("td");
            cell.textContent = medicine[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Medicine
    const header = document.createElement("h2");
    header.textContent = "Prescribed Medicines Of Recent";
    prescribedMedicinesOfRecentDiv.appendChild(header);

    prescribedMedicinesOfRecentDiv.appendChild(table);
}


//see advice 
const showPrescribedAdvicesOfRecent= async () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
        }),
    };
    const url = "http://localhost:3000/prescription/getPrescribedAdvicesOfRecent";
    const response = await fetch(url, options);
    const prescribedAdvicesOfRecent = await response.json();
    console.log(prescribedAdvicesOfRecent);
    //displayGiven medicine in a table
    displayPrescribedAdvicesOfRecent(prescribedAdvicesOfRecent);

}
//display given advices in a table
const displayPrescribedAdvicesOfRecent = (prescribedAdvicesOfRecent) => {
    //if size of prescribedAdvicesOfRecent is 0, then show a message
    if(prescribedAdvicesOfRecent.length === 0){
        const prescribedAdvicesOfRecentDiv = document.getElementById("prescribedAdvicesOfRecent");
        prescribedAdvicesOfRecentDiv.innerHTML = "";
        const header = document.createElement("h2");
        header.textContent = "No Prescribed Advices Available";
        prescribedAdvicesOfRecentDiv.appendChild(header);
        return;
    }
    const prescribedAdvicesOfRecentDiv = document.getElementById("prescribedAdvicesOfRecent");
    prescribedAdvicesOfRecentDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in prescribedAdvicesOfRecent[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let advice of prescribedAdvicesOfRecent){
        const row = document.createElement("tr");
        for(let key in advice){
            const cell = document.createElement("td");
            cell.textContent = advice[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Medicine
    const header = document.createElement("h2");
    header.textContent = "Prescribed Advices Of Recent";
    prescribedAdvicesOfRecentDiv.appendChild(header);

    prescribedAdvicesOfRecentDiv.appendChild(table);
}

//lab tests 
const showPrescribedTestsOfRecent= async () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
        }),
    };
    const url = "http://localhost:3000/prescription/getPrescribedTestsOfRecent";
    const response = await fetch(url, options);
    const prescribedTestsOfRecent = await response.json();
    console.log(prescribedTestsOfRecent);
    //displayGiven medicine in a table
    displayPrescribedTestsOfRecent(prescribedTestsOfRecent);

}
//display given tests in a table
const displayPrescribedTestsOfRecent = (prescribedTestsOfRecent) => {
    //if size of prescribedTestsOfRecent is 0, then show a message
    if(prescribedTestsOfRecent.length === 0){
        const prescribedTestsOfRecentDiv = document.getElementById("prescribedTestsOfRecent");
        prescribedTestsOfRecentDiv.innerHTML = "";
        const header = document.createElement("h2");
        header.textContent = "No Prescribed Tests Available";
        prescribedTestsOfRecentDiv.appendChild(header);
        return;
    }
    const prescribedTestsOfRecentDiv = document.getElementById("prescribedTestsOfRecent");
    prescribedTestsOfRecentDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in prescribedTestsOfRecent[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let test of prescribedTestsOfRecent){
        const row = document.createElement("tr");
        for(let key in test){
            const cell = document.createElement("td");
            cell.textContent = test[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Medicine
    const header = document.createElement("h2");
    header.textContent = "Prescribed Tests Of Recent";
    prescribedTestsOfRecentDiv.appendChild(header);

    prescribedTestsOfRecentDiv.appendChild(table);
}


//test results
const showCompletedTestResultsOfRecent= async () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
        }),
    };
    const url = "http://localhost:3000/prescription/getCompletedTestResultsOfRecent";
    const response = await fetch(url, options);
    const completedTestResultsOfRecent = await response.json();
    console.log(completedTestResultsOfRecent);
    //displayGiven medicine in a table
    displayCompletedTestResultsOfRecent(completedTestResultsOfRecent);

}
//display given test results in a table
const displayCompletedTestResultsOfRecent = (completedTestResultsOfRecent) => {
    //if size of completedTestResultsOfRecent is 0, then show a message
    if(completedTestResultsOfRecent.length === 0){
        const completedTestResultsOfRecentDiv = document.getElementById("completedTestResultsOfRecent");
        completedTestResultsOfRecentDiv.innerHTML = "";
        const header = document.createElement("h2");
        header.textContent = "No Completed Test Results Available";
        completedTestResultsOfRecentDiv.appendChild(header);
        return;
    }
    const completedTestResultsOfRecentDiv = document.getElementById("completedTestResultsOfRecent");
    completedTestResultsOfRecentDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in completedTestResultsOfRecent[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let testResult of completedTestResultsOfRecent){
        const row = document.createElement("tr");
        for(let key in testResult){
            const cell = document.createElement("td");
            cell.textContent = testResult[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Medicine
    const header = document.createElement("h2");
    header.textContent = "Completed Test Results Of Recent";
    completedTestResultsOfRecentDiv.appendChild(header);

    completedTestResultsOfRecentDiv.appendChild(table);
}

//show all medicines 
const showAllPrescribedMedicines= async () => {
    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
        }),
    };
    const url = "http://localhost:3000/prescription/getAllPrescribedMedicines";
    const response = await fetch(url, options);
    const allPrescribedMedicines = await response.json();
    //display all prescribed medicines in a table
    displayAllPrescribedMedicines(allPrescribedMedicines);
}
//display all prescribed medicines in a table
const displayAllPrescribedMedicines = (allPrescribedMedicines) => {
    //if size of allPrescribedMedicines is 0, then show a message
    if(allPrescribedMedicines.length === 0){
        const allPrescribedMedicinesDiv = document.getElementById("allPrescribedMedicines");
        allPrescribedMedicinesDiv.innerHTML = "";
        const header = document.createElement("h2");
        header.textContent = "No Prescribed Medicines Available";
        allPrescribedMedicinesDiv.appendChild(header);
        return;
    }
    const allPrescribedMedicinesDiv = document.getElementById("allPrescribedMedicines");
    allPrescribedMedicinesDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in allPrescribedMedicines[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let medicine of allPrescribedMedicines){
        const row = document.createElement("tr");
        for(let key in medicine){
            const cell = document.createElement("td");
            cell.textContent = medicine[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Medicine
    const header = document.createElement("h2");
    header.textContent = "All Prescribed Medicines";
    allPrescribedMedicinesDiv.appendChild(header);

    allPrescribedMedicinesDiv.appendChild(table);
}

const showAllPrescribedAdvices= async () => {
    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
        }),
    };
    const url = "http://localhost:3000/prescription/getAllPrescribedAdvices";
    const response = await fetch(url, options);
    const allPrescribedAdvices = await response.json();
    //display all prescribed advices in a table
    displayAllPrescribedAdvices(allPrescribedAdvices);
}
//display all prescribed advices in a table
const displayAllPrescribedAdvices = (allPrescribedAdvices) => {
    //if size of allPrescribedAdvices is 0, then show a message
    if(allPrescribedAdvices.length === 0){
        const allPrescribedAdvicesDiv = document.getElementById("allPrescribedAdvices");
        allPrescribedAdvicesDiv.innerHTML = "";
        const header = document.createElement("h2");
        header.textContent = "No Prescribed Advices Available";
        allPrescribedAdvicesDiv.appendChild(header);
        return;
    }
    const allPrescribedAdvicesDiv = document.getElementById("allPrescribedAdvices");
    allPrescribedAdvicesDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in allPrescribedAdvices[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let advice of allPrescribedAdvices){
        const row = document.createElement("tr");
        for(let key in advice){
            const cell = document.createElement("td");
            cell.textContent = advice[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Medicine
    const header = document.createElement("h2");
    header.textContent = "All Prescribed Advices";
    allPrescribedAdvicesDiv.appendChild(header);

    allPrescribedAdvicesDiv.appendChild(table);
}

//show all tests 
const showAllPrescribedTests= async () => {
    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
        }),
    };
    const url = "http://localhost:3000/prescription/getAllPrescribedTests";
    const response = await fetch(url, options);
    const allPrescribedTests = await response.json();
    //display all prescribed tests in a table
    displayAllPrescribedTests(allPrescribedTests);
}
//display all prescribed tests in a table
const displayAllPrescribedTests = (allPrescribedTests) => {
    //if size of allPrescribedTests is 0, then show a message
    if(allPrescribedTests.length === 0){
        const allPrescribedTestsDiv = document.getElementById("allPrescribedTests");
        allPrescribedTestsDiv.innerHTML = "";
        const header = document.createElement("h2");
        header.textContent = "No Prescribed Tests Available";
        allPrescribedTestsDiv.appendChild(header);
        return;
    }
    const allPrescribedTestsDiv = document.getElementById("allPrescribedTests");
    allPrescribedTestsDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in allPrescribedTests[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let test of allPrescribedTests){
        const row = document.createElement("tr");
        for(let key in test){
            const cell = document.createElement("td");
            cell.textContent = test[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Medicine
    const header = document.createElement("h2");
    header.textContent = "All Prescribed Tests";
    allPrescribedTestsDiv.appendChild(header);

    allPrescribedTestsDiv.appendChild(table);
}
//show all test results
const showAllCompletedTestResults= async () => {
    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
        }),
    };
    const url = "http://localhost:3000/prescription/getAllCompletedTestResults";
    const response = await fetch(url, options);
    const allCompletedTestResults = await response.json();
    //display all prescribed test results in a table
    displayAllCompletedTestResults(allCompletedTestResults);
}
//display all prescribed test results in a table
const displayAllCompletedTestResults = (allCompletedTestResults) => {
    //if size of allCompletedTestResults is 0, then show a message
    if(allCompletedTestResults.length === 0){
        const allCompletedTestResultsDiv = document.getElementById("allCompletedTestResults");
        allCompletedTestResultsDiv.innerHTML = "";
        const header = document.createElement("h2");
        header.textContent = "No Completed Test Results Available";
        allCompletedTestResultsDiv.appendChild(header);
        return;
    }
    const allCompletedTestResultsDiv = document.getElementById("allCompletedTestResults");
    allCompletedTestResultsDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in allCompletedTestResults[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let testResult of allCompletedTestResults){
        const row = document.createElement("tr");
        for(let key in testResult){
            const cell = document.createElement("td");
            cell.textContent = testResult[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Medicine
    const header = document.createElement("h2");
    header.textContent = "All Completed Test Results";
    allCompletedTestResultsDiv.appendChild(header);

    allCompletedTestResultsDiv.appendChild(table);
}


//on a given date
const showPrescribedMedicineOnGivenAppointmentDate= async () => {
    //get date from input
    const appointmentDate1 = document.getElementById("appointmentDateForPrescription").value;
    //convert into 'DD-MMM-YYYY' format
    const appointmentDate = new Date(appointmentDate1).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    }).split(' ').join('-');
    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
            appointmentDate: appointmentDate,
        }),
    };
    const url = "http://localhost:3000/prescription/getPrescribedMedicineOnGivenAppointmentDate";
    const response = await fetch(url, options);
    const prescribedMedicineOnGivenAppointmentDate = await response.json();
    //display all prescribed medicines in a table
    displayPrescribedMedicineOnGivenAppointmentDate(prescribedMedicineOnGivenAppointmentDate);
}
//display all prescribed medicines in a table
const displayPrescribedMedicineOnGivenAppointmentDate = (prescribedMedicineOnGivenAppointmentDate) => {
    //if size of prescribedMedicineOnGivenAppointmentDate is 0, then show a message
    if(prescribedMedicineOnGivenAppointmentDate.length === 0){
        const prescribedMedicineOnGivenAppointmentDateDiv = document.getElementById("prescribedMedicineOnGivenAppointmentDate");
        prescribedMedicineOnGivenAppointmentDateDiv.innerHTML = "";
        const header = document.createElement("h2");
        header.textContent = "No Prescribed Medicines Available";
        prescribedMedicineOnGivenAppointmentDateDiv.appendChild(header);
        return;
    }
    const prescribedMedicineOnGivenAppointmentDateDiv = document.getElementById("prescribedMedicineOnGivenAppointmentDate");
    prescribedMedicineOnGivenAppointmentDateDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in prescribedMedicineOnGivenAppointmentDate[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let medicine of prescribedMedicineOnGivenAppointmentDate){
        const row = document.createElement("tr");
        for(let key in medicine){
            const cell = document.createElement("td");
            cell.textContent = medicine[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Medicine
    const header = document.createElement("h2");
    header.textContent = "Prescribed Medicines On a Given Appointment Date";
    prescribedMedicineOnGivenAppointmentDateDiv.appendChild(header);

    prescribedMedicineOnGivenAppointmentDateDiv.appendChild(table);
}

const showPrescribedAdvicesOnGivenAppointmentDate= async () => {
    //get date from input
    const appointmentDate1 = document.getElementById("appointmentDateForPrescription").value;
    const appointmentDate = new Date(appointmentDate1).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    }).split(' ').join('-');
    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
            appointmentDate: appointmentDate,
        }),
    };
    const url = "http://localhost:3000/prescription/getPrescribedAdvicesOnGivenAppointmentDate";
    const response = await fetch(url, options);
    const prescribedAdvicesOnGivenAppointmentDate = await response.json();
    //display all prescribed advices in a table
    displayPrescribedAdvicesOnGivenAppointmentDate(prescribedAdvicesOnGivenAppointmentDate);
}
//display all prescribed advices in a table
const displayPrescribedAdvicesOnGivenAppointmentDate = (prescribedAdvicesOnGivenAppointmentDate) => {
    //if size of prescribedAdvicesOnGivenAppointmentDate is 0, then show a message
    if(prescribedAdvicesOnGivenAppointmentDate.length === 0){
        const prescribedAdvicesOnGivenAppointmentDateDiv = document.getElementById("prescribedAdvicesOnGivenAppointmentDate");
        prescribedAdvicesOnGivenAppointmentDateDiv.innerHTML = "";
        const header = document.createElement("h2");
        header.textContent = "No Prescribed Advices Available";
        prescribedAdvicesOnGivenAppointmentDateDiv.appendChild(header);
        return;
    }
    const prescribedAdvicesOnGivenAppointmentDateDiv = document.getElementById("prescribedAdvicesOnGivenAppointmentDate");
    prescribedAdvicesOnGivenAppointmentDateDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in prescribedAdvicesOnGivenAppointmentDate[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let advice of prescribedAdvicesOnGivenAppointmentDate){
        const row = document.createElement("tr");
        for(let key in advice){
            const cell = document.createElement("td");
            cell.textContent = advice[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Medicine
    const header = document.createElement("h2");
    header.textContent = "Prescribed Advices On a Given Appointment Date";
    prescribedAdvicesOnGivenAppointmentDateDiv.appendChild(header);

    prescribedAdvicesOnGivenAppointmentDateDiv.appendChild(table);
}

const showPrescribedTestsOnGivenAppointmentDate= async () => {
    //get date from input
    const appointmentDate1= document.getElementById("appointmentDateForPrescription").value;
    const appointmentDate = new Date(appointmentDate1).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    }).split(' ').join('-');
    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
            appointmentDate: appointmentDate,
        }),
    };
    const url = "http://localhost:3000/prescription/getPrescribedTestsOnGivenAppointmentDate";
    const response = await fetch(url, options);
    const prescribedTestsOnGivenAppointmentDate = await response.json();
    //display all prescribed tests in a table
    displayPrescribedTestsOnGivenAppointmentDate(prescribedTestsOnGivenAppointmentDate);
}
//display all prescribed tests in a table
const displayPrescribedTestsOnGivenAppointmentDate = (prescribedTestsOnGivenAppointmentDate) => {
    //if size of prescribedTestsOnGivenAppointmentDate is 0, then show a message
    if(prescribedTestsOnGivenAppointmentDate.length === 0){
        const prescribedTestsOnGivenAppointmentDateDiv = document.getElementById("prescribedTestsOnGivenAppointmentDate");
        prescribedTestsOnGivenAppointmentDateDiv.innerHTML = "";
        const header = document.createElement("h2");
        header.textContent = "No Prescribed Tests Available";
        prescribedTestsOnGivenAppointmentDateDiv.appendChild(header);
        return;
    }
    const prescribedTestsOnGivenAppointmentDateDiv = document.getElementById("prescribedTestsOnGivenAppointmentDate");
    prescribedTestsOnGivenAppointmentDateDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in prescribedTestsOnGivenAppointmentDate[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let test of prescribedTestsOnGivenAppointmentDate){
        const row = document.createElement("tr");
        for(let key in test){
            const cell = document.createElement("td");
            cell.textContent = test[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Medicine
    const header = document.createElement("h2");
    header.textContent = "Prescribed Tests On a Given Appointment Date";
    prescribedTestsOnGivenAppointmentDateDiv.appendChild(header);

    prescribedTestsOnGivenAppointmentDateDiv.appendChild(table);
}

const showCompletedTestResultsOnGivenAppointmentDate= async () => {
    //get date from input
    const appointmentDate1 = document.getElementById("appointmentDateForPrescription").value;
    const appointmentDate = new Date(appointmentDate1).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    }).split(' ').join('-');
    console.log(appointmentDate);
    console.log(appointmentDate1);
    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patientId: patientId,
            appointmentDate: appointmentDate,
        }),
    };
    const url = "http://localhost:3000/prescription/getCompletedTestResultsOnGivenAppointmentDate";
    const response = await fetch(url, options);
    const completedTestResultsOnGivenAppointmentDate = await response.json();
    //display all prescribed test results in a table
    displayCompletedTestResultsOnGivenAppointmentDate(completedTestResultsOnGivenAppointmentDate);
}
//display all prescribed test results in a table
const displayCompletedTestResultsOnGivenAppointmentDate = (completedTestResultsOnGivenAppointmentDate) => {
    //if size of completedTestResultsOnGivenAppointmentDate is 0, then show a message
    if(completedTestResultsOnGivenAppointmentDate.length === 0){
        const completedTestResultsOnGivenAppointmentDateDiv = document.getElementById("completedTestResultsOnGivenAppointmentDate");
        completedTestResultsOnGivenAppointmentDateDiv.innerHTML = "";
        const header = document.createElement("h2");
        header.textContent = "No Completed Test Results Available";
        completedTestResultsOnGivenAppointmentDateDiv.appendChild(header);
        return;
    }
    const completedTestResultsOnGivenAppointmentDateDiv = document.getElementById("completedTestResultsOnGivenAppointmentDate");
    completedTestResultsOnGivenAppointmentDateDiv.innerHTML = "";
    const table = document.createElement("table");
    // Add table header row
    const headerRow = document.createElement("tr");
    for(let key in completedTestResultsOnGivenAppointmentDate[0]){
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
    // Add table rows
    for(let testResult of completedTestResultsOnGivenAppointmentDate){
        const row = document.createElement("tr");
        for(let key in testResult){
            const cell = document.createElement("td");
            cell.textContent = testResult[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    //create a header with content All Given Medicine
    const header = document.createElement("h2");
    header.textContent = "Completed Test Results On a Given Appointment Date";
    completedTestResultsOnGivenAppointmentDateDiv.appendChild(header);

    completedTestResultsOnGivenAppointmentDateDiv.appendChild(table);
}