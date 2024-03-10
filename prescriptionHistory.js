//get doctor id and patient id from route
//1st route parameter is doctor id
//2nd route parameter is patient id
//3rd route parameter is appointment id
//4th is disease 
const urlParams = new URLSearchParams(window.location.search);
const doctorId = urlParams.get("doctorId");
const patientId = urlParams.get("patientId");
const appointmentId = urlParams.get("appointmentId");
const disease = urlParams.get("disease");

const seeCountOfAppointment = async () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctorId: doctorId, patientId: patientId }),
    };

    try {
        const url = "http://localhost:3000/seeCountOfAppointment"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            //displaytheCountOfAppointment(data);
            //display the json as DoctorName:bob, PatientName:alice, Count: 5
            const doctorsPatientCountDiv = document.getElementById("countOfAppointmentTable");
            //empty the div
            doctorsPatientCountDiv.innerHTML = "";
            // const p = document.createElement("p");
            // //show in 3 lines
            // p.textContent = "Doctor Name: "+data[0].DOCTORNAME;
            // //add a line break
            // p.appendChild(document.createElement("br"));
            // p.appendChild(document.createElement("br"));
            // p.textContent += "Patient Name: "+data[0].PATIENTNAME;
            // //add a line break
            // p.appendChild(document.createElement("br"));
            // p.appendChild(document.createElement("br"));
            // p.textContent += "Count: "+data[0].
            // TOTALAPPOINTMENTS;
            // //INCREASE FONT SIZE
            // p.style.fontSize = "20px";
            // doctorsPatientCountDiv.appendChild(p);
            const h21 = document.createElement("h2");
            h21.textContent = "Doctor Name: "+data[0].DOCTORNAME;
            doctorsPatientCountDiv.appendChild(h21);
            const h22 = document.createElement("h2");
            h22.textContent = "Patient Name: "+data[0].PATIENTNAME;
            doctorsPatientCountDiv.appendChild(h22);
            const h23 = document.createElement("h2");
            const count = data[0].TOTALAPPOINTMENTS-1;
            h23.textContent = "Count: "+count;
            doctorsPatientCountDiv.appendChild(h23);
            if(data[0].TOTALAPPOINTMENTS<=1){
                const h24 = document.createElement("h2");
                h24.textContent = "Patient has not taken appointment with me before";
                doctorsPatientCountDiv.appendChild(h24);
            }
            else{
                const h24 = document.createElement("h2");
                h24.textContent = "Patient has taken appointment with me before";
                doctorsPatientCountDiv.appendChild(h24);
            }


        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error(error);
    }
}
const displaytheCountOfAppointment = (data) => {
    //show in the table
    const doctorsPatientCountDiv = document.getElementById("countOfAppointmentTable");
    ///empty the div
    doctorsPatientCountDiv.innerHTML = "";
    //display data in the table
    const table = document.createElement("table"); // Fix variable name here
    const tableHeader = document.createElement("tr");
    for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        tableHeader.appendChild(th);
    }
    table.appendChild(tableHeader);
    // Add table row
    const tableRow = document.createElement("tr");
    for (const key in data[0]) {
        const tableCell = document.createElement("td");
        tableCell.textContent = data[0][key];
        tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
    doctorsPatientCountDiv.appendChild(table);
}
const seeCountOfAppointmentWithThatDisease= async () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId: appointmentId }),
    };

    try {
        const url = "http://localhost:3000/seeCountOfAppointmentWithThatDisease"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            //if data is length 0 then no disease is there
            if(data.length==0){
                ///show patient hasnot taken appointment with me for this disease
                const doctorsPatientCountDiv = document.getElementById("countOfAppointmentWithThatDiseaseTable");
                const p = document.createElement("h3");
                p.textContent = "Patient has not taken appointment with me for this disease";
                doctorsPatientCountDiv.appendChild(p);
                return;
            }
            //displaytheCountOfAppointmentWithThatDisease(data);
            const doctorsPatientCountDiv = document.getElementById("countOfAppointmentWithThatDiseaseTable");
            //empty the div
            doctorsPatientCountDiv.innerHTML = "";
            const h21 = document.createElement("h2");
            h21.textContent = "Doctor Name: "+data[0].DOCTORNAME;
            doctorsPatientCountDiv.appendChild(h21);
            const h22 = document.createElement("h2");
            h22.textContent = "Patient Name: "+data[0].PATIENTNAME;
            doctorsPatientCountDiv.appendChild(h22);
            const h23 = document.createElement("h2");
            h23.textContent = "Disease: "+data[0].PATIENTDISEASE;            ;
            doctorsPatientCountDiv.appendChild(h23);
            const h24 = document.createElement("h2");
            h24.textContent = "Count: "+data[0].PREVIOUSAPPOINTMENTSCOUNT;
            doctorsPatientCountDiv.appendChild(h24);
            if(data[0].PREVIOUSAPPOINTMENTSCOUNT==0){
                const h25 = document.createElement("h2");
                h25.textContent = "Patient has not taken appointment with me for this disease";
                doctorsPatientCountDiv.appendChild(h25);
            }
            else{
                const h25 = document.createElement("h2");
                h25.textContent = "Patient has taken appointment with me for this disease";
                doctorsPatientCountDiv.appendChild(h25);
            }
            
        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error(error);
    }
}
const displaytheCountOfAppointmentWithThatDisease = (data) => {
    //show in the table
    const doctorsPatientCountDiv = document.getElementById("countOfAppointmentWithThatDiseaseTable");
    //display data in the table
    //empty the div
    doctorsPatientCountDiv.innerHTML = "";
    const table = document.createElement("table"); // Fix variable name here
    const tableHeader = document.createElement("tr");
    for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        tableHeader.appendChild(th);
    }
    table.appendChild(tableHeader);
    // Add table row
    const tableRow = document.createElement("tr");
    for (const key in data[0]) {
        const tableCell = document.createElement("td");
        tableCell.textContent = data[0][key];
        tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
    doctorsPatientCountDiv.appendChild(table);
}

