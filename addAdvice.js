
const addAdvice=async()=>{
    //get data from the form
   const adviceType=document.getElementById('adviceType').value;
   const adviceText=document.getElementById('adviceText').value;
    const adviceData = {
        adviceType: adviceType,
        adviceText: adviceText,
    };

    const options = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(adviceData),
    };

    try {
        const url = "http://localhost:3000/insertNewAdvice";
        const response = await fetch(url, options);

        if (response.ok) {
        const contentType = response.headers.get("content-type");
        alert("Advice added successfully");

        if (contentType && contentType.includes("application/json")) {
            const advice = await response.json();
            console.log(advice);
           
            // Display patient details on the prescription page
            
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