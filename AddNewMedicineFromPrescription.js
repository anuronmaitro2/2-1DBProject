//get appointment id from the route params
const urlParams = new URLSearchParams(window.location.search);
const appointmentId = urlParams.get('appointmentId');
//convert it to number
const appointmentIdNum = parseInt(appointmentId);
  //get prescription id
  const getprescriptionID= async (appointmentId) => {
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
  //add new medicine to prescription
  const addNewMedicine=async()=>{
    const prescriptionID = await getprescriptionID(appointmentId);
   //get data from the form
    const medicineName=document.getElementById('medicineName').value;
    const genericName=document.getElementById('genericName').value;
    const dosage=document.getElementById('dosage').value;
    const manufacturer=document.getElementById('manufacturer').value;
    const sideEffects=document.getElementById('sideEffects').value;
    const medicineData = {
      medicineName: medicineName,
      genericName: genericName,
      dosage: dosage,
      manufacturer: manufacturer,
      sideEffects: sideEffects,
      prescriptionId: prescriptionID.PRESCRIPTIONID,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(medicineData),
    };

    try {
      const url = 'http://localhost:3000/insertNewMedicineIntoMedicineTableFromPrescription';
      const response = await fetch(url, options);
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const medicine = await response.json();
          console.log(medicine);
          alert("New medicine added successfully");
          // Display patient details on the prescription page
          return medicine;
        } else {
          console.error("Unexpected response format: Not JSON");
        }
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error(error);
    }

    
  }