//medicine given on this disease by me
const seeMedicinesGivenOnThisDisease= async () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ disease: disease, doctorId: doctorId, patientId: patientId}),
    };

    try {
        const url = "http://localhost:3000/seeMedicinesGivenOnThisDisease"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            //if data is length 0 then I have not given any medicine to this patient for this disease
            if(data.length==0){
                ///show patient hasnot taken appointment with me for this disease
                const doctorsPatientCountDiv = document.getElementById("medicinesGivenOnThisDiseaseTable");
                const p = document.createElement("h3");
                p.textContent = "I have not given any medicine to this patient for this disease";
                doctorsPatientCountDiv.appendChild(p);
                return;
            }
            displayMedicinesGivenOnThisDisease(data);
        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error(error);
    }
}

const displayMedicinesGivenOnThisDisease = (data) => {
    //show in the table
    const doctorsPatientCountDiv = document.getElementById("medicinesGivenOnThisDiseaseTable");
    //empty the div
    doctorsPatientCountDiv.innerHTML = "";
    //display data in the table
    const table = document.createElement("table"); // Fix variable name here
    const tableHeader = document.createElement("tr");
    for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        tableHeader.appendChild(th);
    }
    table.appendChild(tableHeader);
    // Add table row
    const tableRow = document.createElement("tr");
    for (const key in data[0]) {
        const tableCell = document.createElement("td");
        tableCell.textContent = data[0][key];
        tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
    doctorsPatientCountDiv.appendChild(table);
}
const seeLabTestsGivenOnThisDisease= async () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ disease: disease, doctorId: doctorId, patientId: patientId}),
    };

    try {
        const url = "http://localhost:3000/seeLabTestsGivenOnThisDisease"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            //if data is length 0 then I have not given any lab test to this patient for this disease
            if(data.length==0){
                ///show patient hasnot taken appointment with me for this disease
                const doctorsPatientCountDiv = document.getElementById("labTestsGivenOnThisDiseaseTable");
                const p = document.createElement("h3");
                p.textContent = "I have not given any lab test to this patient for this disease";
                doctorsPatientCountDiv.appendChild(p);
                return;
            }
            displayLabTestsGivenOnThisDisease(data);
        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error(error);
    }
}
const displayLabTestsGivenOnThisDisease = (data) => {
    //show in the table
    const doctorsPatientCountDiv = document.getElementById("labTestsGivenOnThisDiseaseTable");
    //empty the div
    doctorsPatientCountDiv.innerHTML = "";
    //display data in the table
    const table = document.createElement("table"); // Fix variable name here
    const tableHeader = document.createElement("tr");
    for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        tableHeader.appendChild(th);
    }
    table.appendChild(tableHeader);
    // Add table row
    const tableRow = document.createElement("tr");
    for (const key in data[0]) {
        const tableCell = document.createElement("td");
        tableCell.textContent = data[0][key];
        tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
    doctorsPatientCountDiv.appendChild(table);
}
//see given advice on this disease
const seeGivenAdviceOnThisDisease= async () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ disease: disease, doctorId: doctorId, patientId: patientId}),
    };

    try {
        const url = "http://localhost:3000/seeGivenAdviceOnThisDisease"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            //if data is length 0 then I have not given any advice to this patient for this disease
            if(data.length==0){
                ///show patient hasnot taken appointment with me for this disease
                const doctorsPatientCountDiv = document.getElementById("givenAdviceOnThisDiseaseTable");
                const p = document.createElement("h3");
                p.textContent = "I have not given any advice to this patient for this disease";
                doctorsPatientCountDiv.appendChild(p);
                return;
            }
            displayGivenAdviceOnThisDisease(data);
        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error(error);
    }
}

