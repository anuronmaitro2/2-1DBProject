// Get the appointmentId from the URL
const urlParams = new URLSearchParams(window.location.search);
const appointmentId = urlParams.get('appointmentId');

// Now, you can use the appointmentId in your prescription page logic
console.log(appointmentId);

// Add your prescription page logic here
// prescription.js

// Function to fetch and display patient details on prescription page load
const fetchAndDisplayPatientDetails = async (appointmentId) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = `http://localhost:3000/viewPatientDetails/${appointmentId}`;
    const response = await fetch(url, options);

    if (response.ok) {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const patientDetails = await response.json();
        console.log(patientDetails);
        // Display patient details on the prescription page

        //add a line stating remember the appointment id
        const patientInfoDiv = document.getElementById("patient");
        //add a header into this div naming remeber the appointment id
        const header = document.createElement("h2");
        header.textContent = "Remember the Appointment ID";
        patientInfoDiv.appendChild(header);
        // Insert patient details into prescription table
        //insertPatientDetailsIntoPrescription(patientDetails, appointmentId);
        displayPatientDetails(patientDetails);
      } else {
        console.error("Unexpected response format: Not JSON");
      }
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error(error);
  }
};

// Function to display patient details on the prescription page
const displayPatientDetails = (patientDetails) => {
  // Update the HTML elements on the prescription page with patient details
  // For example, update div elements with patient name, disease, gender, etc.
  console.log("Displaying patient details:", patientDetails);
  // Replace the following lines with actual logic to update HTML elements
  document.getElementById("patientName").textContent = patientDetails.FIRSTNAME;
  document.getElementById("disease").textContent = patientDetails.DISEASE;
  document.getElementById("gender").textContent = patientDetails.GENDER;
  document.getElementById("AppointmentID").textContent = patientDetails.APPOINTMENTID;
  //add prescription id too
  //get prescription id
  //const prescriptionID = getprescriptionID(appointmentId);
  //document.getElementById("prescriptionID").textContent = prescriptionID;
  // Add more lines as needed
};
const insertPatientDetailsIntoPrescription = async (patientDetails, appointmentId) => {
  const prescriptionData = {
    appointmentId: appointmentId,
    status: 'UNPAID',
    // Add other fields as needed
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prescriptionData),
  };

  try {
    const url = 'http://localhost:3000/insertPrescription';
    const response = await fetch(url, options);

    if (response.ok) {
      console.log("Patient details inserted into prescription table");
    } else {
      console.error("Failed to insert patient details into prescription table:", response.status);
    }
  } catch (error) {
    console.error(error);
  }
};

// Assuming you have a function to get the appointment ID from the page

fetchAndDisplayPatientDetails(appointmentId);

//function to get all avaible medicines
const fetchAndDisplayMedicines = async () => {
  //get the medcine name
  const medcineName = document.getElementById("medicine").value;
  console.log(medcineName);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      medcineName: medcineName,
    }),
  };

  try {
    const url = `http://localhost:3000/viewMedicines`;
    const response = await fetch(url, options);

    if (response.ok) {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const medicines = await response.json();
        console.log(medicines);
        // Display patient details on the prescription page
        //if length zero show alert
        if (medicines.length === 0) {
          alert("No Medicine Found");
          return;
        }
        displayMedicines(medicines);
      } else {
        console.error("Unexpected response format: Not JSON");
      }
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error(error);
  }
};
//add a button in each row to add medicine to prescription
const displayMedicines = (medicines) => {

  const medicinesDiv = document.getElementById("medicinesTable");
  medicinesDiv.innerHTML = "";
  //add a header naming All Medicines
  const header = document.createElement("h2");
  header.textContent = "All Medicines";
  medicinesDiv.appendChild(header);

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
  // Add table body rows
  // Add table body rows
  medicines.forEach((medicine) => {
    const tableRow = document.createElement("tr");
    for (const key in medicine) {
      const tableCell = document.createElement("td");
      tableCell.textContent = medicine[key];
      tableRow.appendChild(tableCell);
    }

    // Add a option picker to select the frequency of the medicine
    const frequency = document.createElement("select");
    frequency.setAttribute("id", "frequency");
    const option1 = document.createElement("option");
    option1.value = "EveryDay 3 times and Continue";
    option1.textContent = "EveryDay 3 times and Continue";
    frequency.appendChild(option1);
    const option2 = document.createElement("option");
    option2.value = "Once In a Day For 7 day";
    option2.textContent = "Once In a Day For 7 day";
    frequency.appendChild(option2);
    const option3 = document.createElement("option");
    option3.value = "Once In a Day and Continue";
    option3.textContent = "Once In a Day and Continue";
    frequency.appendChild(option3);
    const option4 = document.createElement("option");
    option4.value = "Once in a 7 day and Continue";
    option4.textContent = "Once in a 7 day and Continue";
    frequency.appendChild(option4);

    // Add the created option picker to the table row
    tableRow.appendChild(frequency);

    // Add a button to add medicine to prescription
    const addButton = document.createElement("button");
    addButton.textContent = "Add to Prescription";
    addButton.addEventListener("click", () => {
      // Get the selected option when the button is clicked
      const selectedFrequency = frequency.value;
      console.log("Add button clicked for medicine:", medicine, "with frequency:", selectedFrequency);
      // Add medicine to prescription
      addMedicineToPrescription(medicine, selectedFrequency);
    });
    tableRow.appendChild(addButton);
    table.appendChild(tableRow);
  });

  medicinesDiv.appendChild(table);
  //add a button for adding new medicine
  // const addNewMedicineButton = document.createElement("button");
  // addNewMedicineButton.textContent = "Add New Medicine";
  // addNewMedicineButton.addEventListener("click", () => {
  //   console.log("Add New Medicine button clicked");
  //   // Add medicine to prescription
  //   addNewMedicine(appointmentId);
  // });
  // medicinesDiv.appendChild(addNewMedicineButton);

};


