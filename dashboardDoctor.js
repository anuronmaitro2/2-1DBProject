const urlParams = new URLSearchParams(window.location.search);
let doctorId = urlParams.get('doctorId');
//convert to number
const doctorId1 = parseInt(doctorId);
doctorId = doctorId1;

let isLoggedIn = false;
const login = async () => {

  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/loginAsADoctor/${doctorId}`;
      console.log("In dashboardDoctor.js");
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const doctorInfo = await response.json();
          console.log(doctorInfo);
          isLoggedIn = true;
          // Display doctor information
          displayDoctorInfo(doctorInfo[0]);
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
const displayDoctorInfo = (doctorInfo) => {
  const doctorInfoDiv = document.getElementById("doctorInfo");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in doctorInfo) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table row
  const tableRow = document.createElement("tr");
  for (const key in doctorInfo) {
    const tableCell = document.createElement("td");
    tableCell.textContent = doctorInfo[key];
    tableRow.appendChild(tableCell);
  }
  table.appendChild(tableRow);
  doctorInfoDiv.appendChild(table);
};



//view appointment as a doctor

const viewAppointments = async () => {
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const url = `http://localhost:3000/viewAppointments/${doctorId}`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const appointments = await response.json();
          console.log(appointments);
          // Display appointments information
          displayAppointments(appointments);
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

const displayAppointments = (appointments) => {
  if (appointments.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("appointmentsTable");
    doctorInfoDiv.innerHTML = "NO APPOINTMENTS";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("appointmentsTable");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in appointments[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  const approveButtonHeaderCell = document.createElement("th");
  approveButtonHeaderCell.textContent = "Approve";
  tableHeader.appendChild(approveButtonHeaderCell);
  table.appendChild(tableHeader);
  const discardButtonHeaderCell = document.createElement("th");
  discardButtonHeaderCell.textContent = "Discard";
  tableHeader.appendChild(discardButtonHeaderCell);
  
  const prescriptionButtonHeaderCell = document.createElement("th");
  prescriptionButtonHeaderCell.textContent = "Prescription History";
  tableHeader.appendChild(prescriptionButtonHeaderCell);
  // Add table rows with data
  for (const appointment of appointments) {
    const tableRow = document.createElement("tr");
    for (const key in appointment) {
      const tableCell = document.createElement("td");
      tableCell.textContent = appointment[key];
      tableRow.appendChild(tableCell);
    }
    // Add a cell for the "Approve" button
    const approveButtonCell = document.createElement("td");
    const approveButton = document.createElement("button");
    approveButton.textContent = "Approve";
    approveButton.addEventListener("click", () => {
      approveAppointment(appointment.APPOINTMENTID);
      //add a button to see prescription history
    });
    approveButtonCell.appendChild(approveButton);
    tableRow.appendChild(approveButtonCell);

    //add a button of discarding the appointment
    const discardButtonCell = document.createElement("td");
    const discardButton = document.createElement("button");
    discardButton.textContent = "Discard";
    discardButton.addEventListener("click", () => {
      discardAppointment(appointment.APPOINTMENTID);
    });
    discardButtonCell.appendChild(discardButton);
    tableRow.appendChild(discardButtonCell);
    //add a cell for the "Prescription History" button
    const prescriptionButtonCell = document.createElement("td");
    const prescriptionButton = document.createElement("button");
    prescriptionButton.textContent = "Prescription History Under Me";
    //call a function to show prescription history
    prescriptionButton.addEventListener("click", () => {
      //open a new html page named prescription history with the  doctor id and patient id and appointment id and disease as route parameters
      //open in new tab

      //window.location.href = `prescriptionHistory.html?doctorId=${doctorId}&patientId=${appointment.PATIENTID}&appointmentId=${appointment.APPOINTMENTID}`;
      //open in new tab
      window.open(`prescriptionHistory.html?doctorId=${doctorId}&patientId=${appointment.PATIENTID}&appointmentId=${appointment.APPOINTMENTID}&disease=${appointment.PATIENTDISEASE}`, '_blank');
      //focus on the new window

   
    });
    prescriptionButtonCell.appendChild(prescriptionButton);
    tableRow.appendChild(prescriptionButtonCell);

    table.appendChild(tableRow);

  }
  doctorInfoDiv.appendChild(table);
};
//discard appointment
const discardAppointment = async (appointmentId) => {
  // Send a request to delete the appointment
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = `http://localhost:3000/discardAppointment/${appointmentId}`;
    const response = await fetch(url, options);

    if (response.ok) {
      alert("Appointment discarded successfully!");
      // If the delete is successful, refresh the page to reflect the changes
      location.reload();
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error(error);
  }
}



////approve appointment


const approveAppointment = async (appointmentId) => {
  // Send a request to update the appointment status to "APPROVED"
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "APPROVED" }),
  };

  try {
    const url = `http://localhost:3000/approveAppointment/${appointmentId}`;
    const response = await fetch(url, options);

    if (response.ok) {
      alert("Appointment approved successfully!");
      // If the update is successful, navigate to the prescription page
      window.location.href = `prescription.html?appointmentId=${appointmentId}`;
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error(error);
  }
};

//show prescription history under me
const showPrescriptionHistory = async (patientId, appointmentId) => {
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  // Check if doctor ID is not empty
  if (doctorId != "") {
    //call 4 functions to show medicine, advice, lab test and lab test result
    showTakenMedicineUnderMe(patientId, doctorId);
    showTakenAdviceUnderMe(patientId, doctorId);
    showTakenLabTestUnderMe(patientId, doctorId);
    showTakenLabTestResultUnderMe(patientId, doctorId);
  }
};
const showTakenMedicineUnderMe = async (patientId, doctorId) => {
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientId: patientId, doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewPatientsMedicineUnderMe/${doctorId}`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const medicine = await response.json();
          console.log("Response from server:");
          console.log(medicine);
          // Display medicine information
          displayMedicineUnderMe(medicine);
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
//display medicine under me
const displayMedicineUnderMe = (medicines) => {
  if (medicines.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("patientHistoryUnderMeMedicine");
    doctorInfoDiv.innerHTML = "NO MEDICINE";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("patientHistoryUnderMeMedicine");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in medicines[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const medicine of medicines) {
    const tableRow = document.createElement("tr");
    for (const key in medicine) {
      const tableCell = document.createElement("td");
      tableCell.textContent = medicine[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "Given Medicine";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
};
//show taken advice under me
const showTakenAdviceUnderMe = async (patientId, doctorId) => {
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientId: patientId, doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewPatientsAdviceUnderMe/${doctorId}`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const advice = await response.json();
          console.log("Response from server:");
          console.log(advice);
          // Display advice information
          displayAdviceUnderMe(advice);
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
//display advice under me
const displayAdviceUnderMe = (advices) => {
  if (advices.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("patientHistoryUnderMeAdvice");
    doctorInfoDiv.innerHTML = "NO ADVICE";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("patientHistoryUnderMeAdvice");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in advices[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const advice of advices) {
    const tableRow = document.createElement("tr");
    for (const key in advice) {
      const tableCell = document.createElement("td");
      tableCell.textContent = advice[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "Given Advice";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
};
//show taken lab test under me
const showTakenLabTestUnderMe = async (patientId, doctorId) => {
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientId: patientId, doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewPatientsLabTestUnderMe/${doctorId}`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const labTest = await response.json();
          console.log("Response from server:");
          console.log(labTest);
          // Display advice information
          displayLabTestUnderMe(labTest);
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
//display lab test under me
const displayLabTestUnderMe = (labTests) => {
  if (labTests.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("patientHistoryUnderMeLabTest");
    doctorInfoDiv.innerHTML = "NO LAB TEST";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("patientHistoryUnderMeLabTest");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in labTests[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const labTest of labTests) {
    const tableRow = document.createElement("tr");
    for (const key in labTest) {
      const tableCell = document.createElement("td");
      tableCell.textContent = labTest[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "Given Lab Test";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
};
//show taken lab test result under me
const showTakenLabTestResultUnderMe = async (patientId, doctorId) => {
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientId: patientId, doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewPatientsLabTestResultUnderMe/${doctorId}`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const labTestResult = await response.json();
          console.log("Response from server:");
          console.log(labTestResult);
          // Display advice information
          displayLabTestResultUnderMe(labTestResult);
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
//display lab test result under me
const displayLabTestResultUnderMe = (labTestResults) => {
  if (labTestResults.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("patientHistoryUnderMeLabTestResult");
    doctorInfoDiv.innerHTML = "NO LAB TEST RESULT";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("patientHistoryUnderMeLabTestResult");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in labTestResults[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const labTestResult of labTestResults) {
    const tableRow = document.createElement("tr");
    for (const key in labTestResult) {
      const tableCell = document.createElement("td");
      tableCell.textContent = labTestResult[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "Completed Lab Test Results";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
};

//show patients medicine under the doctor
//show patients medicine under the doctor
const showTakenMedicine = async () => {
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  //take patient name from html
  const patientName = document.getElementById("patientName").value;
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientName: patientName, doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewPatientsMedicine/${doctorId}`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const medicine = await response.json();
          console.log("Response from server:");
          console.log(medicine);
          // Display medicine information
          displayMedicine(medicine);
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
//display medicine
//show the result in a table
const displayMedicine = (medicines) => {
  if (medicines.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("takenMedicine");
    doctorInfoDiv.innerHTML = "NO MEDICINE";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("takenMedicine");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in medicines[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const medicine of medicines) {
    const tableRow = document.createElement("tr");
    for (const key in medicine) {
      const tableCell = document.createElement("td");
      tableCell.textContent = medicine[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "Given Medicine";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
};
//show taken advice
const showTakenAdvice = async () => {
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  //take patient name from html
  const patientName = document.getElementById("patientName").value;
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientName: patientName, doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewPatientsAdvice/${doctorId}`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);
      console.log(response);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const advice = await response.json();
          console.log("Response from server:");
          console.log(advice);
          // Display advice information
          displayAdvice(advice);
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
//display advice
//show the result in a table
const displayAdvice = (advices) => {
  if (advices.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("takenAdvices");
    doctorInfoDiv.innerHTML = "NO ADVICE";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("takenAdvices");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in advices[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const advice of advices) {
    const tableRow = document.createElement("tr");
    for (const key in advice) {
      const tableCell = document.createElement("td");
      tableCell.textContent = advice[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "Given Advice";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
};

//show taken lab test
const showTakenLabTest = async () => {
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  //take patient name from html
  const patientName = document.getElementById("patientName").value;
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientName: patientName, doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewPatientsLabTest/${doctorId}`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);
      console.log(response);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const labTest = await response.json();
          console.log("Response from server:");
          console.log(labTest);
          // Display advice information
          displayLabTest(labTest);
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
//display lab test
//show the result in a table
const displayLabTest = (labTests) => {
  if (labTests.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("takenLabTests");
    doctorInfoDiv.innerHTML = "NO LAB TEST";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("takenLabTests");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in labTests[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const labTest of labTests) {
    const tableRow = document.createElement("tr");
    for (const key in labTest) {
      const tableCell = document.createElement("td");
      tableCell.textContent = labTest[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "Given Lab Test";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
};
//show taken lab test result
const showTakenLabTestResult = async () => {
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  //take patient name from html
  const patientName = document.getElementById("patientName").value;
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ patientName: patientName, doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewPatientsLabTestResult/${doctorId}`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);
      console.log(response);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const labTestResult = await response.json();
          console.log("Response from server:");
          console.log(labTestResult);
          // Display advice information
          displayLabTestResult(labTestResult);
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
//display lab test result
//show the result in a table
const displayLabTestResult = (labTestResults) => {
  if (labTestResults.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("resultofCompletedLabTests");
    doctorInfoDiv.innerHTML = "NO LAB TEST RESULT";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("resultofCompletedLabTests");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in labTestResults[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const labTestResult of labTestResults) {
    const tableRow = document.createElement("tr");
    for (const key in labTestResult) {
      const tableCell = document.createElement("td");
      tableCell.textContent = labTestResult[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "Completed Lab Test Results";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
};

//showTakenMedicineOnaGivenAppointment
const showTakenMedicineOnaGivenAppointment = async () => {
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  //take patient name from html
  const appointmentId = document.getElementById("appointmentId").value;
  const patientName = document.getElementById("patientNameOnaGivenAppointment").value;
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ appointmentId: appointmentId, patientName: patientName, doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewPatientsMedicineOnaGivenAppointment/${doctorId}`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);
      console.log(response);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const medicine = await response.json();
          console.log("Response from server:");
          console.log(medicine);
          // Display advice information
          displayMedicineOnaGivenAppointment(medicine);
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
//display medicine
//show the result in a table
const displayMedicineOnaGivenAppointment = (medicines) => {
  if (medicines.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("takenMedicineOnaGivenAppointment");
    doctorInfoDiv.innerHTML = "NO MEDICINE";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("takenMedicineOnaGivenAppointment");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in medicines[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const medicine of medicines) {
    const tableRow = document.createElement("tr");
    for (const key in medicine) {
      const tableCell = document.createElement("td");
      tableCell.textContent = medicine[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "Given Medicine";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
};


//showTakenAdviceOnaGivenAppointment
const showTakenAdviceOnaGivenAppointment = async () => {
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  //take patient name from html
  const appointmentId = document.getElementById("appointmentId").value;
  const patientName = document.getElementById("patientNameOnaGivenAppointment").value;
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ appointmentId: appointmentId, patientName: patientName, doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewPatientsAdviceOnaGivenAppointment/${doctorId}`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);
      console.log(response);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const advice = await response.json();
          console.log("Response from server:");
          console.log(advice);
          // Display advice information
          displayAdviceOnaGivenAppointment(advice);
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
//display advice
//show the result in a table
const displayAdviceOnaGivenAppointment = (advices) => {
  if (advices.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("takenAdvicesOnaGivenAppointment");
    doctorInfoDiv.innerHTML = "NO ADVICE";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("takenAdvicesOnaGivenAppointment");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in advices[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const advice of advices) {
    const tableRow = document.createElement("tr");
    for (const key in advice) {
      const tableCell = document.createElement("td");
      tableCell.textContent = advice[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "Given Advice";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
};


//showTakenLabTestOnaGivenAppointment
const showTakenLabTestOnaGivenAppointment = async () => {
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  //take patient name from html
  const appointmentId = document.getElementById("appointmentId").value;
  const patientName = document.getElementById("patientNameOnaGivenAppointment").value;
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ appointmentId: appointmentId, patientName: patientName, doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewPatientsLabTestOnaGivenAppointment/${doctorId}`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);
      console.log(response);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const labTest = await response.json();
          console.log("Response from server:");
          console.log(labTest);
          // Display advice information
          displayLabTestOnaGivenAppointment(labTest);
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
//display lab test
//show the result in a table
const displayLabTestOnaGivenAppointment = (labTests) => {
  if (labTests.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("takenLabTestsOnaGivenAppointment");
    doctorInfoDiv.innerHTML = "NO LAB TEST";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("takenLabTestsOnaGivenAppointment");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in labTests[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const labTest of labTests) {
    const tableRow = document.createElement("tr");
    for (const key in labTest) {
      const tableCell = document.createElement("td");
      tableCell.textContent = labTest[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "Given Lab Test";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
};

//showTakenLabTestResultOnaGivenAppointment
const showTakenLabTestResultOnaGivenAppointment = async () => {
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  //take patient name from html
  const appointmentId = document.getElementById("appointmentId").value;
  const patientName = document.getElementById("patientNameOnaGivenAppointment").value;
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ appointmentId: appointmentId, patientName: patientName, doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewPatientsLabTestResultOnaGivenAppointment/${doctorId}`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);
      console.log(response);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const labTestResult = await response.json();
          console.log("Response from server:");
          console.log(labTestResult);
          // Display advice information
          displayLabTestResultOnaGivenAppointment(labTestResult);
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
//display lab test result
//show the result in a table
const displayLabTestResultOnaGivenAppointment = (labTestResults) => {
  if (labTestResults.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("resultofCompletedLabTestsOnaGivenAppointment");
    doctorInfoDiv.innerHTML = "NO LAB TEST RESULT";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("resultofCompletedLabTestsOnaGivenAppointment");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in labTestResults[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const labTestResult of labTestResults) {
    const tableRow = document.createElement("tr");
    for (const key in labTestResult) {
      const tableCell = document.createElement("td");
      tableCell.textContent = labTestResult[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "Completed Lab Test Results";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
};







//new 

//patient who has taken more than one appointment with same disease
const showPatientsWhoHasTakenMorethanOneAppointmentWithSingleDisease=async()=>{
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewPatientsWhoHasTakenMorethanOneAppointmentWithSingleDisease`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);
      console.log(response);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const patients = await response.json();
          console.log("Response from server:");
          console.log(patients);
          // Display advice information
          displayPatientsWhoHasTakenMorethanOneAppointmentWithSingleDisease(patients);
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
const displayPatientsWhoHasTakenMorethanOneAppointmentWithSingleDisease=(patients)=>{
  if (patients.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("patientsWhoHasTakenMorethanOneAppointmentWithSingleDisease");
    doctorInfoDiv.innerHTML = "NO PATIENTS";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("patientsWhoHasTakenMorethanOneAppointmentWithSingleDisease");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in patients[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const patient of patients) {
    const tableRow = document.createElement("tr");
    for (const key in patient) {
      const tableCell = document.createElement("td");
      tableCell.textContent = patient[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "Patients Who Has Taken More than One Appointment With Single Disease";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
}

const showMyLast7DaysAppointments=async()=>{
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewMyLast7DaysAppointments`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);
      console.log(response);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const appointments = await response.json();
          console.log("Response from server:");
          console.log(appointments);
          // Display advice information
          displayMyLast7DaysAppointments(appointments);
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
}
const displayMyLast7DaysAppointments=(appointments)=>{
  if (appointments.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("myLast7DaysAppointments");
    doctorInfoDiv.innerHTML = "NO APPOINTMENTS";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("myLast7DaysAppointments");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in appointments[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const appointment of appointments) {
    const tableRow = document.createElement("tr");
    for (const key in appointment) {
      const tableCell = document.createElement("td");
      tableCell.textContent = appointment[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "My Last 7 Days Appointments";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
}

const showMyLastMonthIncome=async()=>{
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewMyLastMonthIncome`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);
      console.log(response);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const income = await response.json();
          console.log("Response from server:");
          console.log(income);
          // Display advice information
          displayMyLastMonthIncome(income);
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
}
const displayMyLastMonthIncome=(incomes)=>{
  if (incomes.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("myLastMonthIncome");
    //create a h3
    const header = document.createElement("h3");
    //set the text of h3
    header.textContent = "NO INCOME SINCE LAST MONTH SEE SOME PATIENTS TO EARN";
    //append the h3 to the div
    doctorInfoDiv.appendChild(header);
    
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("myLastMonthIncome");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in incomes[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const income of incomes) {
    const tableRow = document.createElement("tr");
    for (const key in income) {
      const tableCell = document.createElement("td");
      tableCell.textContent = income[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "My Last Month Income";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
}
window.onload = login;


const showMyHighestNumberOfAppointments=async()=>{
  if (isLoggedIn === false) {
    alert("Please login first");
  }
  console.log(doctorId);
  // Check if doctor ID is not empty
  if (doctorId != "") {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ doctorId: parseInt(doctorId) }),
    };
    try {
      const url = `http://localhost:3000/viewMyHighestNumberOfAppointments`;
      console.log(url);
      console.log(doctorId);
      const response = await fetch(url, options);
      console.log(response);

      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const contentType = response.headers.get("content-type");

        // Check if the response is JSON
        if (contentType && contentType.includes("application/json")) {
          const appointments = await response.json();
          console.log("Response from server:");
          console.log(appointments);
          // Display advice information
          displayMyHighestNumberOfAppointments(appointments);
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
}
const displayMyHighestNumberOfAppointments=(appointments)=>{
  if (appointments.length === 0) {
    //show in html that no appointments are there
    const doctorInfoDiv = document.getElementById("myHighestNumberOfAppointments");
    doctorInfoDiv.innerHTML = "I Have No Appointments Yet";
    return;
    //just show no appointments in div
    //no need to show table

  }

  const doctorInfoDiv = document.getElementById("myHighestNumberOfAppointments");
  doctorInfoDiv.innerHTML = "";
  // Display data in a table
  const table = document.createElement("table");
  // Add table header row
  const tableHeader = document.createElement("tr");
  for (const key in appointments[0]) {
    const tableHeaderCell = document.createElement("th");
    tableHeaderCell.textContent = key;
    tableHeader.appendChild(tableHeaderCell);
  }
  table.appendChild(tableHeader);
  // Add table rows with data
  for (const appointment of appointments) {
    const tableRow = document.createElement("tr");
    for (const key in appointment) {
      const tableCell = document.createElement("td");
      tableCell.textContent = appointment[key];
      tableRow.appendChild(tableCell);
    }
    table.appendChild(tableRow);
  }
  //add a header naming given medicine
  const header = document.createElement("h3");
  header.textContent = "My Highest Number Of Appointments";
  doctorInfoDiv.appendChild(header);
  doctorInfoDiv.appendChild(table);
}
