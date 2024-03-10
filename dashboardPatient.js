let isLoggedIn = false;
let patientIdGlobal = 0;
//get patient id from the url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let patientId = urlParams.get("patientId");
//convert to number
const patientId1 = parseInt(patientId);
patientId = patientId1;
console.log("patientId");
patientIdGlobal = patientId;
const login = async () => {
  console.log(patientId);
  // Check if patient ID is not empty
  if (patientId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientId: parseInt(patientId) }),
    };
    try {
      const url = `http://localhost:3000/loginAsAPatient/${patientId}`;
      console.log(url);
      console.log(patientId);
      const response = await fetch(url, options);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const patientInfo = await response.json();
          console.log(patientInfo);
          // Display patient information
          isLoggedIn = true;
          patientIdGlobal = patientId;
          displayPatientInfo(patientInfo[0]);
        } else {
          // Handle the case when the response is not JSON
          console.error("Unexpected response format: Not JSON");
        }
      } else {
        // Handle the case when the response status is not OK
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const displayPatientInfo = (patientInfo) => {
  const patientInfoDiv = document.getElementById("patientInfo");
  patientInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in patientInfo) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table row
  const tableRow = document.createElement("tr");
  for (const key in patientInfo) {
    const tableCell = document.createElement("td");
    tableCell.textContent = patientInfo[key];
    tableRow.appendChild(tableCell);
  }
  table.appendChild(tableRow);
  patientInfoDiv.appendChild(table);
};


const search = async () => {
  if (!isLoggedIn) {
    console.error('User must be logged in to search for doctors.');
    return;
  }
  const speciality = document.getElementById("speciality").value;
  // Check if speciality is not empty
  if (speciality.trim() !== "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ speciality: speciality }),
    };
    try {
      const url = "http://localhost:3000/SearchDoctors"; // Adjust the backend endpoint
      console.log(url);
      console.log(speciality);
      const response = await fetch(url, options);
      console.log(response);
      const doctors =
        speciality === "all" ? await response.json() : await response.json();
      console.log(doctors);
      // Display data in a table

      // Display data in a table
      const table = document.createElement("table");
      const thead = table.createTHead();
      const headerRow = thead.insertRow(0);

      // Add table headers
      for (const key in doctors[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
      }
      //ADD A BUTTON TO EACH ROW anming previous number appointments with the doctor with bills
      const th = document.createElement("th");
      th.textContent = "Previous Info";

      headerRow.appendChild(th);


      // Add table rows with data
      for (const doctor of doctors) {
        const row = table.insertRow();
        for (const key in doctor) {
          const cell = row.insertCell();
          cell.textContent = doctor[key];
        }
        // Add a button to each row naming set appointment
        const cell = row.insertCell();
        const button = document.createElement("button");
        button.textContent = "Set Appointment";
        button.onclick = () => {
          setAppointment(doctor);
        };
        cell.appendChild(button);
        //add a button naming number appointments with the doctor with bills
        const cell1 = row.insertCell();
        const button1 = document.createElement("button");
        button1.textContent = "Previous Info with Bills";
        button1.onclick = () => {
          //send parameters like firstname || lastname
          previousInfo( doctor.FIRSTNAME, doctor.LASTNAME);
        };
        cell1.appendChild(button1);
      }

      // Display the table
      document.getElementById("doctorsTable").innerHTML = "";
      document.getElementById("doctorsTable").appendChild(table);
    } catch (error) {
      console.error(error);
    }
  }
};

const previousInfo = async (firstname, lastname) => {
  //concatenate firstname and lastname
  const name = firstname + " " + lastname;
  const patientId = patientIdGlobal;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name, patientId: patientId }),
  };
  try {
    const url = "http://localhost:3000/previousInfo"; // Adjust the backend endpoint
    console.log(url);
    console.log(name);
    console.log(patientId);
    const response = await fetch(url, options);
    console.log(response);
    const previousInfo = await response.json();
    console.log(previousInfo);
    // Display data in a table
    if (previousInfo.length == 0) {
      alert("No previous info!");
      return;
    }

    // Display data in a table
    const table = document.createElement("table");
    const thead = table.createTHead();
    const headerRow = thead.insertRow(0);

    // Add table headers
    for (const key in previousInfo[0]) {
      const th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    }

    // Add table rows with data
    for (const info of previousInfo) {
      const row = table.insertRow();
      for (const key in info) {
        const cell = row.insertCell();
        cell.textContent = info[key];
      }
    }

    // Display the table
    document.getElementById("previousInfoTable").innerHTML = "";
    document.getElementById("previousInfoTable").appendChild(table);
  } catch (error) {
    console.error(error);
  
  }

}
// Set appointment
const setAppointment = async (doctor) => {
  if (!isLoggedIn) {
    console.error("User must be logged in to set an appointment.");
    return;
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      patientId: patientIdGlobal,
      doctorId: doctor.DOCTORID,
      notes: "PENDING",
    }),
  };

  try {
    const url = "http://localhost:3000/setAppointment"; // Adjust the backend endpoint
    console.log(url);
    console.log(patientIdGlobal);
    console.log(doctor.DOCTORID);
    const response = await fetch(url, options);
    console.log(response);
    if (response.ok) {
      alert("Appointment set successfully!");
    } else {
      alert("Failed to set appointment!");
    }
  } catch (error) {
    console.error(error);
  }
};
window.onload = login;