const displayGivenAdviceOnThisDisease = (data) => {
    //show in the table
    const doctorsPatientCountDiv = document.getElementById("givenAdviceOnThisDiseaseTable");
    //empty the div
    doctorsPatientCountDiv.innerHTML = "";
    //display data in the table
    const table = document.createElement("table"); // Fix variable name here
    const tableHeader = document.createElement("tr");
    for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        tableHeader.appendChild(th);
    }
    table.appendChild(tableHeader);
    // Add table row
    const tableRow = document.createElement("tr");
    for (const key in data[0]) {
        const tableCell = document.createElement("td");
        tableCell.textContent = data[0][key];
        tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
    doctorsPatientCountDiv.appendChild(table);
}


const seeGivenMedicinesOnLastAppointMent= async () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId: appointmentId, doctorId: doctorId, patientId: patientId}),
    };

    try {
        const url = "http://localhost:3000/seeGivenMedicinesOnLastAppointMent"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            //if data is length 0 then I have not given any medicine to this patient for this disease
            if(data.length==0){
                ///show patient hasnot taken appointment with me for this disease
                const doctorsPatientCountDiv = document.getElementById("givenMedicinesOnLastAppointMentTable");
                const p = document.createElement("h3");
                p.textContent = "I have not given any medicine to this patient on last appointment";
                doctorsPatientCountDiv.appendChild(p);
                return;
            }
            displayGivenMedicinesOnLastAppointMent(data);
        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error(error);
    }
}

const displayGivenMedicinesOnLastAppointMent = (data) => {
    //show in the table
    const doctorsPatientCountDiv = document.getElementById("givenMedicinesOnLastAppointMentTable");
    //display data in the table
    //empty the div
    doctorsPatientCountDiv.innerHTML = "";
    const table = document.createElement("table"); // Fix variable name here
    const tableHeader = document.createElement("tr");
    for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        tableHeader.appendChild(th);
    }
    table.appendChild(tableHeader);
    // Add table row
    const tableRow = document.createElement("tr");
    for (const key in data[0]) {
        const tableCell = document.createElement("td");
        tableCell.textContent = data[0][key];
        tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
    doctorsPatientCountDiv.appendChild(table);
}

