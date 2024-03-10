const urlParams = new URLSearchParams(window.location.search);
const appointmentId = urlParams.get('appointmentId');
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
  //add new advice to prescription

    const addNewAdvice=async()=>{
        const prescriptionID = await getprescriptionID(appointmentId);
        //get data from the form
       const adviceType=document.getElementById('adviceType').value;
       const adviceText=document.getElementById('adviceText').value;
        const adviceData = {
            adviceType: adviceType,
            adviceText: adviceText,
            prescriptionId: prescriptionID.PRESCRIPTIONID,
        };
    
        const options = {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(adviceData),
        };
    
        try {
            const url = "http://localhost:3000/insertNewAdviceFromPrescription";
            const response = await fetch(url, options);
    
            if (response.ok) {
            const contentType = response.headers.get("content-type");
            alert("Advice added successfully");
    
            if (contentType && contentType.includes("application/json")) {
                const advice = await response.json();
                console.log(advice);
               
                // Display patient details on the prescription page
                return advice;
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