//see pending lab tests

const searchLabTest = async () => {
  if (!isLoggedIn) {
    console.error("User must be logged in to see pending lab tests.");
    return;
  }
  //get the appointment id
  const appointmentId = document.getElementById("appointmentID").value;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ appointmentId: parseInt(appointmentId) }),
  };

  try {
    const url = "http://localhost:3000/seePendingLabTests"; // Adjust the backend endpoint
    console.log(url);
    console.log(patientIdGlobal);
    const response = await fetch(url, options);
    console.log(response);
    const labTests = await response.json();
    console.log(labTests);
    // Display data in a table
    if (labTests.length == 0) {
      alert("No pending lab tests!");
      return;
    }

    // Display data in a table
    const table = document.createElement("table");
    const thead = table.createTHead();
    const headerRow = thead.insertRow(0);

    // Add table headers
    for (const key in labTests[0]) {
      const th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    }

    // Add table rows with data
    for (const labTest of labTests) {
      const row = table.insertRow();
      for (const key in labTest) {
        const cell = row.insertCell();
        cell.textContent = labTest[key];
      }
    }

    // Display the table
    document.getElementById("labTestTable").innerHTML = "";
    document.getElementById("labTestTable").appendChild(table);
    // add a button at last to conduct lab tests
    //not for each row
    //at the last os the table
    const row = table.insertRow();
    const cell = row.insertCell();
    const button = document.createElement("button");
    button.textContent = "Conduct Lab Tests";
    button.onclick = () => {
      conductLabTest1();
    };
    cell.appendChild(button);
  } catch (error) {
    console.error(error);
  }
};

//conduct lab test
//open a new html page named conductLabTest.html
const conductLabTest1 = async () => {
  if (!isLoggedIn) {
    console.error("User must be logged in to conduct lab tests.");
    return;
  }

  // Get the appointment id
  const appointmentId = document.getElementById("appointmentID").value;

  // Open the LabTestCenter.html in a new window
  const newWindow = window.open(`LabTestCenter.html?appointmentId=${appointmentId}`, '_blank');

  // Optionally, you can focus on the new window
  if (newWindow) {
    newWindow.focus();
  }
};

//see payment details
const searchAppointmentForPayment = async () => {
  //open a new html page named payment.html with url param patientId
  const newWindow = window.open(`payment.html?patientId=${patientIdGlobal}`, '_blank');
  if (newWindow) {
    newWindow.focus();
  }
}
//show prescription
const showPrescription = async () => {
  //open a new html page named prescription.html with url param patientId
  const newWindow = window.open(`prescriptionPatient.html?patientId=${patientIdGlobal}`, '_blank');
  if (newWindow) {
    newWindow.focus();
  }

}



const setDisease = async () => {
  if (!isLoggedIn) {
    console.error("User must be logged in to set an appointment.");
    return;
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      patientId: patientIdGlobal,
      disease: document.getElementById("disease").value,
    }),
  };

  try {
    const url = "http://localhost:3000/setDisease"; // Adjust the backend endpoint
    console.log(url);
    console.log(patientIdGlobal);
    console.log(document.getElementById("disease").value);
    const response = await fetch(url, options);
    console.log(response);
    if (response.ok) {
      alert("Disease set successfully!");
      //refresh the page
      window.location.reload();
    } else {
      alert("Failed to set disease!");
    }
  } catch (error) {
    console.error(error);
  }
}

//see with witch doctor i have the most appointments
const searchWithWhichDoctorIHaveMostAppointment = async () => {
  //get the patient id
  const patientId = patientIdGlobal;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ patientId: patientId }),
  };

  try {
    const url = "http://localhost:3000/withWhichDoctorIHaveMostAppointment"; // Adjust the backend endpoint
    console.log(url);
    console.log(patientId);
    const response = await fetch(url, options);
    console.log(response);
    const doctor = await response.json();
    console.log(doctor);
    // Display data in a table
    if (doctor.length == 0) {
      alert("No doctor found!");
      const doctorTable = document.getElementById("withWhichDoctorIHaveMostAppointmentTable");
      doctorTable.innerHTML = "";
      //show that make appointment first
      const p = document.createElement("p");
      p.textContent = "Make an appointment first!";
      return;
    }

    // Display data in a table
    const table = document.createElement("table");
    const thead = table.createTHead();
    const headerRow = thead.insertRow(0);

    // Add table headers
    for (const key in doctor[0]) {
      const th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    }

    // Add table rows with data
    for (const doc of doctor) {
      const row = table.insertRow();
      for (const key in doc) {
        const cell = row.insertCell();
        cell.textContent = doc[key];
      }
    }

    // Display the table
    document.getElementById("withWhichDoctorIHaveMostAppointmentTable").innerHTML = "";
    document.getElementById("withWhichDoctorIHaveMostAppointmentTable").appendChild(table);
  } catch (error) {
    console.error(error);
  }
}