//see given advices on last appointment
const seeGivenAdvicesOnLastAppointMent= async () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId: appointmentId, doctorId: doctorId, patientId: patientId}),
    };

    try {
        const url = "http://localhost:3000/seeGivenAdvicesOnLastAppointMent"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            //if data is length 0 then I have not given any advice to this patient for this disease
            if(data.length==0){
                ///show patient hasnot taken appointment with me for this disease
                const doctorsPatientCountDiv = document.getElementById("givenAdvicesOnLastAppointMentTable");
                const p = document.createElement("h3");
                p.textContent = "I have not given any advice to this patient on last appointment";
                doctorsPatientCountDiv.appendChild(p);
                return;
            }
            displayGivenAdvicesOnLastAppointMent(data);
        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error(error);
    }
}
const displayGivenAdvicesOnLastAppointMent = (data) => {
    //show in the table
    const doctorsPatientCountDiv = document.getElementById("givenAdvicesOnLastAppointMentTable");
    //display data in the table
    //empty the div
    doctorsPatientCountDiv.innerHTML = "";
    const table = document.createElement("table"); // Fix variable name here
    const tableHeader = document.createElement("tr");
    for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        tableHeader.appendChild(th);
    }
    table.appendChild(tableHeader);
    // Add table row
    const tableRow = document.createElement("tr");
    for (const key in data[0]) {
        const tableCell = document.createElement("td");
        tableCell.textContent = data[0][key];
        tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
    doctorsPatientCountDiv.appendChild(table);
}

const seeGivenLabTestsOnLastAppointMent= async () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId: appointmentId, doctorId: doctorId, patientId: patientId}),
    };

    try {
        const url = "http://localhost:3000/seeGivenLabTestsOnLastAppointMent"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            //if data is length 0 then I have not given any lab test to this patient for this disease
            if(data.length==0){
                ///show patient hasnot taken appointment with me for this disease
                const doctorsPatientCountDiv = document.getElementById("givenLabTestsOnLastAppointMentTable");
                const p = document.createElement("h3");
                p.textContent = "I have not given any lab test to this patient on last appointment";
                doctorsPatientCountDiv.appendChild(p);
                return;
            }
            displayGivenLabTestsOnLastAppointMent(data);
        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error(error);
    }
}
const displayGivenLabTestsOnLastAppointMent = (data) => {
    //show in the table
    const doctorsPatientCountDiv = document.getElementById("givenLabTestsOnLastAppointMentTable");
    //display data in the table
    //empty the div
    doctorsPatientCountDiv.innerHTML = "";
    const table = document.createElement("table"); // Fix variable name here
    const tableHeader = document.createElement("tr");
    for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        tableHeader.appendChild(th);
    }
    table.appendChild(tableHeader);
    // Add table row
    const tableRow = document.createElement("tr");
    for (const key in data[0]) {
        const tableCell = document.createElement("td");
        tableCell.textContent = data[0][key];
        tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
    doctorsPatientCountDiv.appendChild(table);
}

const seeOtherDoctorsGivenMedicinesOnThisDisease= async () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ disease: disease, patientId: patientId, doctorId: doctorId}),
    };

    try {
        const url = "http://localhost:3000/seeOtherDoctorsGivenMedicinesOnThisDisease"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            //if data is length 0 then no doctor has given medicine to this patient for this disease
            if(data.length==0){
                ///show patient hasnot taken appointment with me for this disease
                const doctorsPatientCountDiv = document.getElementById("otherDoctorsGivenMedicinesOnThisDiseaseTable");
                const p = document.createElement("h3");
                p.textContent = "No doctor has given medicine to this patient for this disease";
                doctorsPatientCountDiv.appendChild(p);
                return;
            }
            displayOtherDoctorsGivenMedicinesOnThisDisease(data);
        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error(error);
    }
}
const displayOtherDoctorsGivenMedicinesOnThisDisease = (data) => {
    //show in the table
    const doctorsPatientCountDiv = document.getElementById("otherDoctorsGivenMedicinesOnThisDiseaseTable");
    //display data in the table
    //empty the div
    doctorsPatientCountDiv.innerHTML = "";
    const table = document.createElement("table"); // Fix variable name here
    const tableHeader = document.createElement("tr");
    for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        tableHeader.appendChild(th);
    }
    table.appendChild(tableHeader);
    for (let i = 0; i < data.length; i++) {
        // Add table row
        const tableRow = document.createElement("tr");
        for (const key in data[i]) {
            const tableCell = document.createElement("td");
            tableCell.textContent = data[i][key];
            tableRow.appendChild(tableCell);
        }
        table.appendChild(tableRow);
    }
    doctorsPatientCountDiv.appendChild(table);
}