//like medicine show all advices
const fetchAndDisplayAdvices = async () => {
  const adviceType = document.getElementById("advice").value;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      adviceType: adviceType,
    }),
  };

  try {
    const url = `http://localhost:3000/viewAdvices`;
    const response = await fetch(url, options);

    if (response.ok) {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const advices = await response.json();
        console.log(advices);
        // Display patient details on the prescription page
        //if length zero show alert
        //get the total row number

        //if response =''No advice found' then show alert
        if (advices.length === 0) {
          alert("No Advice Found");
          const advicesDiv = document.getElementById("advicesTable");
          advicesDiv.innerHTML = "";
          const addNewAdviceButton = document.createElement("button");
          addNewAdviceButton.textContent = "Add New Advice";
          addNewAdviceButton.addEventListener("click", () => {
            console.log("Add New Advice button clicked");
            // Add advice to prescription
            addNewAdvice(appointmentId);
          }
          );
          advicesDiv.appendChild(addNewAdviceButton);
          //add a button of add a new medicine

          return;
        }
        displayAdvices(advices);
      } else {
        console.error("Unexpected response format: Not JSON");
      }
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error(error);
  }
};
//add a button in each row to add advice to prescription
const displayAdvices = (advices) => {

  const advicesDiv = document.getElementById("advicesTable");
  advicesDiv.innerHTML = "";
  //add a header naming All Advices
  const header = document.createElement("h2");
  header.textContent = "All Advices";
  advicesDiv.appendChild(header);
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
  // Add table body rows
  advices.forEach((advice) => {
    const tableRow = document.createElement("tr");
    for (const key in advice) {
      const tableCell = document.createElement("td");
      tableCell.textContent = advice[key];
      tableRow.appendChild(tableCell);
    }
    // Add a button to add advice to prescription
    const addButton = document.createElement("button");
    addButton.textContent = "Add to Prescription";
    addButton.addEventListener("click", () => {
      console.log("Add button clicked for advice:", advice);
      // Add advice to prescription
      addAdviceToPrescription(advice);
    });
    tableRow.appendChild(addButton);
    table.appendChild(tableRow);
  });
  advicesDiv.appendChild(table);
  //add a button for adding new advice
  const addNewAdviceButton = document.createElement("button");
  addNewAdviceButton.textContent = "Add New Advice";
  addNewAdviceButton.addEventListener("click", () => {
    console.log("Add New Advice button clicked");
    // Add advice to prescription
    addNewAdvice(appointmentId);
  }
  );
  advicesDiv.appendChild(addNewAdviceButton);

};
//call multiple functions on page load
// window.onload = function () {
//   fetchAndDisplayMedicines();
//   fetchAndDisplayAdvices();
// };

//window.onload = 








//get prescription id
const getprescriptionID = async (appointmentId) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = `http://localhost:3000/getPrescriptionID/${appointmentId}`;
    const response = await fetch(url, options);

    if (response.ok) {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const prescriptionID = await response.json();
        console.log(prescriptionID);
        // Display patient details on the prescription page
        return prescriptionID;
      } else {
        console.error("Unexpected response format: Not JSON");
      }
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error(error);
  }
};

//add medicine to prescription
const addMedicineToPrescription = async (medicine, selectedFrequency) => {
  const prescriptionID = await getprescriptionID(appointmentId);
  const medicineData = {
    prescriptionId: prescriptionID.PRESCRIPTIONID,
    medicineId: medicine.MEDICINEID,
    frequency: selectedFrequency,
    // Add other fields as needed
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(medicineData),
  };

  try {
    const url = 'http://localhost:3000/insertMedicineIntoPrescription';
    const response = await fetch(url, options);

    if (response.ok) {
      console.log("Medicine inserted into prescription table");
      alert("Medicine was added to prescription");
    } else {
      console.error("Failed to insert medicine into prescription table:", response.status);
    }
  } catch (error) {
    console.error(error);
  }
};

