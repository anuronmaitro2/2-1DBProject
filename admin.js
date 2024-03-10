
const viewPaidBillLogs=async()=>{
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = "http://localhost:3000/viewPaidBillLogs";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const paidBillLogs = await response.json();
      //show just 10 row at once
      
      displayPaidBillLogs(paidBillLogs);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const displayPaidBillLogs=(paidBillLogs)=>{
  const paidBillLogsDiv = document.getElementById('paidBillLogs');
  paidBillLogsDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in paidBillLogs[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  paidBillLogs.forEach((paidBillLog)=>{
    const row = document.createElement('tr');
    for(const key in paidBillLog){
      const td = document.createElement('td');
      td.textContent = paidBillLog[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  paidBillLogsDiv.appendChild(table);

}
const viewUnpaidBillLogs=async()=>{
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = "http://localhost:3000/viewUnpaidBillLogs";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const unpaidBillLogs = await response.json();
      displayUnpaidBillLogs(unpaidBillLogs);
    }
  }
  catch (error) {
    console.error(error);
  }
}

const displayUnpaidBillLogs=(unpaidBillLogs)=>{
  const unpaidBillLogsDiv = document.getElementById('unpaidBillLogs');
  unpaidBillLogsDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in unpaidBillLogs[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  unpaidBillLogs.forEach((unpaidBillLog)=>{
    const row = document.createElement('tr');
    for(const key in unpaidBillLog){
      const td = document.createElement('td');
      td.textContent = unpaidBillLog[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  unpaidBillLogsDiv.appendChild(table);

}
const showPaidUnpaidAmount=async()=>{
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = "http://localhost:3000/showPaidUnpaidAmount";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const paidUnpaidAmount = await response.json();
      displayPaidUnpaidAmount(paidUnpaidAmount);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const displayPaidUnpaidAmount=(paidUnpaidAmount)=>{
  const paidUnpaidAmountDiv = document.getElementById('paidUnpaidAmount');
  paidUnpaidAmountDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in paidUnpaidAmount[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  paidUnpaidAmount.forEach((paidUnpaidAmount)=>{
    const row = document.createElement('tr');
    for(const key in paidUnpaidAmount){
      const td = document.createElement('td');
      td.textContent = paidUnpaidAmount[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  paidUnpaidAmountDiv.appendChild(table);

}

///medicine usage
const showMedicineUsageLastMonth=async()=>{
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = "http://localhost:3000/showMedicineUsageLastMonth";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const medicineUsage = await response.json();
      //open in a new html page
      window.open('pieChartPage.html', '_blank');
     // displayMedicineUsage(medicineUsage);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const showMedicineUsageForThisMed=async()=>{
  const medicineName = document.getElementById("medicineName1").value;
  console.log(medicineName);
  const options = {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ medicineName: medicineName }),
  };
    console.log('the medicine name is')
   
  try {
    const url = "http://localhost:3000/showMedicineUsageForThisMed";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const medicineUsage = await response.json();
      displayMedicineUsage1(medicineUsage);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const displayMedicineUsage1=(medicineUsage)=>{
  const medicineUsageDiv = document.getElementById('medicineUsageTable1');
  medicineUsageDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in medicineUsage[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  medicineUsage.forEach((medicineUsage)=>{
    const row = document.createElement('tr');
    for(const key in medicineUsage){
      const td = document.createElement('td');
      td.textContent = medicineUsage[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  medicineUsageDiv.appendChild(table);

}

const displayMedicineUsage=(medicineUsage)=>{
  const medicineUsageDiv = document.getElementById('medicineUsageTable');
  medicineUsageDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in medicineUsage[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  medicineUsage.forEach((medicineUsage)=>{
    const row = document.createElement('tr');
    for(const key in medicineUsage){
      const td = document.createElement('td');
      td.textContent = medicineUsage[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  medicineUsageDiv.appendChild(table);

}


//show every doctor koyjon rogi dekse
const showDoctorsPatientCount=async()=>{
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = "http://localhost:3000/showDoctorsPatientCount";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      //open a new html page
      window.open('doctorPatientCount.html', '_blank');
      const doctorsPatientCount = await response.json();
      //displayDoctorsPatientCount(doctorsPatientCount);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const displayDoctorsPatientCount=(doctorsPatientCount)=>{
  const doctorsPatientCountDiv = document.getElementById('doctorPatientCountTable');
  doctorsPatientCountDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in doctorsPatientCount[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  doctorsPatientCount.forEach((doctorsPatientCount)=>{
    const row = document.createElement('tr');
    for(const key in doctorsPatientCount){
      const td = document.createElement('td');
      td.textContent = doctorsPatientCount[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  doctorsPatientCountDiv.appendChild(table);

}

//betweeen two dates
const showDoctorsPatientCountBetweenDates = async () => {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  console.log('the start date is');
  console.log(startDate);
  console.log('the end date is');
  console.log(endDate);
  /*
  // Check if start date and end date are not empty
  if (!startDate || !endDate) {
    console.error("Start date and end date are required.");
    return;
  }

  // Convert the date into 'yyyy-mm-dd' formatted string
  const endDateParts = endDate.split('/');
  const startDateParts = startDate.split('/');

  // Check if the array parts are available before accessing elements
  if (endDateParts.length !== 3 || startDateParts.length !== 3) {
    console.error("Invalid date format");
    return;
  }

  const endDateFormatted = endDateParts[2] + '-' + (endDateParts[0] || '').padStart(2, '0') + '-' + (endDateParts[1] || '').padStart(2, '0');
  const startDateFormatted = startDateParts[2] + '-' + (startDateParts[0] || '').padStart(2, '0') + '-' + (startDateParts[1] || '').padStart(2, '0');
*/
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ startDate: startDate, endDate: endDate }),
  };

  console.log('the start date is');
  console.log(startDate);
  console.log('the end date is');
  console.log(endDate);

  try {
    const url = "http://localhost:3000/showDoctorsPatientCountBetweenTwoDates";
    const response = await fetch(url, options);

    // Check if the response is ok
    if (response.ok) {
      const doctorsPatientCount = await response.json();
      displayDoctorsPatientCountBetweenDates(doctorsPatientCount);
    }
  } catch (error) {
    console.error(error);
  }
};

const  displayDoctorsPatientCountBetweenDates=(doctorsPatientCount)=>{
  const doctorsPatientCountDiv = document.getElementById('doctorPatientCountBetweenDatesTable');
  doctorsPatientCountDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in doctorsPatientCount[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  doctorsPatientCount.forEach((doctorsPatientCount)=>{
    const row = document.createElement('tr');
    for(const key in doctorsPatientCount){
      const td = document.createElement('td');
      td.textContent = doctorsPatientCount[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  doctorsPatientCountDiv.appendChild(table);

}

//show doctors who have not seen any patient
//show every doctors rank based on patient count
const showDoctorRankBasedOnPatientCount=async()=>{
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = "http://localhost:3000/showDoctorRankBasedOnPatientCount";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const doctorRank = await response.json();
      displayDoctorRank(doctorRank);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const displayDoctorRank=(doctorRank)=>{
  const doctorRankDiv = document.getElementById('doctorRankTable');
  doctorRankDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in doctorRank[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  doctorRank.forEach((doctorRank)=>{
    const row = document.createElement('tr');
    for(const key in doctorRank){
      const td = document.createElement('td');
      td.textContent = doctorRank[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  doctorRankDiv.appendChild(table);

}

const showPatientLabTestCost=async()=>{
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = "http://localhost:3000/showPatientLabTestCost";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const patientLabTestCost = await response.json();
      displayPatientLabTestCost(patientLabTestCost);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const displayPatientLabTestCost=(patientLabTestCost)=>{
  const patientLabTestCostDiv = document.getElementById('patientLabTestCostTable');
  patientLabTestCostDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in patientLabTestCost[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  patientLabTestCost.forEach((patientLabTestCost)=>{
    const row = document.createElement('tr');
    for(const key in patientLabTestCost){
      const td = document.createElement('td');
      td.textContent = patientLabTestCost[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  patientLabTestCostDiv.appendChild(table);

}

const showUnpaidLabTestCost=async()=>{
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = "http://localhost:3000/showUnpaidLabTestCost";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const unpaidLabTestCost = await response.json();
      displayUnpaidLabTestCost(unpaidLabTestCost);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const displayUnpaidLabTestCost=(unpaidLabTestCost)=>{
  const unpaidLabTestCostDiv = document.getElementById('unpaidLabTestCostTable');
  unpaidLabTestCostDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in unpaidLabTestCost[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  unpaidLabTestCost.forEach((unpaidLabTestCost)=>{
    const row = document.createElement('tr');
    for(const key in unpaidLabTestCost){
      const td = document.createElement('td');
      td.textContent = unpaidLabTestCost[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  unpaidLabTestCostDiv.appendChild(table);

}

const showPaidLabTestCost=async()=>{
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = "http://localhost:3000/showPaidLabTestCost";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const paidLabTestCost = await response.json();
      displayPaidLabTestCost(paidLabTestCost);
    }
  }
  catch (error) {
    console.error(error);
  }
}

const displayPaidLabTestCost=(paidLabTestCost)=>{
  const paidLabTestCostDiv = document.getElementById('paidLabTestCostTable');
  paidLabTestCostDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in paidLabTestCost[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  paidLabTestCost.forEach((paidLabTestCost)=>{
    const row = document.createElement('tr');
    for(const key in paidLabTestCost){
      const td = document.createElement('td');
      td.textContent = paidLabTestCost[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  paidLabTestCostDiv.appendChild(table);

}

const showPatientWithMultipleUnpaidBills=async()=>{
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = "http://localhost:3000/showPatientWithMultipleUnpaidBills";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const patientWithMultipleUnpaidBills = await response.json();
      displayPatientWithMultipleUnpaidBills(patientWithMultipleUnpaidBills);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const displayPatientWithMultipleUnpaidBills=(patientWithMultipleUnpaidBills)=>{
  const patientWithMultipleUnpaidBillsDiv = document.getElementById('patientWithMultipleUnpaidBillsTable');
  patientWithMultipleUnpaidBillsDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in patientWithMultipleUnpaidBills[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  patientWithMultipleUnpaidBills.forEach((patientWithMultipleUnpaidBills)=>{
    const row = document.createElement('tr');
    for(const key in patientWithMultipleUnpaidBills){
      const td = document.createElement('td');
      td.textContent = patientWithMultipleUnpaidBills[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  patientWithMultipleUnpaidBillsDiv.appendChild(table);

}

const showDayWiseAppointmentCount=async()=>{
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = "http://localhost:3000/showDayWiseAppointmentCount";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const dayWiseAppointmentCount = await response.json();
      //open in a new html page
      window.open('graphPage.html', '_blank');
       
      //displayDayWiseAppointmentCount(dayWiseAppointmentCount);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const displayDayWiseAppointmentCount=(dayWiseAppointmentCount)=>{
  const dayWiseAppointmentCountDiv = document.getElementById('dayWiseAppointmentCountTable');
  dayWiseAppointmentCountDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in dayWiseAppointmentCount[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  dayWiseAppointmentCount.forEach((dayWiseAppointmentCount)=>{
    const row = document.createElement('tr');
    for(const key in dayWiseAppointmentCount){
      const td = document.createElement('td');
      td.textContent = dayWiseAppointmentCount[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  dayWiseAppointmentCountDiv.appendChild(table);

}

const showDiseaseWithNoOfPatients=async()=>{
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = "http://localhost:3000/showDiseaseWithNoOfPatients";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const diseaseWithNoOfPatients = await response.json();
      displayDiseaseWithNoOfPatients(diseaseWithNoOfPatients);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const displayDiseaseWithNoOfPatients=(diseaseWithNoOfPatients)=>{
  const diseaseWithNoOfPatientsDiv = document.getElementById('diseaseWithNoOfPatientsTable');
  diseaseWithNoOfPatientsDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in diseaseWithNoOfPatients[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  diseaseWithNoOfPatients.forEach((diseaseWithNoOfPatients)=>{
    const row = document.createElement('tr');
    for(const key in diseaseWithNoOfPatients){
      const td = document.createElement('td');
      td.textContent = diseaseWithNoOfPatients[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  diseaseWithNoOfPatientsDiv.appendChild(table);

}


const showDoctorWhoHasnotPrescribed=async()=>{
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const url = "http://localhost:3000/showDoctorWhoHasnotPrescribed";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const doctorWhoHasnotPrescribed = await response.json();
      displayDoctorWhoHasnotPrescribed(doctorWhoHasnotPrescribed);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const displayDoctorWhoHasnotPrescribed=(doctorWhoHasnotPrescribed)=>{
  const doctorWhoHasnotPrescribedDiv = document.getElementById('doctorWhoHasnotPrescribedTable');
  doctorWhoHasnotPrescribedDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in doctorWhoHasnotPrescribed[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  doctorWhoHasnotPrescribed.forEach((doctorWhoHasnotPrescribed)=>{
    const row = document.createElement('tr');
    for(const key in doctorWhoHasnotPrescribed){
      const td = document.createElement('td');
      td.textContent = doctorWhoHasnotPrescribed[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  doctorWhoHasnotPrescribedDiv.appendChild(table);

}
  
const showHowManyTimesMedicinePrescribed=async()=>{
  const medicineName = document.getElementById("medicineName1").value;
  const options = {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ medicineName: medicineName }),
  };
    console.log('the medicine name is')
    console.log(medicineName);
  try {
    const url = "http://localhost:3000/showHowManyTimesMedicinePrescribed";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const medicinePrescribed = await response.json();
      displayMedicinePrescribed(medicinePrescribed);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const displayMedicinePrescribed=(medicinePrescribed)=>{
  const medicinePrescribedDiv = document.getElementById('medicinePrescribedTable');
  medicinePrescribedDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in medicinePrescribed[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  medicinePrescribed.forEach((medicinePrescribed)=>{
    const row = document.createElement('tr');
    for(const key in medicinePrescribed){
      const td = document.createElement('td');
      td.textContent = medicinePrescribed[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  medicinePrescribedDiv.appendChild(table);

}

const showHowManyTimesLabTestPrescribed=async()=>{
  const testName = document.getElementById("labTestName1").value;
  const options = {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ testName: testName }),
  };
    console.log('the test name is')
    console.log(testName);
  try {
    const url = "http://localhost:3000/showHowManyTimesLabTestPrescribed";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const labTestPrescribed = await response.json();
      displayLabTestPrescribed(labTestPrescribed);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const displayLabTestPrescribed=(labTestPrescribed)=>{
  const labTestPrescribedDiv = document.getElementById('labTestPrescribedTable');
  labTestPrescribedDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in labTestPrescribed[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  labTestPrescribed.forEach((labTestPrescribed)=>{
    const row = document.createElement('tr');
    for(const key in labTestPrescribed){
      const td = document.createElement('td');
      td.textContent = labTestPrescribed[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  labTestPrescribedDiv.appendChild(table);

}


//how many times a lab test has been completed
const showHowManyTimesALabTestHasBennConducted=async()=>{
  const testName = document.getElementById("labTestName2").value;
  const options = {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ testName: testName }),
  };
    console.log('the test name is')
    console.log(testName);
  try {
    const url = "http://localhost:3000/showHowManyTimesALabTestHasBennConducted";
    const response = await fetch(url, options);
    //check if the response is ok
    if (response.ok) {
      const labTestConducted = await response.json();
      displayLabTestConducted(labTestConducted);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const displayLabTestConducted=(labTestConducted)=>{
  const labTestConductedDiv = document.getElementById('labTestConductedTable');
  labTestConductedDiv.innerHTML = '';
  //create a table
  const table = document.createElement('table');
  //create a row
  const row = document.createElement('tr');
  //create headers
  for(const key in labTestConducted[0]){
    const th = document.createElement('th');
    th.textContent = key;
    row.appendChild(th);
  }
  table.appendChild(row);
  //add table row with data
  labTestConducted.forEach((labTestConducted)=>{
    const row = document.createElement('tr');
    for(const key in labTestConducted){
      const td = document.createElement('td');
      td.textContent = labTestConducted[key];
      row.appendChild(td);
    }
    table.appendChild(row);
  });
  labTestConductedDiv.appendChild(table);

}

//show doctor income
const showDoctorIncome=async()=>{
  //open a new html page
  window.open('doctorIncome.html', '_blank');
}