//see taken medicines between two dates 
const seeWhatMedicinePatientHasTakenBetweenTwoDates= async () => {
    const startDate = document.getElementById("fromDate").value;
    const endDate = document.getElementById("toDate").value;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate: startDate, endDate: endDate, patientId: patientId}),
    };

    try {
        const url = "http://localhost:3000/seeWhatMedicinePatientHasTakenBetweenTwoDates"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            //if data is length 0 then no medicine is given to this patient between these dates
            if(data.length==0){
                ///show patient hasnot taken appointment with me for this disease
                const doctorsPatientCountDiv = document.getElementById("whatMedicinePatientHasTakenBetweenTwoDatesTable");
                const p = document.createElement("h3");
                p.textContent = "No medicine is given to this patient between these dates";
                doctorsPatientCountDiv.appendChild(p);
                return;
            }
            displayWhatMedicinePatientHasTakenBetweenTwoDates(data);
        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error(error);
    }
}
const displayWhatMedicinePatientHasTakenBetweenTwoDates = (data) => {
    //show in the table
    const doctorsPatientCountDiv = document.getElementById("whatMedicinePatientHasTakenBetweenTwoDatesTable");
    //empty the div
    doctorsPatientCountDiv.innerHTML = "";
    //display data in the table
    const table = document.createElement("table"); // Fix variable name here
    const tableHeader = document.createElement("tr");
    for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        tableHeader.appendChild(th);
    }
    table.appendChild(tableHeader);
    for (let i = 0; i < data.length; i++) {
        // Add table row
        const tableRow = document.createElement("tr");
        for (const key in data[i]) {
            const tableCell = document.createElement("td");
            tableCell.textContent = data[i][key];
            tableRow.appendChild(tableCell);
        }
        table.appendChild(tableRow);
    }
    doctorsPatientCountDiv.appendChild(table);
}


//see patients previous diseases
const seePreviousDiseases= async () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientId: patientId}),
    };

    try {
        const url = "http://localhost:3000/seePreviousDiseases"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            //if data is length 0 then no disease is there
            if(data.length==0){
                ///show patient hasnot taken appointment with me for this disease
                const doctorsPatientCountDiv = document.getElementById("previousDiseasesTable");
                const p = document.createElement("h3");
                p.textContent = "No previous disease is there";
                doctorsPatientCountDiv.appendChild(p);
                return;
            }
            displayPreviousDiseases(data);
        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error(error);
    }
}
const displayPreviousDiseases = (data) => {
    //show in the table
    const doctorsPatientCountDiv = document.getElementById("previousDiseasesTable");
    //display data in the table
    //empty the div
    doctorsPatientCountDiv.innerHTML = "";
    const table = document.createElement("table"); // Fix variable name here
    const tableHeader = document.createElement("tr");
    for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        tableHeader.appendChild(th);
    }
    table.appendChild(tableHeader);
    for (let i = 0; i < data.length; i++) {
        // Add table row
        const tableRow = document.createElement("tr");
        for (const key in data[i]) {
            const tableCell = document.createElement("td");
            tableCell.textContent = data[i][key];
            tableRow.appendChild(tableCell);
        }
        table.appendChild(tableRow);
    }
    doctorsPatientCountDiv.appendChild(table);
}