//add advice to prescription
const addAdviceToPrescription = async (advice) => {
  const prescriptionID = await getprescriptionID(appointmentId);
  const adviceData = {
    prescriptionId: prescriptionID.PRESCRIPTIONID,
    adviceId: advice.ADVICEID,
    // Add other fields as needed
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(adviceData),
  };

  try {
    const url = 'http://localhost:3000/insertAdviceIntoPrescription';
    const response = await fetch(url, options);
    alert("Advice was added to prescription");

    if (response.ok) {
      console.log("Advice inserted into prescription table");
      alert("Advice was added to prescription");
    } else {
      console.error("Failed to insert advice into prescription table:", response.status);
    }
  } catch (error) {
    console.error(error);
  }
};

//add new medicine and insert into prescription
const addNewMedicine = async (appointmentId) => {
  //open a new HTML page to add new medicine with route parameter appointmentId
  window.location.href = `AddNewMedicineFromPrescription.html?appointmentId=${appointmentId}`;
};

//add new advice and insert into prescription
const addNewAdvice = async (appointmentId) => {
  //open a new HTML page to add new advice with route parameter appointmentId
  window.location.href = `AddNewAdviceFromPrescription.html?appointmentId=${appointmentId}`;
};











//see all avaible lab test and add to prescription button with them
const fetchAndDisplayLabTests = async () => {
  //get the lab test name
  const labTestName = document.getElementById("labTest").value;
  console.log(labTestName);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      labTestName: labTestName,
    }),
  };

  try {
    const url = `http://localhost:3000/viewLabTests`;
    const response = await fetch(url, options);

    if (response.ok) {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const labTests = await response.json();
        console.log(labTests);
        //if length zero show alert
        if (labTests.length === 0) {
          alert("No Lab Test Found");
          return;
        }
        // Display patient details on the prescription page
        displayLabTests(labTests);
      } else {
        console.error("Unexpected response format: Not JSON");
      }
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error(error);
  }
};
//add a button in each row to add lab test to prescription
const displayLabTests = (labTests) => {


  const labTestsDiv = document.getElementById("labTestsTable");
  labTestsDiv.innerHTML = "";
  //add a header naming All Lab Tests
  const header = document.createElement("h2");
  header.textContent = "All Lab Tests";
  labTestsDiv.appendChild(header);

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
  // Add table body rows
  labTests.forEach((labTest) => {
    const tableRow = document.createElement("tr");
    for (const key in labTest) {
      const tableCell = document.createElement("td");
      tableCell.textContent = labTest[key];
      tableRow.appendChild(tableCell);
    }
    // Add a button to add lab test to prescription
    const addButton = document.createElement("button");
    addButton.textContent = "Add to Prescription";
    addButton.addEventListener("click", () => {
      console.log("Add button clicked for lab test:", labTest);
      // Add lab test to prescription
      addLabTestToPrescription(labTest);
    });
    tableRow.appendChild(addButton);
    table.appendChild(tableRow);
  });
  labTestsDiv.appendChild(table);
  //add a button for adding new lab test
  // const addNewLabTestButton = document.createElement("button");
  // addNewLabTestButton.textContent = "Add New Lab Test";
  // addNewLabTestButton.addEventListener("click", () => {
  //   console.log("Add New Lab Test button clicked");
  //   // Add lab test to prescription
  //   addNewLabTest(appointmentId);
  // });
  // labTestsDiv.appendChild(addNewLabTestButton);
};
//add lab test to prescription
const addLabTestToPrescription = async (labTest) => {
  const prescriptionID = await getprescriptionID(appointmentId);
  const labTestData = {
    prescriptionId: prescriptionID.PRESCRIPTIONID,
    labTestId: labTest.LABTESTID,
    // Add other fields as needed
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(labTestData),
  };

  try {
    const url = 'http://localhost:3000/insertLabTestIntoPrescription';
    const response = await fetch(url, options);

    if (response.ok) {
      console.log("Lab Test inserted into prescription table");
      alert("Lab Test was added to prescription");
    } else {
      console.error("Failed to insert lab test into prescription table:", response.status);
    }
  } catch (error) {
    console.error(error);
  }
};
//add new lab test and insert into prescription
const addNewLabTest = async (appointmentId) => {
  //open a new HTML page to add new lab test with route parameter appointmentId
  window.location.href = `AddNewLabTestFromPrescription.html?appointmentId=${appointmentId}`;
};






//add doctor fee

const addDoctorFee = async () => {
  const prescriptionID = await getprescriptionID(appointmentId);
  const doctorFee = document.getElementById("doctorFee").value;
  const doctorFeeData = {
    prescriptionId: prescriptionID.PRESCRIPTIONID,
    doctorFee: doctorFee,
    // Add other fields as needed
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doctorFeeData),
  };

  try {
    const url = 'http://localhost:3000/insertDoctorFeeIntoPrescription';
    const response = await fetch(url, options);

    if (response.ok) {
      console.log("Doctor Fee inserted into prescription table");
      alert("Doctor Fee was added to prescription");
    } else {
      console.error("Failed to insert doctor fee into prescription table:", response.status);
    }
  } catch (error) {
    console.error(error);
  }
}