const seeIfAMedicineHasBeenGivenToThisPatient= async () => {
    const medicineName = document.getElementById("medicineName").value;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ medicineName: medicineName, patientId: patientId}),
    };

    try {
        const url = "http://localhost:3000/seeIfAMedicineHasBeenGivenToThisPatient"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            //if data is length 0 then no medicine is there
            if(data.length==0){
                ///show patient hasnot taken appointment with me for this disease
                const doctorsPatientCountDiv = document.getElementById("ifAMedicineHasBeenGivenToThisPatientTable");
                const p = document.createElement("h3");
                p.textContent = "No medicine is given to this patient";
                doctorsPatientCountDiv.appendChild(p);
                return;
            }
            displayIfAMedicineHasBeenGivenToThisPatient(data);
        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error(error);
    }
}
const displayIfAMedicineHasBeenGivenToThisPatient = (data) => {
    //show in the table
    const doctorsPatientCountDiv = document.getElementById("ifAMedicineHasBeenGivenToThisPatientTable");
    //empty the div
    doctorsPatientCountDiv.innerHTML = "";
    //display data in the table
    const table = document.createElement("table"); // Fix variable name here
    const tableHeader = document.createElement("tr");
    for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        tableHeader.appendChild(th);
    }
    table.appendChild(tableHeader);
    for (let i = 0; i < data.length; i++) {
        // Add table row
        const tableRow = document.createElement("tr");
        for (const key in data[i]) {
            const tableCell = document.createElement("td");
            tableCell.textContent = data[i][key];
            tableRow.appendChild(tableCell);
        }
        table.appendChild(tableRow);
    }
    doctorsPatientCountDiv.appendChild(table);
}

const seeIfALabTestHasBeenGivenToThisPatient= async () => {
    const labTestName = document.getElementById("labTestName").value;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ labTestName: labTestName, patientId: patientId}),
    };

    try {
        const url = "http://localhost:3000/seeIfALabTestHasBeenGivenToThisPatient"; // Adjust the backend endpoint
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            //if data is length 0 then no lab test is there
            if(data.length==0){
                ///show patient hasnot taken appointment with me for this disease
                const doctorsPatientCountDiv = document.getElementById("ifALabTestHasBeenGivenToThisPatientTable");
                const p = document.createElement("h3");
                p.textContent = "No lab test is given to this patient";
                doctorsPatientCountDiv.appendChild(p);
                return;
            }
            displayIfALabTestHasBeenGivenToThisPatient(data);
        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error(error);
    }
}
const displayIfALabTestHasBeenGivenToThisPatient = (data) => {
    //show in the table
    const doctorsPatientCountDiv = document.getElementById("ifALabTestHasBeenGivenToThisPatientTable");
    //empty the div
    doctorsPatientCountDiv.innerHTML = "";
    //display data in the table
    const table = document.createElement("table"); // Fix variable name here
    const tableHeader = document.createElement("tr");
    for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        tableHeader.appendChild(th);
    }
    table.appendChild(tableHeader);
    for (let i = 0; i < data.length; i++) {
        // Add table row
        const tableRow = document.createElement("tr");
        for (const key in data[i]) {
            const tableCell = document.createElement("td");
            tableCell.textContent = data[i][key];
            tableRow.appendChild(tableCell);
        }
        table.appendChild(tableRow);
    }
    doctorsPatientCountDiv.appendChild(table);
}

window.onload = () => {
    //seePreviousDiseases();
    seeCountOfAppointment();
    seeCountOfAppointmentWithThatDisease();
    //seeMedicinesGivenOnThisDisease();
    //seeLabTestsGivenOnThisDisease();
    //seeGivenAdviceOnThisDisease();
    //seeGivenMedicinesOnLastAppointMent();
    //seeGivenAdvicesOnLastAppointMent();
    //seeGivenLabTestsOnLastAppointMent();
    //seeOtherDoctorsGivenMedicinesOnThisDisease();
}