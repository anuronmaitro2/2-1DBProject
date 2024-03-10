const morgan = require('morgan');
const express = require('express');
const router = require('express-promise-router')();
const oracleDb = require('oracledb');
oracleDb.outFormat = oracleDb.OUT_FORMAT_OBJECT;
const cors = require('cors');

//create connection pool with oracle database
let connection = undefined;
async function db_query(query, params) {
    if (connection === undefined) {
        connection = await oracleDb.getConnection({
            user: "project",
            password: "123",
            connectString: "localhost:1521/ORCL"
        });
    }
    try {

        let result = await connection.execute(query, params, { autoCommit: true });
        return result.rows;
    }
    catch (err) {
        console.log(err);
        return undefined;
    }
}
const app = express();
app.use(cors());
app.options('*', cors());//enable pre-flight
app.use(express.json());
app.use(morgan('dev'));
app.use(router);


//register as a patient

router.post('/registerAsAPatient', async (req, res) => {
    const {
        firstName,
        lastName,
        dob,
        gender,
        contactNo,
        disease,
        address,
        username,
        password
    } = req.body;

    try {
        console.log(req.body);
        // Check if the username is unique
        const checkUsernameQuery = "SELECT COUNT(*) AS usernameCount FROM PATIENTPASSWORD WHERE USERNAME = :username";
        const usernameResult = await db_query(checkUsernameQuery, { username });
        console.log(usernameResult);
        console.log("username result");
        console.log(usernameResult[0].USERNAMECOUNT);
        if (usernameResult[0].USERNAMECOUNT > 0) {
            // Username is not unique
            return res.status(400).json({ error: 'Username is already taken. Please choose another one.' });
        }
        // Get the next value from the PATIENT_SEQ sequence
        const getNextPatientIdQuery = "SELECT PATIENT_SEQ.NEXTVAL AS NEXT_ID FROM DUAL";
        const nextPatientIdResult = await db_query(getNextPatientIdQuery, {});

        const patientId = nextPatientIdResult[0].NEXT_ID;
        console.log(patientId);

        // Insert patient details into PATIENT table
        const insertPatientQuery = "INSERT INTO PATIENT (PATIENT_ID, FIRSTNAME, LASTNAME, DOB, GENDER, CONTACT_NO, DISEASE, ADDRESS) " +
            "VALUES (:patientId, :firstName, :lastName, TO_DATE(:dob, 'YYYY-MM-DD'), :gender, :contactNo, :disease, :address)";
        const insertPatientParams = { patientId, firstName, lastName, dob, gender, contactNo, disease, address };

        await db_query(insertPatientQuery, insertPatientParams);

        // Insert username and password into PATIENTPASSWORD table
        const insertPasswordQuery = "INSERT INTO PATIENTPASSWORD (PATIENT_ID, USERNAME, PASSWORD) " +
            "VALUES (:patientId, :username, ORA_HASH(:password))";
        const insertPasswordParams = { patientId, username, password };

        await db_query(insertPasswordQuery, insertPasswordParams);

        res.status(200).json({ message: 'Patient registered successfully', patientId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




router.post('/loginAsAPatient/:patientId', async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    console.log(req.params.patientId);
    //convert into number
    const id1 = parseInt(req.params.patientId);
    console.log("converted id");
    console.log(id1);

    try {
        const query = "SELECT * FROM PATIENT WHERE PATIENT_ID = :id1";
        const params = { id1 };

        const result = await db_query(query, params);
        console.log(result);
        if (result.length === 0) {
            res.status(400).json({ error: 'Invalid Credentials' });
        } else {
            //send the result
            //send the patient table
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/loginAsAPatient', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Hash the password using ORA_HASH
      const hashedPassword = await db_query("SELECT ORA_HASH(:password) AS hashed_password FROM DUAL", { password });
      
      const query = "SELECT * FROM PATIENTPASSWORD WHERE USERNAME = :username AND PASSWORD = :hashedPassword";
      const params = { username, hashedPassword: hashedPassword[0].HASHED_PASSWORD };
  
      const result = await db_query(query, params);
  
      if (result.length === 0) {
        res.status(400).json({ error: 'Invalid Credentials' });
      } else {
        // Assuming the login is successful, now retrieve patient details
        const id1 = result[0].PATIENT_ID;
        const patientQuery = "SELECT * FROM PATIENT WHERE PATIENT_ID = :id1";
        const patientParams = { id1 };
  
        const patientResult = await db_query(patientQuery, patientParams);
  
        if (patientResult.length === 0) {
          res.status(400).json({ error: 'Patient not found' });
        } else {
          // Send the patient details
          res.status(200).json(patientResult);
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

//search a doctor
router.post('/searchDoctors', async (req, res) => {

    console.log(req.body);
    console.log(req.body.speciality);
    const speciality = req.body.speciality;

    try {
        const query = "SELECT D.DoctorId, D.FirstName, D.LastName, D.Contact_No, D.GENDER, D.EXPERIENCE, D.PAYMENT, DS.Speciality FROM DOCTOR D JOIN DOCTORSPECIALITY DS ON D.DoctorId = DS.DoctorId WHERE LOWER(DS.Speciality) LIKE :speciality";
        const params = { speciality: `%${speciality}%` };

        const result = await db_query(query, params);

        console.log(result);
        if (result.length === 0) {
            res.status(400).json({ error: 'Invalid Credentials' });
        } else {
            //send the result
            //send the patient table
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//login as a doctor
router.post('/loginAsADoctor/:doctorId', async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    console.log(req.params.doctorId);
    //convert into number
    const id1 = parseInt(req.params.doctorId);
    console.log("converted id");
    console.log(id1);

    try {
        const query = "SELECT * FROM DOCTOR WHERE DOCTORID = :id1";
        const params = { id1 };

        const result = await db_query(query, params);
        console.log(result);
        if (result.length === 0) {
            res.status(400).json({ error: 'Invalid Credentials' });
        } else {
            //send the result
            //send the patient table
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/loginAsADoctor', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the password using ORA_HASH
        const hashedPassword = await db_query("SELECT ORA_HASH(:password) AS hashed_password FROM DUAL", { password });

        const query = "SELECT * FROM DOCTORPASSWORD WHERE USERNAME = :username AND PASSWORD = :hashedPassword";
        const params = { username, hashedPassword: hashedPassword[0].HASHED_PASSWORD };

        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(400).json({ error: 'Invalid Credentials' });
        } else {
            // Assuming the login is successful, now retrieve doctor details
            const doctorId = result[0].DOCTORID;
            const doctorQuery = "SELECT * FROM DOCTOR WHERE DOCTORID = :doctorId";
            const doctorParams = { doctorId };

            const doctorResult = await db_query(doctorQuery, doctorParams);

            if (doctorResult.length === 0) {
                res.status(400).json({ error: 'Doctor not found' });
            } else {
                // Send the doctor details
                res.status(200).json(doctorResult);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//set appointment
// Set appointment endpoint
//MODIFICATION NEEDED ADD DISEASE NAME
router.post('/setAppointment', async (req, res) => {
    const { patientId, doctorId, notes } = req.body;

    try {
        //get patient disease
        const query1 = "SELECT DISEASE FROM PATIENT WHERE PATIENT_ID=:patientId";
        const params1 = { patientId };
        const result1 = await db_query(query1, params1);
        const disease = result1[0].DISEASE;
        console.log(disease);
        // Modify this query to include SYSDATE for the appointment date
        const query = `
        INSERT INTO APPOINTMENT (APPOINTMENTID,PATIENTID,DOCTORID,APPOINTMENTDATE,NOTES,PATIENTDISEASE) VALUES (SEQ_APPOINTMENT_ID.NEXTVAL, :patientId, :doctorId, SYSDATE, :notes,:disease)`;
        const params = { patientId, doctorId, notes,disease };

        // Execute the query
        await db_query(query, params);

        // Send a success response
        res.status(200).json({ message: 'Appointment set successfully!' });
    } catch (error) {
        console.error(error);
        // Send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//view appointment as a doctor
router.get('/viewAppointments/:doctorId', async (req, res) => {
    const { doctorId } = req.params;

    try {
        const query = `SELECT * FROM APPOINTMENT WHERE DOCTORID =:doctorId AND NOTES='PENDING'`;


        const params = { doctorId };

        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            // Send the result
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//approve appointment

// Approve appointment
router.put('/approveAppointment/:appointmentId', async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const query = `
        UPDATE APPOINTMENT
        SET NOTES = 'APPROVED'
        WHERE APPOINTMENTID = :appointmentId`;

        const params = { appointmentId };

        await db_query(query, params);

        res.status(200).json({ message: 'Appointment approved successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//discard appointment

router.put('/discardAppointment/:appointmentId', async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const query = `
        UPDATE APPOINTMENT
        SET NOTES = 'DISCARDED'
        WHERE APPOINTMENTID = :appointmentId`;

        const params = { appointmentId };

        await db_query(query, params);

        res.status(200).json({ message: 'Appointment discarded successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//see patient medicine under me
router.post('/viewPatientsMedicineUnderMe/:doctorId', async (req, res) => {
    const{patientId,doctorId}=req.body;
    console.log(patientId);
    console.log(doctorId);
    try {
        const query = "SELECT D.FIRSTNAME AS DOCTORNAME,PT.FIRSTNAME AS PATIENTNAME,A.APPOINTMENTID, A.PATIENTID,M.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDMEDICINE PRM ON PRM.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN ALLMEDICINEPRESCRIBERMEDICINERELATION ALPRM ON ALPRM.PRESCRIBEDMEDICINEID=PRM.PRESCRIBEDMEDICINEID JOIN MEDICINES M ON M.MEDICINEID=ALPRM.MEDICINEID WHERE D.DOCTORID=:doctorId AND PT.PATIENT_ID=:patientId AND M.MEDICINENAME IS NOT NULL ORDER BY A.APPOINTMENTID ";
        const params = { doctorId, patientId };

        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});
//see patient advice under me
router.post('/viewPatientsAdviceUnderMe/:doctorId', async (req, res) => {
    const{patientId,doctorId}=req.body;
    console.log(patientId);
    console.log(doctorId);
    try {
        const query = "SELECT D.FIRSTNAME AS DOCTORNAME,PT.FIRSTNAME AS PATIENTNAME,A.APPOINTMENTID, A.PATIENTID,ADV.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDADVICE PRA ON PRA.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN ADVICEPRESCRIBEDADVICERELATION ADR ON PRA.PRESCRIBEDADVICEID=ADR.PRESCRIBEDADVICEID JOIN ADVICES ADV ON ADV.ADVICEID=ADR.ADVICEID WHERE D.DOCTORID=:doctorId AND PT.PATIENT_ID=:patientId ORDER BY A.APPOINTMENTID";
        const params = { doctorId, patientId };

        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}
);
//see patient lab test under me
router.post('/viewPatientsLabTestUnderMe/:doctorId', async (req, res) => {
    const{patientId,doctorId}=req.body;
    console.log(patientId);
    console.log(doctorId);
    try {
        const query = "SELECT D.FIRSTNAME AS DOCTORNAME,PT.FIRSTNAME AS PATIENTNAME,A.APPOINTMENTID, A.PATIENTID,PRL.STATUS ,LT.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDLABTEST PRL ON PRL.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN PRESCRIBEDLABTESTALLLABTESTRELATION PRALL ON PRALL.PRESCRIBEDLABTESTID=PRL.PRESCRIBEDLABTESTID JOIN LABTESTS LT ON LT.LABTESTID=PRALL.LABTESTID WHERE D.DOCTORID=:doctorId AND PT.PATIENT_ID=:patientId ORDER BY A.APPOINTMENTID";
        const params = { doctorId, patientId };

        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}
);
//see patient lab test result under me
router.post('/viewPatientsLabTestResultUnderMe/:doctorId', async (req, res) => {
    const{patientId,doctorId}=req.body;
    console.log(patientId);
    console.log(doctorId);
    try {
        const query = "SELECT D.FIRSTNAME AS DOCTORNAME,PT.FIRSTNAME AS PATIENTNAME,A.APPOINTMENTID, A.PATIENTID,PRL.STATUS ,LT.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDLABTEST PRL ON PRL.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN PRESCRIBEDLABTESTALLLABTESTRELATION PRALL ON PRALL.PRESCRIBEDLABTESTID=PRL.PRESCRIBEDLABTESTID JOIN LABTESTS LT ON LT.LABTESTID=PRALL.LABTESTID WHERE D.DOCTORID=:doctorId AND PT.PATIENT_ID=:patientId AND PRL.STATUS='TEST COMPLETED' ORDER BY A.APPOINTMENTID";
        const params = { doctorId, patientId };

        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
}
);

//view prescription and patient details

router.get('/viewPatientDetails/:appointmentId', async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const query = "SELECT P.FIRSTNAME, P.DISEASE, P.GENDER,A.APPOINTMENTID " +
            "FROM APPOINTMENT A JOIN PATIENT P ON A.PATIENTID = P.PATIENT_ID " +
            "WHERE A.APPOINTMENTID = :appointmentId";
        const params = { appointmentId };

        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(404).json({ error: 'Patient details not found for the given appointment ID' });
        } else {
            res.status(200).json(result[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//insert prescription
//'/insertPrescription'
router.post('/insertPrescription', async (req, res) => {
    const { appointmentId, status } = req.body;

    try {
        const query = `
      INSERT INTO PRESCRIPTION(PRESCRIPTIONID,APPOINTMENTID,PRESCRIPTION_STATUS) VALUES (SEQ_PRESCRIPTION_ID.NEXTVAL, :appointmentId, :status)`;

        const params = { appointmentId, status };

        await db_query(query, params);

        res.status(200).json({ message: 'Patient details inserted into prescription table' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//showing all medicines
router.post('/viewMedicines', async (req, res) => {
    try {
        const query = "SELECT * FROM MEDICINES  wHERE LOWER(MEDICINENAME)LIKE :medicineName";
        const { medcineName } = req.body;
        const params = { medicineName: `%${medcineName}%` };
        console.log(params);

        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//get priscription id of appointment id
router.get('/getPrescriptionID/:appointmentId', async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const query = `SELECT PRESCRIPTIONID FROM PRESCRIPTION WHERE APPOINTMENTID=:appointmentId`;

        const params = { appointmentId };

        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(404).json({ error: 'Prescription ID not found for the given appointment ID' });
        } else {
            res.status(200).json(result[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//adding medicine to prescription
router.post('/insertMedicineIntoPrescription', async (req, res) => {
    //const { prescriptionIdt, medicineIdt } = req.body;
    //convert into number
    const prescriptionId1 = parseInt(req.body.prescriptionId);
    const medicineId1 = parseInt(req.body.medicineId);
    const frequency=req.body.frequency;
    let prescriptionId = prescriptionId1;
    let medicineId = medicineId1;
    console.log("converted id")

    try {
        //const query1 = `INSERT INTO PRESCRIBEDMEDICINE(PRESCRIBEDMEDICINEID,PRESCRIPTIONID) VALUES (SEQ_PRESCRIBEDMEDICINE_ID.NEXTVAL, :prescriptionId)`;
        const sequencequery = `SELECT SEQ_PRESCRIBEDMEDICINE_ID.NEXTVAL FROM DUAL`;
        const result1 = await db_query(sequencequery, {});
        const prescribedmedicineid = result1[0].NEXTVAL;
        console.log(prescribedmedicineid);
        const query1 = `INSERT INTO PRESCRIBEDMEDICINE(PRESCRIBEDMEDICINEID,PRESCRIPTIONID,HOWTOTAKE) VALUES (:prescribedmedicineid,:prescriptionId,:frequency)`;
        const params1 = { prescribedmedicineid, prescriptionId,frequency};
        const result2 = await db_query(query1, params1);
        console.log(result2);
        console.log("prescribedmedicineid inserted into prescribedmedicine table");
        const query2 = `INSERT INTO ALLMEDICINEPRESCRIBERMEDICINERELATION(PRESCRIBEDMEDICINEID,MEDICINEID) VALUES (:prescribedmedicineid,:medicineId)`;
        const params2 = { prescribedmedicineid, medicineId };
        const result3 = await db_query(query2, params2);
        console.log(result3);
        console.log("medicineId and prescribedmedicineid inserted into relation table");





        res.status(200).json({ message: 'Medicine added to prescription' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

///inserting new medicine into medicine table with prescription id
router.post('/insertNewMedicineIntoMedicineTableFromPrescription', async (req, res) => {
    const { medicineName, genericName, dosage, manufacturer, sideEffects, prescriptionId } = req.body;
    console.log(req.body);
    //get the medicineID from the sequence
    const sequencequery = `SELECT SEQ_MEDICINE_ID.NEXTVAL FROM DUAL`;
    const result1 = await db_query(sequencequery, {});
    const medicineid = result1[0].NEXTVAL;
    console.log("medicine id");
    console.log(medicineid);
    //get prescribemedicineid from sequence
    const sequencequery1 = `SELECT SEQ_PRESCRIBEDMEDICINE_ID.NEXTVAL FROM DUAL`;
    const result2 = await db_query(sequencequery1, {});
    const prescribedmedicineid = result2[0].NEXTVAL;
    console.log("prescribedmedicineid");
    console.log(prescribedmedicineid);

    try {
        const query = `INSERT INTO ALLMEDICINE(MEDICINEID,MEDICINENAME,GENERICNAME,DOSAGES,MANUFACTURER,SIDEEFFECTS) VALUES (:medicineid, :medicineName, :genericName, :dosage, :manufacturer, :sideEffects)`;

        const params = { medicineid, medicineName, genericName, dosage, manufacturer, sideEffects };


        await db_query(query, params);
        console.log("medicine inserted into medicine table");

        const query1 = `INSERT INTO PRESCRIBEDMEDICINE(PRESCRIBEDMEDICINEID,PRESCRIPTIONID) VALUES (:prescribedmedicineid,:prescriptionId)`;
        const params1 = { prescribedmedicineid, prescriptionId };

        await db_query(query1, params1);
        console.log("prescribedmedicineid inserted into prescribedmedicine table");

        const query2 = `INSERT INTO ALLMEDICINEPRESCRIBERMEDICINERELATION(PRESCRIBEDMEDICINEID,MEDICINEID) VALUES (:prescribedmedicineid,:medicineId)`;
        const params2 = { prescribedmedicineid, medicineid };


        await db_query(query2, params2);
        console.log("medicineid and prescribedmedicineid inserted into relation table");

        res.status(200).json({ message: 'Medicine inserted into medicine table with prescription id' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);




//view all advice
router.post('/viewAdvices', async (req, res) => {
    try {
        const query = "SELECT * FROM ADVICES WHERE LOWER(ADVICETYPE)LIKE :adviceType";
        const { adviceType } = req.body;
        const params = { adviceType: `%${adviceType}%` };
        console.log(params);
        //execute the query
        const result = await db_query(query, params);


        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});
//insert advice into prescription
router.post('/insertAdviceIntoPrescription', async (req, res) => {
    //const { prescriptionIdt, medicineIdt } = req.body;
    //convert into number
    const prescriptionId1 = parseInt(req.body.prescriptionId);
    const adviceId1 = parseInt(req.body.adviceId);
    let prescriptionId = prescriptionId1;
    let adviceId = adviceId1;
    console.log("converted id");

    try {
        //const query1 = `INSERT INTO PRESCRIBEDMEDICINE(PRESCRIBEDMEDICINEID,PRESCRIPTIONID) VALUES (SEQ_PRESCRIBEDMEDICINE_ID.NEXTVAL, :prescriptionId)`;
        const sequencequery = `SELECT SEQ_PRESCRIBEDADVICE_ID.NEXTVAL FROM DUAL`;
        const result1 = await db_query(sequencequery, {});
        const prescribedadviceid = result1[0].NEXTVAL;
        console.log(prescribedadviceid);
        const query1 = `INSERT INTO PRESCRIBEDADVICE(PRESCRIBEDADVICEID,PRESCRIPTIONID) VALUES (:prescribedadviceid,:prescriptionId)`;
        const params1 = { prescribedadviceid, prescriptionId };
        const result2 = await db_query(query1, params1);
        console.log(result2);
        const query2 = `INSERT INTO ADVICEPRESCRIBEDADVICERELATION(PRESCRIBEDADVICEID,ADVICEID) VALUES (:prescribedadviceid,:adviceId)`;
        const params2 = { prescribedadviceid, adviceId };
        const result3 = await db_query(query2, params2);
        console.log(result3);
        //send response
        res.status(200).json({ message: 'Advice inserted into prescription' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
//inserting new advice into advice table with prescription id
router.post('/insertNewAdviceFromPrescription', async (req, res) => {
    const { adviceType, adviceText, prescriptionId } = req.body;
    console.log(req.body);
    //get the adviceID from the sequence
    const sequencequery = `SELECT SEQ_ADVICE_ID.NEXTVAL FROM DUAL`;
    const result1 = await db_query(sequencequery, {});
    const adviceid = result1[0].NEXTVAL;
    console.log("advice id");
    console.log(adviceid);
    //get prescribemedicineid from sequence
    const sequencequery1 = `SELECT SEQ_PRESCRIBEDADVICE_ID.NEXTVAL FROM DUAL`;
    const result2 = await db_query(sequencequery1, {});
    const prescribedadviceid = result2[0].NEXTVAL;
    console.log("prescribedadviceid");
    console.log(prescribedadviceid);

    try {
        const query = `INSERT INTO ADVICES(ADVICEID,ADVICETYPE,ADVICETEXT) VALUES (:adviceid, :adviceType, :adviceText)`;
        const params = { adviceid, adviceType, adviceText };
        const result = await db_query(query, params);
        console.log(result);
        console.log("advice inserted into advice table");
        const query1 = `INSERT INTO PRESCRIBEDADVICE(PRESCRIBEDADVICEID,PRESCRIPTIONID) VALUES (:prescribedadviceid,:prescriptionId)`;
        const params1 = { prescribedadviceid, prescriptionId };
        const result2 = await db_query(query1, params1);
        console.log(result2);
        console.log("prescribedadviceid inserted into prescribedadvice table");
        const query2 = `INSERT INTO ADVICEPRESCRIBEDADVICERELATION(PRESCRIBEDADVICEID,ADVICEID) VALUES (:prescribedadviceid,:adviceId)`;
        const params2 = { prescribedadviceid, adviceid };
        const result3 = await db_query(query2, params2);
        console.log(result3);
        console.log("adviceid and prescribedadviceid inserted into relation table");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
//VIEW LAB TESTS
router.post('/viewLabTests', async (req, res) => {
    try {
        const query = "SELECT * FROM LABTESTS  wHERE LOWER(TESTNAME)LIKE :labTestName";

        const { labTestName } = req.body;
        const params = { labTestName: `%${labTestName}%` };
        console.log(params);
        //execute the query
        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

//insert lab test into prescription
router.post('/insertLabTestIntoPrescription', async (req, res) => {
    //const { prescriptionIdt, medicineIdt } = req.body;
    //convert into number
    const prescriptionId1 = parseInt(req.body.prescriptionId);
    const labTestId1 = parseInt(req.body.labTestId);
    let prescriptionId = prescriptionId1;
    let labTestId = labTestId1;
    console.log("converted id");

    try {
        //const query1 = `INSERT INTO PRESCRIBEDMEDICINE(PRESCRIBEDMEDICINEID,PRESCRIPTIONID) VALUES (SEQ_PRESCRIBEDMEDICINE_ID.NEXTVAL, :prescriptionId)`;
        const sequencequery = `SELECT SEQ_PRESCRIBEDLABTEST_ID.NEXTVAL FROM DUAL`;
        const result1 = await db_query(sequencequery, {});
        const prescribedlabtestid = result1[0].NEXTVAL;
        console.log(prescribedlabtestid);
        const query1 = `INSERT INTO PRESCRIBEDLABTEST(PRESCRIBEDLABTESTID,PRESCRIPTIONID) VALUES (:prescribedlabtestid,:prescriptionId)`;
        const params1 = { prescribedlabtestid, prescriptionId };
        const result2 = await db_query(query1, params1);
        console.log(result2);
        console.log("prescribedlabtestid inserted into prescribedlabtest table");
        const query2 = `INSERT INTO PRESCRIBEDLABTESTALLLABTESTRELATION(PRESCRIBEDLABTESTID,LABTESTID) VALUES (:prescribedlabtestid,:labTestId)`;
        const params2 = { prescribedlabtestid, labTestId };
        const result3 = await db_query(query2, params2);
        console.log(result3);
        console.log("labTestId and prescribedlabtestid inserted into relation table");
        //send response
        res.status(200).json({ message: 'Lab test inserted into prescription' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
//inserting new lab test into lab test table with prescription id
router.post('/insertNewLabTestFromPrescription', async (req, res) => {
    const { testName, description, prescriptionId } = req.body;
    console.log(req.body);
    //get the labtestID from the sequence
    const sequencequery = `SELECT SEQ_LABTEST_ID.NEXTVAL FROM DUAL`;
    const result1 = await db_query(sequencequery, {});
    const labtestid = result1[0].NEXTVAL;
    console.log("labtest id");
    console.log(labtestid);
    //get prescribelabtestid from sequence
    const sequencequery1 = `SELECT SEQ_PRESCRIBEDLABTEST_ID.NEXTVAL FROM DUAL`;
    const result2 = await db_query(sequencequery1, {});
    const prescribedlabtestid = result2[0].NEXTVAL;
    console.log("prescribedlabtestid");
    console.log(prescribedlabtestid);

    try {
        const query = `INSERT INTO ALLLABTEST(LABTESTID,TESTNAME,DESCRIPTION) VALUES (:labtestid, :testName, :description)`;
        const params = { labtestid, testName, description };
        const result = await db_query(query, params);
        console.log(result);
        console.log("labtest inserted into labtest table");
        const query1 = `INSERT INTO PRESCRIBEDLABTEST(PRESCRIBEDLABTESTID,PRESCRIPTIONID) VALUES (:prescribedlabtestid,:prescriptionId)`;
        const params1 = { prescribedlabtestid, prescriptionId };
        const result2 = await db_query(query1, params1);
        console.log(result2);
        console.log("prescribedlabtestid inserted into prescribedlabtest table");
        const query2 = `INSERT INTO PRESCRIBEDLABTESTALLLABTESTRELATION(PRESCRIBEDLABTESTID,LABTESTID) VALUES (:prescribedlabtestid,:labTestId)`;
        const params2 = { prescribedlabtestid, labtestid };
        const result3 = await db_query(query2, params2);
        console.log(result3);
        console.log("labtestid and prescribedlabtestid inserted into relation table");

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//add medicine
router.post('/addMedicine', async (req, res) => {
    const { medicineName, genericName, dosage, manufacturer, sideEffects } = req.body;
    console.log(req.body);

    try {
        const query = "INSERT INTO MEDICINES (MEDICINEID, MEDICINENAME, GENERICNAME, DOSAGES, MANUFACTURER, SIDEEFFECTS) " +
            "VALUES (SEQ_MEDICINE_ID.NEXTVAL, :medicineName, :genericName, :dosage, :manufacturer, :sideEffects)";
        const params = { medicineName, genericName, dosage, manufacturer, sideEffects };
        //execute the query
        await db_query(query, params);
        console.log("medicine inserted into medicine table");

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//add lab test
router.post('/addLabTest', async (req, res) => {
    const { testName, description } = req.body;
    console.log(req.body);

    try {
        const query = "INSERT INTO LABTESTS (LABTESTID, TESTNAME, DESCRIPTION) " +
            "VALUES (SEQ_LABTEST_ID.NEXTVAL, :testName, :description)";
        const params = { testName, description };
        //execute the query
        await db_query(query, params);
        console.log("lab test inserted into lab test table");

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//view patient medicine under a doctor
router.post('/viewPatientsMedicine/:doctorId', async (req, res) => {
    //const { doctorId } = req.params;
    let { patientName, doctorId } = req.body;
    console.log(patientName);
    console.log(doctorId);


    try {
        const query = "SELECT D.FIRSTNAME AS DOCTORNAME,PT.FIRSTNAME AS PATIENTNAME,A.APPOINTMENTID, A.PATIENTID,M.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDMEDICINE PRM ON PRM.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN ALLMEDICINEPRESCRIBERMEDICINERELATION ALPRM ON ALPRM.PRESCRIBEDMEDICINEID=PRM.PRESCRIBEDMEDICINEID JOIN MEDICINES M ON M.MEDICINEID=ALPRM.MEDICINEID WHERE LOWER(PT.FIRSTNAME) LIKE :patientName AND D.DOCTORID=:doctorId AND M.MEDICINENAME IS NOT NULL ORDER BY A.APPOINTMENTID ";
        patientName = patientName.toLowerCase();
        patientName = patientName.trim();
        patientName = `%${patientName}%`;
        console.log("In query");
        console.log(patientName);
        console.log(doctorId);
        const params = { patientName, doctorId };

        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});
//show taken advices under a doctor
router.post('/viewPatientsAdvice/:doctorId', async (req, res) => {
    //const { doctorId } = req.params;
    let { patientName, doctorId } = req.body;
    console.log(patientName);
    console.log(doctorId);


    try {
        const query = "SELECT D.FIRSTNAME AS DOCTORNAME,PT.FIRSTNAME AS PATIENTNAME,A.APPOINTMENTID, A.PATIENTID,ADV.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDADVICE PRA ON PRA.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN ADVICEPRESCRIBEDADVICERELATION ADR ON PRA.PRESCRIBEDADVICEID=ADR.PRESCRIBEDADVICEID JOIN ADVICES ADV ON ADV.ADVICEID=ADR.ADVICEID WHERE LOWER(PT.FIRSTNAME) LIKE :patientName AND D.DOCTORID=:doctorId ORDER BY A.APPOINTMENTID";
        patientName = patientName.toLowerCase();
        patientName = patientName.trim();
        patientName = `%${patientName}%`;
        console.log("In query");
        console.log(patientName);
        console.log(doctorId);
        const params = { patientName, doctorId };

        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

//show taken lab tests under a doctor
router.post('/viewPatientsLabTest/:doctorId', async (req, res) => {
    //const { doctorId } = req.params;
    let { patientName, doctorId } = req.body;
    console.log(patientName);
    console.log(doctorId);
    try {
        const query = "SELECT D.FIRSTNAME AS DOCTORNAME,PT.FIRSTNAME AS PATIENTNAME,A.APPOINTMENTID, A.PATIENTID,PRL.STATUS ,LT.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDLABTEST PRL ON PRL.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN PRESCRIBEDLABTESTALLLABTESTRELATION PRALL ON PRALL.PRESCRIBEDLABTESTID=PRL.PRESCRIBEDLABTESTID JOIN LABTESTS LT ON LT.LABTESTID=PRALL.LABTESTID WHERE LOWER(PT.FIRSTNAME) LIKE :patientName  AND D.DOCTORID=:doctorId ORDER BY A.APPOINTMENTID";
        patientName = patientName.toLowerCase();
        patientName = patientName.trim();
        patientName = `%${patientName}%`;
        console.log("In query");
        console.log(patientName);
        console.log(doctorId);
        const params = { patientName, doctorId };

        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});
//view lab test result under a doctor
router.post('/viewPatientsLabTestResult/:doctorId', async (req, res) => {
    //const { doctorId } = req.params;
    let { patientName, doctorId } = req.body;
    console.log(patientName);
    console.log(doctorId);
    console.log(doctorId);
    try {
        const query = "SELECT D.FIRSTNAME AS DOCTORNAME,PT.FIRSTNAME AS PATIENTNAME,A.APPOINTMENTID, A.PATIENTID,PRL.STATUS AS TESTSTATUS ,LT.*,R.RESULTDETAILS,R.RESULTDATE FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDLABTEST PRL ON PRL.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN PRESCRIBEDLABTESTALLLABTESTRELATION PRALL ON PRALL.PRESCRIBEDLABTESTID=PRL.PRESCRIBEDLABTESTID JOIN LABTESTS LT ON LT.LABTESTID=PRALL.LABTESTID JOIN RESULT R ON R.PRESCRIBEDLABTESTID=PRL.PRESCRIBEDLABTESTID WHERE PRL.STATUS='TEST COMPLETED' AND LOWER(PT.FIRSTNAME) LIKE :patientName AND D.DOCTORID=:doctorId ORDER BY A.APPOINTMENTID";
        patientName = patientName.toLowerCase();
        patientName = patientName.trim();
        patientName = `%${patientName}%`;
        console.log("In query");
        console.log(patientName);
        console.log(doctorId);
        const params = { patientName, doctorId };

        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

//show taken medicines under a doctor on a particular appointment
router.post('/viewPatientsMedicineOnaGivenAppointment/:doctorId', async (req, res) => {
    //const { doctorId } = req.params;
    let { patientName, doctorId, appointmentId } = req.body;
    console.log(patientName);
    console.log(doctorId);
    console.log(appointmentId);
    try {
        const query = "SELECT D.FIRSTNAME AS DOCTORNAME,PT.FIRSTNAME AS PATIENTNAME,A.APPOINTMENTID, A.PATIENTID,M.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDMEDICINE PRM ON PRM.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN ALLMEDICINEPRESCRIBERMEDICINERELATION ALPRM ON ALPRM.PRESCRIBEDMEDICINEID=PRM.PRESCRIBEDMEDICINEID JOIN MEDICINES M ON M.MEDICINEID=ALPRM.MEDICINEID WHERE LOWER(PT.FIRSTNAME) LIKE :patientName AND D.DOCTORID=:doctorId AND A.APPOINTMENTID=:appointmentId AND M.MEDICINENAME IS NOT NULL ORDER BY A.APPOINTMENTID ";
        patientName = patientName.toLowerCase();
        patientName = patientName.trim();
        patientName = `%${patientName}%`;
        console.log("In query");

        console.log(patientName);
        console.log(doctorId);
        console.log(appointmentId);
        const params = { patientName, doctorId, appointmentId };
        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});


//show taken advices under a doctor on a particular appointment
router.post('/viewPatientsAdviceOnaGivenAppointment/:doctorId', async (req, res) => {
    //const { doctorId } = req.params;
    let { patientName, doctorId, appointmentId } = req.body;
    console.log(patientName);
    console.log(doctorId);
    console.log(appointmentId);

    try {
        const query = "SELECT D.FIRSTNAME AS DOCTORNAME,PT.FIRSTNAME AS PATIENTNAME,A.APPOINTMENTID, A.PATIENTID,ADV.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDADVICE PRA ON PRA.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN ADVICEPRESCRIBEDADVICERELATION ADR ON PRA.PRESCRIBEDADVICEID=ADR.PRESCRIBEDADVICEID JOIN ADVICES ADV ON ADV.ADVICEID=ADR.ADVICEID WHERE LOWER(PT.FIRSTNAME) LIKE :patientName AND D.DOCTORID=:doctorId AND A.APPOINTMENTID=:appointmentId ORDER BY A.APPOINTMENTID";
        patientName = patientName.toLowerCase();
        patientName = patientName.trim();
        patientName = `%${patientName}%`;
        console.log("In query");

        console.log(patientName);
        console.log(doctorId);
        console.log(appointmentId);
        const params = { patientName, doctorId, appointmentId };
        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

//show taken lab tests under a doctor on a particular appointment
router.post('/viewPatientsLabTestOnaGivenAppointment/:doctorId', async (req, res) => {
    //const { doctorId } = req.params;
    let { patientName, doctorId, appointmentId } = req.body;
    console.log(patientName);
    console.log(doctorId);
    console.log(appointmentId);
    try {
        const query = "SELECT D.FIRSTNAME AS DOCTORNAME,PT.FIRSTNAME AS PATIENTNAME,A.APPOINTMENTID, A.PATIENTID,PRL.STATUS ,LT.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDLABTEST PRL ON PRL.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN PRESCRIBEDLABTESTALLLABTESTRELATION PRALL ON PRALL.PRESCRIBEDLABTESTID=PRL.PRESCRIBEDLABTESTID JOIN LABTESTS LT ON LT.LABTESTID=PRALL.LABTESTID WHERE LOWER(PT.FIRSTNAME) LIKE :patientName  AND D.DOCTORID=:doctorId AND A.APPOINTMENTID=:appointmentId ORDER BY A.APPOINTMENTID";
        patientName = patientName.toLowerCase();
        patientName = patientName.trim();
        patientName = `%${patientName}%`;
        console.log("In query");
        console.log(patientName);
        console.log(doctorId);
        console.log(appointmentId);
        const params = { patientName, doctorId, appointmentId };
        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

//show taken lab test result under a doctor on a particular appointment
router.post('/viewPatientsLabTestResultOnaGivenAppointment/:doctorId', async (req, res) => {
    //const { doctorId } = req.params;
    let { patientName, doctorId, appointmentId } = req.body;
    console.log(patientName);
    console.log(doctorId);
    console.log(appointmentId);
    try {
        const query = "SELECT D.FIRSTNAME AS DOCTORNAME,PT.FIRSTNAME AS PATIENTNAME,A.APPOINTMENTID, A.PATIENTID,PRL.STATUS AS TESTSTATUS ,LT.*,R.RESULTDETAILS,R.RESULTDATE FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDLABTEST PRL ON PRL.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN PRESCRIBEDLABTESTALLLABTESTRELATION PRALL ON PRALL.PRESCRIBEDLABTESTID=PRL.PRESCRIBEDLABTESTID JOIN LABTESTS LT ON LT.LABTESTID=PRALL.LABTESTID JOIN RESULT R ON R.PRESCRIBEDLABTESTID=PRL.PRESCRIBEDLABTESTID WHERE PRL.STATUS='TEST COMPLETED' AND LOWER(PT.FIRSTNAME) LIKE :patientName AND D.DOCTORID=:doctorId AND A.APPOINTMENTID=:appointmentId ORDER BY A.APPOINTMENTID";
        patientName = patientName.toLowerCase();
        patientName = patientName.trim();
        patientName = `%${patientName}%`;
        console.log("In query");
        console.log(patientName);
        console.log(doctorId);
        console.log(appointmentId);
        const params = { patientName, doctorId, appointmentId };
        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});




//inserting doctor fee into prescription
router.post('/insertDoctorFeeIntoPrescription', async (req, res) => {
    //const { prescriptionIdt, medicineIdt } = req.body;
    //convert into number
    const prescriptionId1 = parseInt(req.body.prescriptionId);
    const doctorFee1 = parseInt(req.body.doctorFee);
    let prescriptionId = prescriptionId1;
    let doctorFee = doctorFee1;
    console.log("converted id");

    try {
        const sequencequery = `SELECT SEQ_DOCTORBILL_ID.NEXTVAL FROM DUAL`;
        const result1 = await db_query(sequencequery, {});
        const doctorbillid = result1[0].NEXTVAL;
        console.log(doctorbillid);
        const query1 = `INSERT INTO DOCTORBILL(DOCTORBILLID,PRESCRIPTIONID,DOCTORCOST) VALUES (:doctorbillid,:prescriptionId,:doctorFee)`;
        const params1 = { doctorbillid, prescriptionId, doctorFee };
        const result2 = await db_query(query1, params1);
        console.log(result2);
        console.log("doctorbillid inserted into doctorbill table");
        const sequencequery1 = `SELECT SEQ_BILLID.NEXTVAL FROM DUAL`;
        const result3 = await db_query(sequencequery1, {});
        const billid = result3[0].NEXTVAL;
        console.log(billid);
        const query2 = `INSERT INTO BILL(BILLID,PRESCRIPTIONID) VALUES (:billid,:prescriptionId)`;
        const params2 = { billid, prescriptionId };
        const result4 = await db_query(query2, params2);
        console.log(result4);
        //send response
        res.status(200).json({ message: 'Doctor fee inserted into prescription' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see pending lab test
router.post('/seePendingLabTests', async (req, res) => {

    //convert into number
    const appointmentId1 = parseInt(req.body.appointmentId);
    let appointmentId = appointmentId1;


    try {
        const query = "SELECT A.PATIENTID, A.APPOINTMENTID,LB.LABTESTID,LB.TESTNAME,LB.DESCRIPTION,PRT.STATUS,PRT.PRESCRIBEDLABTESTID,PRT.PRESCRIPTIONID FROM APPOINTMENT A JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDLABTEST PRT ON P.PRESCRIPTIONID=PRT.PRESCRIPTIONID JOIN PRESCRIBEDLABTESTALLLABTESTRELATION PRALL ON PRALL.PRESCRIBEDLABTESTID=PRT.PRESCRIBEDLABTESTID JOIN LABTESTS LB ON LB.LABTESTID=PRALL.LABTESTID WHERE A.APPOINTMENTID=:appointmentId AND PRT.STATUS='TEST PENDING'";
        const params = { appointmentId };

        const result = await db_query(query, params);

        if (result.length === 0) {
            res.status(200).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

//conduct lab test
router.post('/conductLabTest', async (req, res) => {
    //const { prescriptionIdt, medicineIdt } = req.body;
    //convert into number
    const { result, cost, labTest } = req.body;
    console.log('lab test result');
    console.log(result);
    console.log('lab test cost');
    console.log(cost);
    console.log('lab test object');
    console.log(labTest);
    //get PRESCRIBEDLABTESTID,PATIENTID,LABTESTID,PRESCRIPTIONID from lab test
    //get these from lab test object
    const prescribedlabtestid = labTest.PRESCRIBEDLABTESTID;
    const patientid = labTest.PATIENTID;
    const labtestid = labTest.LABTESTID;
    const prescriptionid = labTest.PRESCRIPTIONID;
    console.log(prescribedlabtestid);
    console.log(patientid);
    console.log(labtestid);
    console.log(prescriptionid);
    //cobvert cost into number
    const cost1 = parseInt(cost);



    try {
        const sequencequery = `SELECT LABBILL_ID.NEXTVAL FROM DUAL`;
        const result1 = await db_query(sequencequery, {});
        const labbillid = result1[0].NEXTVAL;
        console.log(labbillid);
        const sequencequery1 = `SELECT RESULT_ID.NEXTVAL FROM DUAL`;
        const result2 = await db_query(sequencequery1, {});
        const resultid = result2[0].NEXTVAL;
        console.log(resultid);
        const query1 = `INSERT INTO LABBILL(LABBILLID,PRESCRIPTIONID,LABTESTID,COST) VALUES (:labbillid,:prescriptionid,:labtestid,:cost1)`;
        const params1 = { labbillid, prescriptionid, labtestid, cost1 };
        const result3 = await db_query(query1, params1);
        console.log(result3);
        console.log("labbillid inserted into labbill table");
        const query2 = `INSERT INTO RESULT (RESULTID,PATIENTID,RESULTDETAILS,PRESCRIBEDLABTESTID,LABTESTID) VALUES (:resultid,:patientid,:result,:prescribedlabtestid,:labtestid)`;
        const params2 = { resultid, patientid, result, prescribedlabtestid, labtestid };
        const result4 = await db_query(query2, params2);
        console.log(result4);
        console.log("resultid inserted into result table");
        const query3 = `UPDATE PRESCRIBEDLABTEST SET STATUS='TEST COMPLETED' WHERE PRESCRIBEDLABTESTID=:prescribedlabtestid`;
        const params3 = { prescribedlabtestid };
        const result5 = await db_query(query3, params3);
        console.log(result5);
        console.log("status updated in prescribedlabtest table");
        //send response
        res.status(200).json({ message: 'Lab test conducted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//lab test payment
router.post('/labTestForPayment', async (req, res) => {
    //convert into number
    const appointmentId1 = parseInt(req.body.appointmentId);
    let appointmentId = appointmentId1;
    try {
        const query = "SELECT A.APPOINTMENTID,LT.*,LB.COST FROM APPOINTMENT A JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN LABBILL LB ON LB.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN LABTESTS LT ON LT.LABTESTID=LB.LABTESTID WHERE A.APPOINTMENTID=:appointmentId AND P.PRESCRIPTION_STATUS='UNPAID'";
        const params = { appointmentId };
        const result = await db_query(query, params);
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
});

//doctor fee payment
router.post('/doctorPayment', async (req, res) => {
    //convert into number
    const appointmentId1 = parseInt(req.body.appointmentId);
    let appointmentId = appointmentId1;
    try {
        const query = "SELECT A.APPOINTMENTID, DC.FIRSTNAME || ' ' || DC.LASTNAME AS DOCTORNAME,DB.DOCTORCOST AS FEE FROM APPOINTMENT A JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN DOCTORBILL DB ON DB.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN DOCTOR DC ON A.DOCTORID=DC.DOCTORID WHERE A.APPOINTMENTID=:appointmentId AND P.PRESCRIPTION_STATUS='UNPAID'";
        const params = { appointmentId };
        const result = await db_query(query, params);
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
}
);

//total payment
router.post('/totalPayment', async (req, res) => {
    //convert into number
    const appointmentId1 = parseInt(req.body.appointmentId);
    let appointmentId = appointmentId1;
    try {
        const query = "SELECT NVL(SUM(COST),0) AS LABCOST,NVL(SUM(DOCTORCOST),0) AS DOCTORCOST ,NVL(SUM(COST),0)+NVL(SUM(DOCTORCOST),0) AS TOTALCOST  FROM APPOINTMENT A JOIN PRESCRIPTION P ON A.APPOINTMENTID = P.APPOINTMENTID  LEFT JOIN (SELECT PRESCRIPTIONID, SUM(COST) AS COST FROM LABBILL GROUP BY PRESCRIPTIONID  ) LB ON LB.PRESCRIPTIONID = P.PRESCRIPTIONID LEFT  JOIN ( SELECT PRESCRIPTIONID, SUM(DOCTORCOST) AS DOCTORCOST FROM DOCTORBILL GROUP BY PRESCRIPTIONID ) DB ON DB.PRESCRIPTIONID = P.PRESCRIPTIONID WHERE A.APPOINTMENTID =:appointmentId AND P.PRESCRIPTION_STATUS = 'UNPAID'";
        const params = { appointmentId };
        const result = await db_query(query, params);
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
}
);

// // pay verification
// router.post('/payVerification', async (req, res) => {
//     // convert into number
//     const appointmentId = parseInt(req.body.appointmentId);
//     const amount = parseInt(req.body.amount);

//     try {
//         const query = `DECLARE result VARCHAR2(200);appointmentId NUMBER := :appointmentId; amount NUMBER := :amount; BEGIN  result := PAYMENT_VERIFICATION(appointmentId, amount); DBMS_OUTPUT.PUT_LINE(result); END;`;
//         const bindvars = { appointmentId, amount };

//         const result = await db_query(query, bindvars);

//         //fetch dbms output message
//         const paymentResult = await connection.getDbmsOutput();

//         if (paymentResult === 'Payment Successful') {
//             res.status(200).json({ message: 'Payment Successful' });
//         } else {
//             res.status(400).json({ message: 'Payment Unsuccessful' });
//         }

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

//pay verification
router.post('/payVerification', async (req, res) => {
    //convert into number
    const appointmentId1 = parseInt(req.body.appointmentId);
    let appointmentId = appointmentId1;
    const amount1 = parseInt(req.body.amount);
    let amount = amount1;
    try {
        // const query = "UPDATE PRESCRIPTION SET PRESCRIPTION_STATUS='PAID' WHERE PRESCRIPTION_STATUS='UNPAID' AND APPOINTMENTID=:appointmentId";
        // const params = { appointmentId };
        // const result = await db_query(query, params);
        const query1 = "SELECT NVL(SUM(COST),0) AS LABCOST,NVL(SUM(DOCTORCOST),0) AS DOCTORCOST ,NVL(SUM(COST),0)+NVL(SUM(DOCTORCOST),0) AS TOTALCOST  FROM APPOINTMENT A JOIN PRESCRIPTION P ON A.APPOINTMENTID = P.APPOINTMENTID  LEFT JOIN (SELECT PRESCRIPTIONID, SUM(COST) AS COST FROM LABBILL GROUP BY PRESCRIPTIONID  ) LB ON LB.PRESCRIPTIONID = P.PRESCRIPTIONID LEFT  JOIN ( SELECT PRESCRIPTIONID, SUM(DOCTORCOST) AS DOCTORCOST FROM DOCTORBILL GROUP BY PRESCRIPTIONID ) DB ON DB.PRESCRIPTIONID = P.PRESCRIPTIONID WHERE A.APPOINTMENTID =:appointmentId AND P.PRESCRIPTION_STATUS = 'UNPAID'";
        const params1 = { appointmentId };
        const result1 = await db_query(query1, params1);
        console.log("In pay verification");
        console.log(result1);
        const totalCost=result1[0].TOTALCOST;
        console.log(totalCost);
        if(totalCost<=amount){
            const query = "UPDATE PRESCRIPTION SET PRESCRIPTION_STATUS='PAID' WHERE PRESCRIPTION_STATUS='UNPAID' AND APPOINTMENTID=:appointmentId";
            const params = { appointmentId };
            const result = await db_query(query, params);
            res.status(200).json({message:'Payment Successful'});
        }
        else{
            res.status(400).json({message:'Payment Unsuccessful'});
        }

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
}
);
//see given medicine from patient
router.post('/prescription/getAllGivenMedicine', async (req, res) => {
    //get the patient id from the request
    const { patientId } = req.body;
    console.log(patientId);
    //convert into number
    const patientId1 = parseInt(patientId);
    try{
        const query = "SELECT PT.FIRSTNAME AS PATIENTNAME,D.FIRSTNAME AS DOCTORNAME,A.APPOINTMENTID, A.PATIENTID,M.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDMEDICINE PRM ON PRM.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN ALLMEDICINEPRESCRIBERMEDICINERELATION ALPRM ON ALPRM.PRESCRIBEDMEDICINEID=PRM.PRESCRIBEDMEDICINEID JOIN MEDICINES M ON M.MEDICINEID=ALPRM.MEDICINEID WHERE PT.PATIENT_ID=:patientId AND P.PRESCRIPTION_STATUS='PAID' ORDER BY A.APPOINTMENTID";
        const params = { patientId: patientId1 };
        const result = await db_query(query, params);
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see given advice from patient
router.post('/prescription/getAllGivenAdvice', async (req, res) => {
    //get the patient id from the request
    const { patientId } = req.body;
    console.log(patientId);
    //convert into number
    const patientId1 = parseInt(patientId);
    try{
        const query = "SELECT PT.FIRSTNAME AS PATIENTNAME,D.FIRSTNAME AS DOCTORNAME,A.APPOINTMENTID, A.PATIENTID,ADV.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDADVICE PRA ON PRA.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN ADVICEPRESCRIBEDADVICERELATION ADR ON PRA.PRESCRIBEDADVICEID=ADR.PRESCRIBEDADVICEID JOIN ADVICES ADV ON ADV.ADVICEID=ADR.ADVICEID WHERE PT.PATIENT_ID=:patientId AND P.PRESCRIPTION_STATUS='PAID' ORDER BY A.APPOINTMENTID";
        const params = { patientId: patientId1 };
        const result = await db_query(query, params);
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see given lab test from patient
router.post('/prescription/getAllGivenTests', async (req, res) => {
    //get the patient id from the request
    const { patientId } = req.body;
    console.log(patientId);
    //convert into number
    const patientId1 = parseInt(patientId);
    try{
        const query = "SELECT PT.FIRSTNAME AS PATIENTNAME,D.FIRSTNAME AS DOCTORNAME,A.APPOINTMENTID, A.PATIENTID,PRL.STATUS ,LT.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDLABTEST PRL ON PRL.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN PRESCRIBEDLABTESTALLLABTESTRELATION PRALL ON PRALL.PRESCRIBEDLABTESTID=PRL.PRESCRIBEDLABTESTID JOIN LABTESTS LT ON LT.LABTESTID=PRALL.LABTESTID WHERE PT.PATIENT_ID=:patientId AND P.PRESCRIPTION_STATUS='PAID' ORDER BY A.APPOINTMENTID";
        const params = { patientId: patientId1 };
        const result = await db_query(query, params);
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see given lab test result from patient
router.post('/prescription/getAllGivenTestResults', async (req, res) => {
    //get the patient id from the request
    const { patientId } = req.body;
    console.log(patientId);
    //convert into number
    const patientId1 = parseInt(patientId);
    try{
        const query = "SELECT PT.FIRSTNAME AS PATIENTNAME, D.FIRSTNAME AS DOCTORNAME,A.APPOINTMENTID, A.PATIENTID,LT.*,R.RESULTDETAILS,R.RESULTDATE FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDLABTEST PRL ON PRL.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN PRESCRIBEDLABTESTALLLABTESTRELATION PRALL ON PRALL.PRESCRIBEDLABTESTID=PRL.PRESCRIBEDLABTESTID JOIN LABTESTS LT ON LT.LABTESTID=PRALL.LABTESTID JOIN RESULT R ON R.PRESCRIBEDLABTESTID=PRL.PRESCRIBEDLABTESTID WHERE PRL.STATUS='TEST COMPLETED' AND PT.PATIENT_ID=:patientId AND P.PRESCRIPTION_STATUS='PAID' ORDER BY A.APPOINTMENTID";
        const params = { patientId: patientId1 };
        const result = await db_query(query, params);
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see all given medicine from patient for a particular appointment
router.post('/prescription/getAllGivenMedicineOnaGivenAppointment', async (req, res) => {
    //get the patient id from the request
    const { patientId, appointmentId } = req.body;
    console.log(patientId);
    console.log(appointmentId);
    //convert into number
    const patientId1 = parseInt(patientId);
    const appointmentId1 = parseInt(appointmentId);
    try{
        const query = "SELECT PT.FIRSTNAME AS PATIENTNAME,D.FIRSTNAME AS DOCTORNAME,A.APPOINTMENTID, A.PATIENTID,M.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDMEDICINE PRM ON PRM.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN ALLMEDICINEPRESCRIBERMEDICINERELATION ALPRM ON ALPRM.PRESCRIBEDMEDICINEID=PRM.PRESCRIBEDMEDICINEID JOIN MEDICINES M ON M.MEDICINEID=ALPRM.MEDICINEID WHERE PT.PATIENT_ID=:patientId AND P.PRESCRIPTION_STATUS='PAID' AND A.APPOINTMENTID=:appointmentId AND M.MEDICINENAME IS NOT NULL ORDER BY A.APPOINTMENTID";
        const params = { patientId: patientId1, appointmentId: appointmentId1 };
        const result = await db_query(query, params);
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see all given advice from patient for a particular appointment
router.post('/prescription/getAllGivenAdviceOnaGivenAppointment', async (req, res) => {
    //get the patient id from the request
    const { patientId, appointmentId } = req.body;
    console.log(patientId);
    console.log(appointmentId);
    //convert into number
    const patientId1 = parseInt(patientId);
    const appointmentId1 = parseInt(appointmentId);
    try{
        const query = "SELECT PT.FIRSTNAME AS PATIENTNAME,D.FIRSTNAME AS DOCTORNAME,A.APPOINTMENTID, A.PATIENTID,ADV.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDADVICE PRA ON PRA.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN ADVICEPRESCRIBEDADVICERELATION ADR ON PRA.PRESCRIBEDADVICEID=ADR.PRESCRIBEDADVICEID JOIN ADVICES ADV ON ADV.ADVICEID=ADR.ADVICEID WHERE PT.PATIENT_ID=:patientId AND P.PRESCRIPTION_STATUS='PAID' AND A.APPOINTMENTID=:appointmentId  ORDER BY A.APPOINTMENTID";
        const params = { patientId: patientId1, appointmentId: appointmentId1 };
        const result = await db_query(query, params);
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
//see all given lab test from patient for a particular appointment
router.post('/prescription/getAllGivenTestsOnaGivenAppointment', async (req, res) => {
    //get the patient id from the request
    const { patientId, appointmentId } = req.body;
    console.log(patientId);
    console.log(appointmentId);
    //convert into number
    const patientId1 = parseInt(patientId);
    const appointmentId1 = parseInt(appointmentId);
    try{
        const query = "SELECT D.FIRSTNAME AS DOCTORNAME,PT.FIRSTNAME AS PATIENTNAME,A.APPOINTMENTID, A.PATIENTID,PRL.STATUS ,LT.* FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDLABTEST PRL ON PRL.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN PRESCRIBEDLABTESTALLLABTESTRELATION PRALL ON PRALL.PRESCRIBEDLABTESTID=PRL.PRESCRIBEDLABTESTID JOIN LABTESTS LT ON LT.LABTESTID=PRALL.LABTESTID WHERE PT.PATIENT_ID=:patientId AND P.PRESCRIPTION_STATUS='PAID' AND A.APPOINTMENTID=:appointmentId  ORDER BY A.APPOINTMENTID";
        const params = { patientId: patientId1, appointmentId: appointmentId1 };
        const result = await db_query(query, params);
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see all given lab test result from patient for a particular appointment
router.post('/prescription/getAllGivenTestResultsOnaGivenAppointment', async (req, res) => {
    //get the patient id from the request
    const { patientId, appointmentId } = req.body;
    console.log(patientId);
    console.log(appointmentId);
    //convert into number
    const patientId1 = parseInt(patientId);
    const appointmentId1 = parseInt(appointmentId);
    try{
        const query = "SELECT PT.FIRSTNAME AS PATIENTNAME, D.FIRSTNAME AS DOCTORNAME,A.APPOINTMENTID, A.PATIENTID,LT.*,R.RESULTDETAILS,R.RESULTDATE FROM DOCTOR D JOIN APPOINTMENT A ON A.DOCTORID=D.DOCTORID JOIN PATIENT PT ON PT.PATIENT_ID=A.PATIENTID JOIN PRESCRIPTION P ON A.APPOINTMENTID=P.APPOINTMENTID JOIN PRESCRIBEDLABTEST PRL ON PRL.PRESCRIPTIONID=P.PRESCRIPTIONID JOIN PRESCRIBEDLABTESTALLLABTESTRELATION PRALL ON PRALL.PRESCRIBEDLABTESTID=PRL.PRESCRIBEDLABTESTID JOIN LABTESTS LT ON LT.LABTESTID=PRALL.LABTESTID JOIN RESULT R ON R.PRESCRIBEDLABTESTID=PRL.PRESCRIBEDLABTESTID WHERE PRL.STATUS='TEST COMPLETED' AND PT.PATIENT_ID=:patientId AND A.APPOINTMENTID=:appointmentId  AND P.PRESCRIPTION_STATUS='PAID' ORDER BY A.APPOINTMENTID";
        const params = { patientId: patientId1, appointmentId: appointmentId1 };
        const result = await db_query(query, params);
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
//view paid bill logs
router.get('/viewPaidBillLogs', async (req, res) => {
    try {
        const query = "SELECT B.BILLID, D.FIRSTNAME || ' ' || D.LASTNAME AS DOCTORNAME, LT.TESTNAME AS LABTESTNAME, PT.FIRSTNAME || ' ' || PT.LASTNAME AS PATIENTNAME, B.TOTAL_COST,B.ISSUEDATE FROM BILL B JOIN PRESCRIPTION P ON B.PRESCRIPTIONID = P.PRESCRIPTIONID JOIN APPOINTMENT A ON P.APPOINTMENTID = A.APPOINTMENTID JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID JOIN PATIENT PT ON A.PATIENTID = PT.PATIENT_ID LEFT JOIN (SELECT LB.PRESCRIPTIONID, LISTAGG(LT.TESTNAME, ', ') WITHIN GROUP (ORDER BY LT.LABTESTID) AS TESTNAME FROM  LABBILL LB JOIN LABTESTS LT ON LB.LABTESTID = LT.LABTESTID GROUP BY  LB.PRESCRIPTIONID) LT ON P.PRESCRIPTIONID = LT.PRESCRIPTIONID WHERE B.BILLSTATUS = 'PAID' AND B.TOTAL_COST IS NOT NULL";
        const result = await db_query(query, {});
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
app.listen(3000, () => {
    console.log('Server on port 3000');
});
//view unpaid bill logs
router.get('/viewUnpaidBillLogs', async (req, res) => {
    try {
        const query = "SELECT B.BILLID, D.FIRSTNAME || ' ' || D.LASTNAME AS DOCTORNAME, LT.TESTNAME AS LABTESTNAME, PT.FIRSTNAME || ' ' || PT.LASTNAME AS PATIENTNAME, B.TOTAL_COST,B.ISSUEDATE FROM BILL B JOIN PRESCRIPTION P ON B.PRESCRIPTIONID = P.PRESCRIPTIONID JOIN APPOINTMENT A ON P.APPOINTMENTID = A.APPOINTMENTID JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID JOIN PATIENT PT ON A.PATIENTID = PT.PATIENT_ID LEFT JOIN (SELECT LB.PRESCRIPTIONID, LISTAGG(LT.TESTNAME, ', ') WITHIN GROUP (ORDER BY LT.LABTESTID) AS TESTNAME FROM  LABBILL LB JOIN LABTESTS LT ON LB.LABTESTID = LT.LABTESTID GROUP BY  LB.PRESCRIPTIONID) LT ON P.PRESCRIPTIONID = LT.PRESCRIPTIONID WHERE B.BILLSTATUS = 'NOT PAID' AND B.TOTAL_COST IS NOT NULL AND B.TOTAL_COST>0";
        const result = await db_query(query, {});
        console.log(result);
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
//show paid and unpaid money 
router.get('/showPaidUnpaidAmount', async (req, res) => {
    try {
       const query="BEGIN CALCULATE_UPDATE_TOTAL_UNPAID_AMOUNT; CALCULATE_UPDATE_TOTAL_PAID_AMOUNT; end;";
         const result = await db_query(query, {});
        console.log(result);
        const query1="SELECT * FROM MONEYS WHERE ROWNUM=1";
        const result1 = await db_query(query1, {});
        console.log(result1);
        if (result1.length === 0) {
            res.status(200).json(result1);
        }
        else {
            res.status(200).json(result1);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);























//new started
router.post('/setDisease', async (req, res) => {
    const { patientId, disease } = req.body;
    console.log(patientId);
    console.log(disease);
    console.log("In set disease");
    try {
        console.log(patientId);
        const query = "UPDATE PATIENT SET DISEASE=:disease WHERE PATIENT_ID=:patientId";
        const params = { patientId, disease};
        const result = await db_query(query, params);
        res.status(200).json({ message: 'Disease inserted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);


//show medicine usage last month
router.get('/showMedicineUsageLastMonth', async (req, res) => {
    try {
        const query = `SELECT DISTINCT M.MedicineID,M.MedicineName,( SELECT NVL(COUNT(*),0) FROM PRESCRIBEDMEDICINE PM JOIN ALLMEDICINEPRESCRIBERMEDICINERELATION AMR ON PM.PrescribedMedicineID = AMR.PrescribedMedicineID JOIN MEDICINES M2 ON AMR.MedicineID = M2.MedicineID JOIN PRESCRIPTION P ON PM.PrescriptionID = P.PrescriptionID WHERE M2.MedicineID = M.MedicineID AND P.PRESCRIPTIONDATE >= SYSDATE - 30 HAVING NVL(COUNT(*),0)>0) AS UsageCount FROM MEDICINES M  WHERE (
            SELECT NVL(COUNT(*),0) FROM PRESCRIBEDMEDICINE PM JOIN ALLMEDICINEPRESCRIBERMEDICINERELATION AMR ON PM.PrescribedMedicineID = AMR.PrescribedMedicineID JOIN MEDICINES M2 ON AMR.MedicineID = M2.MedicineID JOIN PRESCRIPTION P ON PM.PrescriptionID = P.PrescriptionID WHERE M2.MedicineID = M.MedicineID AND P.PRESCRIPTIONDATE >= SYSDATE - 30 HAVING NVL(COUNT(*),0)>0) IS NOT NULL AND M.MedicineName IS NOT NULL `;
        const result = await db_query(query, {});
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//show medicine usage for this med
router.post('/showMedicineUsageForThisMed', async (req, res) => {
    const { medicineName} = req.body;
    console.log(medicineName);
    //console.log(medicineName1);
    const medicineName1 = `%${medicineName}%`;
    console.log(medicineName1);
    try {
        const query = `SELECT DISTINCT M.MedicineID,M.MedicineName,( SELECT COUNT(*) FROM PRESCRIBEDMEDICINE PM JOIN ALLMEDICINEPRESCRIBERMEDICINERELATION AMR ON PM.PrescribedMedicineID = AMR.PrescribedMedicineID JOIN MEDICINES M2 ON AMR.MedicineID = M2.MedicineID JOIN PRESCRIPTION P ON PM.PrescriptionID = P.PrescriptionID WHERE M2.MedicineID = M.MedicineID AND P.PRESCRIPTIONDATE >= SYSDATE - 30 ) AS UsageCount FROM MEDICINES M WHERE LOWER(M.MedicineName ) LIKE :medicineName1`;
        const params = { medicineName1 };
        const result = await db_query(query, params);
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//show evry doctor koyta patient dekheche
router.get('/showDoctorsPatientCount', async (req, res) => {
    try {
        const query = `SELECT D.FirstName || ' ' || D.LastName AS DoctorName, (SELECT COUNT(DISTINCT A.PatientID) FROM APPOINTMENT A WHERE A.DoctorID = D.DoctorID) AS PatientsCount FROM DOCTOR D`;
        const result = await db_query(query, {});
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//betweeen date er moddhe koyta patient dekheche
router.post('/showDoctorsPatientCountBetweenTwoDates', async (req, res) => {
    const { startDate, endDate } = req.body;
    console.log(startDate);
    console.log(endDate);
    try {
        const query = `SELECT D.FirstName || ' ' || D.LastName AS DoctorName, (SELECT COUNT(DISTINCT A.PatientID) FROM APPOINTMENT A WHERE A.DoctorID = D.DoctorID AND A.AppointmentDate BETWEEN TO_DATE(:startDate, 'YYYY-MM-DD') AND TO_DATE(:endDate, 'YYYY-MM-DD')) AS PatientsCount FROM DOCTOR D`;
        const params = { startDate, endDate };
        const result = await db_query(query, params);
        if (result.length === 0) {
            res.status(200).json(result);
        }
        else {
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see count of appointment a doctor has seen patient
router.post('/seeCountOfAppointment', async (req, res) => {
    const { doctorId,patientId } = req.body;
    
    console.log(doctorId);
    try {
        const query = `SELECT DISTINCT D.FirstName || ' ' || D.LastName AS DoctorName, P.FirstName || ' ' || P.LastName AS PatientName, (SELECT COUNT(*) FROM APPOINTMENT A WHERE A.DOCTORID = D.DoctorId AND A.PATIENTID = P.PATIENT_ID) AS TotalAppointments FROM DOCTOR D JOIN APPOINTMENT A ON D.DoctorId = A.DOCTORID JOIN PATIENT P ON A.PATIENTID = P.PATIENT_ID WHERE D.DOCTORID=:doctorId AND P.PATIENT_ID=:patientId`;
        const params = { doctorId,patientId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see count with that specific disease
router.post('/seeCountOfAppointmentWithThatDisease', async (req, res) => {
 const {appointmentId}=req.body;
    try {
        const query = `SELECT P.FirstName || ' ' || P.LastName AS PatientName, D.FirstName || ' ' || D.LastName AS DoctorName, A.AppointmentDate AS TODAYSAPPOINTMENTDATE, A.Notes, A.PATIENTDISEASE, (SELECT COUNT(*) FROM APPOINTMENT WHERE PATIENTID = A.PATIENTID AND APPOINTMENTDATE <A.APPOINTMENTDATE AND PATIENTDISEASE = A.PATIENTDISEASE) AS PreviousAppointmentsCount FROM APPOINTMENT A JOIN PATIENT P ON A.PATIENTID = P.PATIENT_ID JOIN DOCTOR D ON A.DOCTORID = D.DoctorId WHERE A.APPOINTMENTID=:appointmentId`;
        const params = { appointmentId };
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
//see medicines given by me with that specific disease
router.post('/seeMedicinesGivenOnThisDisease', async (req, res) => {
    const{disease,doctorId,patientId}=req.body;
    try {
        const query = `SELECT DISTINCT P.FirstName || ' ' || P.LastName AS PatientName, D.FirstName || ' ' || D.LastName AS DoctorName, A.PATIENTDISEASE, M2.MedicineName, M2.Dosages, M2.SideEffects, PM.HOWTOTAKE FROM PATIENT P JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID JOIN PRESCRIBEDMEDICINE PM ON PS.PrescriptionID = PM.PRESCRIPTIONID JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID JOIN (SELECT M.MedicineName, M.Dosages, M.SideEffects, A2.PATIENTID, A2.PATIENTDISEASE FROM MEDICINES M JOIN ALLMEDICINEPRESCRIBERMEDICINERELATION AM ON M.MedicineID = AM.MedicineID JOIN PRESCRIBEDMEDICINE PM ON AM.PRESCRIBEDMEDICINEID = PM.PRESCRIBEDMEDICINEID JOIN PRESCRIPTION PS ON PM.PRESCRIPTIONID = PS.PRESCRIPTIONID JOIN APPOINTMENT A2 ON PS.AppointmentID = A2.AppointmentID) M2 ON P.PATIENT_ID = M2.PATIENTID AND A.PATIENTDISEASE = M2.PATIENTDISEASE WHERE A.PATIENTDISEASE=:disease AND A.PATIENTID=:patientId AND A.DOCTORID=:doctorId`;
        const params = { disease,patientId,doctorId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
//see lab tests given by me with that specific disease

router.post('/seeLabTestsGivenOnThisDisease' , async (req, res) => {
    const{disease,doctorId,patientId}=req.body;
    try {
        const query = `SELECT DISTINCT P.FirstName || ' ' || P.LastName AS PatientName, D.FirstName || ' ' || D.LastName AS DoctorName, L2.PATIENTDISEASE, L2.TestName FROM PATIENT P JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID JOIN PRESCRIBEDLABTEST PLT ON PS.PrescriptionID = PLT.PRESCRIPTIONID JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID JOIN (SELECT LT.TestName, A2.PATIENTID, A2.PATIENTDISEASE FROM LABTESTS LT JOIN PRESCRIBEDLABTESTALLLABTESTRELATION PLTR ON LT.LABTESTID = PLTR.LABTESTID JOIN PRESCRIBEDLABTEST PLT2 ON PLTR.PRESCRIBEDLABTESTID = PLT2.PRESCRIBEDLABTESTID JOIN PRESCRIPTION PS2 ON PLT2.PRESCRIPTIONID = PS2.PRESCRIPTIONID JOIN APPOINTMENT A2 ON PS2.AppointmentID = A2.AppointmentID) L2 ON P.PATIENT_ID = L2.PATIENTID AND A.PATIENTDISEASE = L2.PATIENTDISEASE WHERE A.PATIENTDISEASE=:disease AND A.PATIENTID=:patientId AND A.DOCTORID=:doctorId`;
        const params = { disease,patientId,doctorId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see advice given by me with that specific disease
router.post('/seeGivenAdviceOnThisDisease', async (req, res) => {
    const{disease,doctorId,patientId}=req.body;
    try {
        const query = `SELECT DISTINCT P.FirstName || ' ' || P.LastName AS PatientName, D.FirstName || ' ' || D.LastName AS DoctorName, AD2.PATIENTDISEASE, AD2.AdviceType, AD2.AdviceText FROM PATIENT P JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID JOIN PRESCRIBEDADVICE PAD ON PS.PrescriptionID = PAD.PrescriptionID JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID JOIN (SELECT AD2.AdviceType, AD2.AdviceText, A2.PATIENTDISEASE, A2.PATIENTID FROM ADVICES AD2 JOIN ADVICEPRESCRIBEDADVICERELATION ADPR2 ON AD2.AdviceID = ADPR2.AdviceID JOIN PRESCRIBEDADVICE PAD2 ON ADPR2.PrescribedAdviceID = PAD2.PrescribedAdviceID JOIN PRESCRIPTION PS2 ON PAD2.PrescriptionID = PS2.PrescriptionID JOIN APPOINTMENT A2 ON PS2.AppointmentID = A2.AppointmentID) AD2 ON P.PATIENT_ID = AD2.PATIENTID AND A.PATIENTDISEASE = AD2.PATIENTDISEASE WHERE A.PATIENTDISEASE=:disease AND A.PATIENTID=:patientId AND A.DOCTORID=:doctorId`;
        const params = { disease,patientId,doctorId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see medicine given by me on last appointment
router.post('/seeGivenMedicinesOnLastAppointMent', async (req, res) => {
    const{appointmentId,doctorId,patientId}=req.body;
    try {
        const query = `SELECT P.FirstName || ' ' || P.LastName AS PatientName, D.FirstName || ' ' || D.LastName AS DoctorName, A.PATIENTDISEASE, PM.HOWTOTAKE, M.MedicineName, M.Dosages, M.SideEffects, A.APPOINTMENTID, P.PATIENT_ID, PS.PRESCRIPTIONID FROM PATIENT P JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID JOIN PRESCRIBEDMEDICINE PM ON PS.PrescriptionID = PM.PRESCRIPTIONID JOIN ALLMEDICINEPRESCRIBERMEDICINERELATION APR ON APR.PRESCRIBEDMEDICINEID=PM.PRESCRIBEDMEDICINEID JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID JOIN MEDICINES M ON APR.MedicineID = M.MedicineID WHERE PS.PRESCRIPTIONID =( SELECT MAX(PS.PRESCRIPTIONID) FROM PATIENT P JOIN APPOINTMENT A2 ON P.PATIENT_ID = A2.PATIENTID JOIN PRESCRIPTION PS ON A2.AppointmentID = PS.AppointmentID JOIN PRESCRIBEDMEDICINE PM ON PS.PrescriptionID = PM.PRESCRIPTIONID WHERE A2.PATIENTID=:patientId AND A2.APPOINTMENTID <:appointmentId ) AND D.DOCTORID=:doctorId ORDER BY PatientName, DoctorName, A.PATIENTDISEASE`;
        const params = { patientId,doctorId,appointmentId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see given advice on last appointment
router.post('/seeGivenAdvicesOnLastAppointMent' , async (req, res) => {
    const{appointmentId,doctorId,patientId}=req.body;
    try {
        const query = `SELECT P.FirstName || ' ' || P.LastName AS PatientName, D.FirstName || ' ' || D.LastName AS DoctorName, A.PATIENTDISEASE, PA.AdviceType, PA.AdviceText, A.APPOINTMENTID, P.PATIENT_ID, PS.PRESCRIPTIONID FROM PATIENT P JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID JOIN DOCTOR D ON D.DOCTORID=A.DOCTORID JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID JOIN PRESCRIBEDADVICE PAD ON PS.PrescriptionID = PAD.PRESCRIPTIONID JOIN ADVICEPRESCRIBEDADVICERELATION APR ON PAD.PRESCRIBEDADVICEID=APR.PRESCRIBEDADVICEID JOIN ADVICES PA ON PA.ADVICEID=APR.ADVICEID WHERE PS.PRESCRIPTIONID = ( SELECT MAX(PS2.PRESCRIPTIONID) FROM PATIENT P2 JOIN APPOINTMENT A2 ON P2.PATIENT_ID = A2.PATIENTID JOIN PRESCRIPTION PS2 ON A2.AppointmentID = PS2.AppointmentID JOIN PRESCRIBEDADVICE PAD2 ON PS2.PrescriptionID = PAD2.PRESCRIPTIONID WHERE A2.PATIENTID =:patientId AND A2.APPOINTMENTID <:appointmentId ) AND D.DOCTORID=:doctorId ORDER BY PatientName, DoctorName, A.PATIENTDISEASE`;
        const params = { patientId,doctorId,appointmentId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see given lab test on last appointment
router.post('/seeGivenLabTestsOnLastAppointMent' , async (req, res) => {
    const{appointmentId,doctorId,patientId}=req.body;
    try {
        const query = `SELECT P.FirstName || ' ' || P.LastName AS PatientName, D.FirstName || ' ' || D.LastName AS DoctorName, A.PATIENTDISEASE, LT.TestName, A.APPOINTMENTID, P.PATIENT_ID, PS.PRESCRIPTIONID FROM PATIENT P JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID JOIN DOCTOR D ON D.DOCTORID=A.DOCTORID JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID JOIN PRESCRIBEDLABTEST PLT ON PS.PrescriptionID = PLT.PRESCRIPTIONID JOIN PRESCRIBEDLABTESTALLLABTESTRELATION PLTR ON PLT.PRESCRIBEDLABTESTID = PLTR.PRESCRIBEDLABTESTID JOIN LABTESTS LT ON PLTR.LABTESTID = LT.LABTESTID WHERE PS.PRESCRIPTIONID = ( SELECT MAX(PS2.PRESCRIPTIONID) FROM PATIENT P2 JOIN APPOINTMENT A2 ON P2.PATIENT_ID = A2.PATIENTID JOIN PRESCRIPTION PS2 ON A2.AppointmentID = PS2.AppointmentID JOIN PRESCRIBEDLABTEST PLT2 ON PS2.PrescriptionID = PLT2.PRESCRIPTIONID WHERE A2.PATIENTID =:patientId AND A2.APPOINTMENTID <:appointmentId ) AND D.DOCTORID=:doctorId ORDER BY PatientName, DoctorName, A.PATIENTDISEASE`;
        const params = { patientId,doctorId,appointmentId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see other doctors given medicine on this disease
router.post('/seeOtherDoctorsGivenMedicinesOnThisDisease', async (req, res) => {
    const{disease,doctorId,patientId}=req.body;
    try {
        const query = `SELECT DISTINCT P.FirstName || ' ' || P.LastName AS PatientName, D.FirstName || ' ' || D.LastName AS DoctorName, A.PATIENTDISEASE, M2.MedicineName, M2.Dosages, M2.SideEffects, PM.HOWTOTAKE FROM PATIENT P JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID JOIN PRESCRIBEDMEDICINE PM ON PS.PrescriptionID = PM.PRESCRIPTIONID JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID JOIN (SELECT M.MedicineName, M.Dosages, M.SideEffects, A2.PATIENTID, A2.PATIENTDISEASE FROM MEDICINES M JOIN ALLMEDICINEPRESCRIBERMEDICINERELATION AM ON M.MedicineID = AM.MedicineID JOIN PRESCRIBEDMEDICINE PM ON AM.PRESCRIBEDMEDICINEID = PM.PRESCRIBEDMEDICINEID JOIN PRESCRIPTION PS ON PM.PRESCRIPTIONID = PS.PRESCRIPTIONID JOIN APPOINTMENT A2 ON PS.AppointmentID = A2.AppointmentID) M2 ON P.PATIENT_ID = M2.PATIENTID AND A.PATIENTDISEASE = M2.PATIENTDISEASE WHERE A.PATIENTDISEASE=:disease AND A.PATIENTID=:patientId AND A.DOCTORID!=:doctorId`;
        const params = { disease,patientId,doctorId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see what medicine patient has taKEN between two dates
router.post('/seeWhatMedicinePatientHasTakenBetweenTwoDates', async (req, res) => {
    const{startDate,endDate,patientId}=req.body;
    try {
        const query = `SELECT P.FirstName || ' ' || P.LastName AS PatientName, M.MedicineName, PM.HOWTOTAKE, A.APPOINTMENTDATE, A.PATIENTDISEASE FROM PATIENT P JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID JOIN PRESCRIBEDMEDICINE PM ON PS.PrescriptionID = PM.PRESCRIPTIONID JOIN ALLMEDICINEPRESCRIBERMEDICINERELATION APR ON APR.PRESCRIBEDMEDICINEID = PM.PRESCRIBEDMEDICINEID JOIN MEDICINES M ON APR.MedicineID = M.MedicineID WHERE EXISTS( SELECT PS1.PRESCRIPTIONDATE FROM PRESCRIPTION PS1 JOIN APPOINTMENT A2 ON A2.APPOINTMENTID = PS1.APPOINTMENTID WHERE A2.PATIENTID = A.PATIENTID AND PS1.PRESCRIPTIONDATE BETWEEN TO_DATE(:startDate, 'YYYY-MM-DD') AND TO_DATE(:endDate, 'YYYY-MM-DD')) AND P.PATIENT_ID = :patientId`;
        const params = { patientId,startDate,endDate};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see doctors rank
router.get('/showDoctorRankBasedOnPatientCount', async (req, res) => {
    try {
        const query = `WITH T AS(SELECT DoctorName, NumberOfPatients FROM (SELECT D.FirstName || ' ' || D.LastName AS DoctorName, COUNT(A.PATIENTID) AS NumberOfPatients FROM DOCTOR D JOIN APPOINTMENT A ON D.DOCTORID = A.DOCTORID GROUP BY D.DOCTORID, D.FirstName, D.LastName))
        SELECT T1.NumberOfPatients AS NUMBEROFAPPOINTMENTS, T1.DoctorName, COUNT(T2.DoctorName) + 1 AS RANK FROM T T1 FULL JOIN T T2 ON T1.NumberOfPatients < T2.NumberOfPatients WHERE T1.DoctorName IS NOT NULL GROUP BY T1.NumberOfPatients, T1.DoctorName ORDER BY COUNT(T2.DoctorName) + 1`;
        const result = await db_query(query, {});
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//-KON ROGIR KOTO BAKI ACHE LAB COST  

router.get('/showPatientLabTestCost' , async (req, res) => {
    try {
        const query = `SELECT
        P.PATIENT_ID,
        P.FirstName || ' ' || P.LastName AS PatientName,
        (
            SELECT COALESCE(SUM(LB.Cost), 0)
            FROM APPOINTMENT A
            LEFT JOIN PRESCRIPTION PR ON A.AppointmentID = PR.AppointmentID
            LEFT JOIN LABBILL LB ON PR.PRESCRIPTIONID = LB.PRESCRIPTIONID
            WHERE A.PATIENTID = P.PATIENT_ID 
                    HAVING COALESCE(SUM(LB.Cost), 0)>0
        ) AS TotalLabTestCost
    FROM PATIENT P
    WHERE(
            SELECT COALESCE(SUM(LB.Cost), 0)
            FROM APPOINTMENT A
            LEFT JOIN PRESCRIPTION PR ON A.AppointmentID = PR.AppointmentID
            LEFT JOIN LABBILL LB ON PR.PRESCRIPTIONID = LB.PRESCRIPTIONID
            WHERE A.PATIENTID = P.PATIENT_ID 
                    HAVING COALESCE(SUM(LB.Cost), 0)>0
        ) IS NOT NULL`;
        const result = await db_query(query, {});
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//--KON ROGI KOTO baki lab test e
router.get('/showUnpaidLabTestCost' , async (req, res) => {
    try {
        const query = `SELECT
        P.PATIENT_ID,
        P.FirstName || ' ' || P.LastName AS PatientName,
        (
            SELECT COALESCE(SUM(LB.Cost), 0)
            FROM APPOINTMENT A
            LEFT JOIN PRESCRIPTION PR ON A.AppointmentID = PR.AppointmentID
            LEFT JOIN LABBILL LB ON PR.PRESCRIPTIONID = LB.PRESCRIPTIONID
            WHERE A.PATIENTID = P.PATIENT_ID AND PR.PRESCRIPTION_STATUS='UNPAID' 
                    HAVING COALESCE(SUM(LB.Cost), 0)>0
        ) AS TotalLabTestCost
    FROM PATIENT P
    WHERE (
            SELECT COALESCE(SUM(LB.Cost), 0)
            FROM APPOINTMENT A
            LEFT JOIN PRESCRIPTION PR ON A.AppointmentID = PR.AppointmentID
            LEFT JOIN LABBILL LB ON PR.PRESCRIPTIONID = LB.PRESCRIPTIONID
            WHERE A.PATIENTID = P.PATIENT_ID AND PR.PRESCRIPTION_STATUS='UNPAID' 
                    HAVING COALESCE(SUM(LB.Cost), 0)>0
        ) IS NOT NULL`;
        const result = await db_query(query, {});
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
//---KON ROGIR KOTO payment koreche lab test e
router.get('/showPaidLabTestCost' , async (req, res) => {
    try {
        const query = `SELECT
        P.PATIENT_ID,
        P.FirstName || ' ' || P.LastName AS PatientName,
        (
            SELECT COALESCE(SUM(LB.Cost), 0)
            FROM APPOINTMENT A
            LEFT JOIN PRESCRIPTION PR ON A.AppointmentID = PR.AppointmentID
            LEFT JOIN LABBILL LB ON PR.PRESCRIPTIONID = LB.PRESCRIPTIONID
            WHERE A.PATIENTID = P.PATIENT_ID AND PR.PRESCRIPTION_STATUS='PAID' 
                    HAVING COALESCE(SUM(LB.Cost), 0)>0
        ) AS TotalLabTestCost
    FROM PATIENT P
    WHERE (
            SELECT COALESCE(SUM(LB.Cost), 0)
            FROM APPOINTMENT A
            LEFT JOIN PRESCRIPTION PR ON A.AppointmentID = PR.AppointmentID
            LEFT JOIN LABBILL LB ON PR.PRESCRIPTIONID = LB.PRESCRIPTIONID
            WHERE A.PATIENTID = P.PATIENT_ID AND PR.PRESCRIPTION_STATUS='PAID' 
                    HAVING COALESCE(SUM(LB.Cost), 0)>0
        ) IS NOT NULL`;
        const result = await db_query(query, {});
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
//--FROM DOCTORS SIDE ,KON KON PATIENT MORE THAN ONE APPOINTMENT NICHE WITH THEIR DISEASE
router.post('/viewPatientsWhoHasTakenMorethanOneAppointmentWithSingleDisease', async (req, res) => {
    const{doctorId}=req.body;
    try {
        const query = `SELECT DISTINCT D.FirstName || ' ' || D.LastName AS DoctorName, P.FirstName || ' ' || P.LastName AS PatientName, A.PATIENTDISEASE, (SELECT COUNT(*) FROM APPOINTMENT A2 WHERE A2.DOCTORID = D.DOCTORID AND A2.PATIENTID = A.PATIENTID AND A.PATIENTDISEASE=A2.PATIENTDISEASE) AS AppointmentCount FROM DOCTOR D JOIN APPOINTMENT A ON D.DOCTORID = A.DOCTORID JOIN PATIENT P ON A.PATIENTID = P.PATIENT_ID WHERE (SELECT COUNT(*) FROM APPOINTMENT A3 WHERE A3.DOCTORID = D.DOCTORID AND A3.PATIENTID = A.PATIENTID AND A.PATIENTDISEASE=A3.PATIENTDISEASE) > 1 AND D.DOCTORID=:doctorId`;
        const params = { doctorId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
//last 7 days appointment
router.post('/viewMyLast7DaysAppointments', async (req, res) => {
    const{doctorId}=req.body;
    try {
        const query = `SELECT D.FirstName || ' ' || D.LastName AS DoctorName, P.FirstName || ' ' || P.LastName AS PatientName, A.PATIENTDISEASE, (SELECT COUNT(*) FROM APPOINTMENT A2 WHERE A2.DOCTORID = D.DOCTORID AND A2.PATIENTID = A.PATIENTID AND A2.PATIENTDISEASE = A.PATIENTDISEASE AND A2.AppointmentDate >= SYSDATE - 7) AS AppointmentCount FROM DOCTOR D JOIN APPOINTMENT A ON D.DOCTORID = A.DOCTORID JOIN PATIENT P ON A.PATIENTID = P.PATIENT_ID WHERE A.AppointmentDate >= SYSDATE - 7 AND D.DOCTORID=:doctorId`;
        const params = { doctorId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);


//patient with multiple unpaid bills 

router.get('/showPatientWithMultipleUnpaidBills' , async (req, res) => {
    try {
        const query = `SELECT P.PATIENT_ID, P.FirstName || ' ' || P.LastName AS PatientName, (SELECT COUNT(*) FROM APPOINTMENT A JOIN PRESCRIPTION PRS ON A.AppointmentID = PRS.AppointmentID JOIN BILL B ON PRS.PrescriptionID = B.PRESCRIPTIONID WHERE A.PATIENTID = P.PATIENT_ID AND PRS.PRESCRIPTION_STATUS = 'UNPAID') AS NumberOfPrescriptions, (SELECT SUM(B.TOTAL_COST) FROM APPOINTMENT A JOIN PRESCRIPTION PRS ON A.AppointmentID = PRS.AppointmentID JOIN BILL B ON PRS.PrescriptionID = B.PRESCRIPTIONID WHERE A.PATIENTID = P.PATIENT_ID AND PRS.PRESCRIPTION_STATUS = 'UNPAID') AS TotalBillAmount FROM PATIENT P WHERE (SELECT COUNT(*) FROM APPOINTMENT A JOIN PRESCRIPTION PRS ON A.AppointmentID = PRS.AppointmentID JOIN BILL B ON PRS.PrescriptionID = B.PRESCRIPTIONID WHERE A.PATIENTID = P.PATIENT_ID AND PRS.PRESCRIPTION_STATUS = 'UNPAID') > 1`;
        const result = await db_query(query, {});
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//show daywise appointment count
router.get('/showDayWiseAppointmentCount', async (req, res) => {
    try {
        const query = `SELECT TO_CHAR(A.AppointmentDate, 'YYYY-MM-DD') AS AppointmentDay, D.FirstName || ' ' || D.LastName AS DoctorName, COUNT(DISTINCT P.PrescriptionID) AS PrescriptionCount, COUNT(A.AppointmentID) AS AppointmentCount FROM APPOINTMENT A JOIN DOCTOR D ON A.DoctorId = D.DoctorId LEFT JOIN PRESCRIPTION P ON A.AppointmentID = P.AppointmentID GROUP BY TO_CHAR(A.AppointmentDate, 'YYYY-MM-DD'), D.FirstName || ' ' || D.LastName ORDER BY AppointmentDay, DoctorName`;
        const result = await db_query(query, {});
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//disease with patient count

router.get('/showDiseaseWithNoOfPatients' , async (req, res) => {
    try {
        const query = `SELECT DISTINCT PATIENTDISEASE AS DiseaseName, (SELECT COUNT(DISTINCT PatientID) FROM APPOINTMENT A2 WHERE A2.PATIENTDISEASE = A.PATIENTDISEASE) AS NumberOfPatients FROM APPOINTMENT A`;
        const result = await db_query(query, {});
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//doctor who hasnot seen any patient
router.get('/showDoctorWhoHasnotPrescribed' , async (req, res) => {
    try {
        const query = `SELECT D.FirstName || ' ' || D.LastName AS DoctorName FROM DOCTOR D WHERE NOT EXISTS (SELECT 1 FROM APPOINTMENT A WHERE A.DOCTORID = D.DOCTORID AND A.APPOINTMENTID IN (SELECT PS.APPOINTMENTID FROM PRESCRIPTION PS))`;
        const result = await db_query(query, {});
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see patients previous disease
router.post('/seePreviousDiseases' , async (req, res) => {
    const{patientId}=req.body;
    try {
        const query = `SELECT* FROM PATIENTPREVIOUSDISEASES WHERE PATIENT_ID=:patientId`;
        const params = { patientId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see if a medicine is prescribed to a patient
router.post('/seeIfAMedicineHasBeenGivenToThisPatient', async (req, res) => {
    const{medicineName,patientId}=req.body;
    const medicineName1 = `%${medicineName}%`;
    try {
        const query = `SELECT M.MEDICINEID, M.MedicineName, M.Dosages, A.PATIENTDISEASE, P.FirstName || ' ' || P.LastName AS PatientName, CASE WHEN MG.APPOINTMENTID IS NOT NULL THEN 'Given' ELSE 'Not Given' END AS MedicineStatus FROM MEDICINES M LEFT JOIN MEDICINEGIVENLOG MG ON M.MedicineID = MG.MEDICINEID AND MG.PATIENTID =:patientId LEFT JOIN APPOINTMENT A ON MG.APPOINTMENTID = A.AppointmentID LEFT JOIN PATIENT P ON A.PATIENTID = P.PATIENT_ID WHERE LOWER(M.MedicineName) LIKE :medicineName1`;
        const params = { medicineName1,patientId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
router.post('/seeIfALabTestHasBeenGivenToThisPatient' , async (req, res) => {
    const{labTestName,patientId}=req.body;
    const labTestName1 = `%${labTestName}%`;
    try {
        const query = `SELECT LT.LABTESTID, LT.TestName, A.PATIENTDISEASE, P.FirstName || ' ' || P.LastName AS PatientName, CASE WHEN GLT.APPOINTMENTID IS NOT NULL THEN 'Given' ELSE 'Not Given' END AS LabTestStatus FROM LABTESTS LT LEFT JOIN GIVENLABTESTLOG GLT ON LT.LABTESTID = GLT.LABTESTID AND GLT.PATIENTID = :patientId LEFT JOIN APPOINTMENT A ON GLT.APPOINTMENTID = A.AppointmentID LEFT JOIN PATIENT P ON A.PATIENTID = P.PATIENT_ID WHERE LOWER(LT.TestName) LIKE :labTestName1`;
        const params = { labTestName1,patientId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
//show how many times a medicine has been given to a patient
router.post('/showHowManyTimesMedicinePrescribed' , async (req, res) => {
    const{medicineName}=req.body;
    const medicineName1 = `%${medicineName}%`;
    try {
        const query1='DECLARE BEGIN FILL_MEDICINE_COUNT;END;'
        const result1 = await db_query(query1, {});
        const query=`SELECT * FROM MEDICINECOUNT MC WHERE LOWER(MC.MEDICINENAME) LIKE :medicineName1`;
        const params = { medicineName1};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//show how many times a lab test has been given to a patient
router.post('/showHowManyTimesLabTestPrescribed' , async (req, res) => {
    const{testName}=req.body;
    const labTestName1 = `%${testName}%`;
    console.log(labTestName1);
    try {
        const query1='BEGIN FILL_LABTEST_COUNT; END;'
        const result=await db_query(query1, {});
        const query=`SELECT * FROM LOGLABTESTCOUNT LTT WHERE LOWER(LTT.TESTNAME) LIKE :labTestName1`;
        const params = { labTestName1};
        const result1 = await db_query(query,{labTestName1});
        console.log(result1);
        res.status(200).json(result1);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//show how many times a lab test has been completed
router.post('/showHowManyTimesALabTestHasBennConducted' , async (req, res) => {
    const{testName}=req.body;
    const labTestName1 = `%${testName}%`;
    try {
        const query1='BEGIN FILL_COMPLETED_LABTEST_COUNT; END;'
        const result=await db_query(query1, {});
        const query=`SELECT * FROM COMPLETEDLABTESTLOGCOUNT CLT WHERE LOWER(CLT.TESTNAME) LIKE  :labTestName1`;
        const params = { labTestName1};
        const result1 = await db_query(query,{labTestName1});
        console.log(result1);
        res.status(200).json(result1);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);


//previous info of appointment bill 

router.post('/previousInfo' , async (req, res) => {
    const {name, patientId} = req.body;
    //get patient name from patient id
    try{
        const query = `SELECT FirstName, LastName FROM PATIENT WHERE PATIENT_ID = :patientId`;
        const params = { patientId };
        const result=await db_query(query, params);
        console.log(result);
        //concatenate first name and last name
        const patientName = result[0].FIRSTNAME + ' ' + result[0].LASTNAME;
        //get previous info
        console.log(patientName);
        console.log(name);
        const patientName1 = `%${patientName}%`;
        const name1 = `%${name}%`;
        const query1=`SELECT * FROM APPOINTMENTINFOLOG APL WHERE APL.PATIENTNAME LIKE :patientName1 AND APL.DOCTORNAME LIKE :name1`;
        const params1 = { patientName1, name1 };
        const result2=await db_query(query1, params1);
        console.log(result2);
        res.status(200).json(result2);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//DOCTORS LAST 30 DAYS INCOME 

router.post('/viewMyLastMonthIncome', async (req, res) => {
    const{doctorId}=req.body;
    try {
        //fetch doctors name
        const query = `SELECT FirstName || ' ' || LastName AS DoctorName FROM DOCTOR WHERE DOCTORID = :doctorId`;
        const params = { doctorId };
        const result = await db_query(query, params);
        console.log(result);
        const doctorName = result[0].DOCTORNAME;
        //fetch doctors last month income
        const query1=`BEGIN CalculateDoctorEarnings; END;`
        const result1=await db_query(query1, {});
        const query2=`SELECT * FROM DOCTOREARNING DE WHERE DE.DOCTORNAME=:doctorName`;
        const params1 = { doctorName };
        const result2=await db_query(query2, params1);
        console.log(result2);
        res.status(200).json(result2);


    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//view highest number of appointments for a doctor with a patient
router.post('/viewMyHighestNumberOfAppointments' , async (req, res) => {
    const{doctorId}=req.body;
    try {
        const query = `BEGIN FindMaxAppointmentsForDoctor(:doctorId); END;`;
        const params = { doctorId };
        const result = await db_query(query, params);
        const query1=`SELECT * FROM MAXAPPOINTMENT`;
        const result1=await db_query(query1, {});
        console.log(result);
        res.status(200).json(result1);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//view from a patient with which doctor he has taken the highest number of appointments
router.post('/withWhichDoctorIHaveMostAppointment' , async (req, res) => {
    const{patientId}=req.body;
    try {
        const query = `BEGIN FindMaxAppointmentsForPatient(:patientId); END;`;
        const params = { patientId };
        const result = await db_query(query, params);
        const query1=`SELECT * FROM MAXAPPOINTMENTPATIENT`;
        const result1=await db_query(query1, {});
        console.log(result);
        res.status(200).json(result1);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);










//ptient side

router.post('/prescription/getPrescribedMedicinesOfRecent' , async (req, res) => {
    const{patientId}=req.body;
    try {
        const query = `SELECT P.FirstName || ' ' || P.LastName AS PatientName, D.FirstName || ' ' || D.LastName AS DoctorName, A.PATIENTDISEASE, PM.HOWTOTAKE, M.MedicineName, M.Dosages, M.SideEffects,A.APPOINTMENTDATE, A.APPOINTMENTID, P.PATIENT_ID, PS.PRESCRIPTIONID FROM PATIENT P JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID JOIN PRESCRIBEDMEDICINE PM ON PS.PrescriptionID = PM.PRESCRIPTIONID JOIN ALLMEDICINEPRESCRIBERMEDICINERELATION APR ON APR.PRESCRIBEDMEDICINEID=PM.PRESCRIBEDMEDICINEID JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID JOIN MEDICINES M ON APR.MedicineID = M.MedicineID WHERE PS.PRESCRIPTIONID = (SELECT MAX(PS.PRESCRIPTIONID) FROM PATIENT P JOIN APPOINTMENT A2 ON P.PATIENT_ID = A2.PATIENTID JOIN PRESCRIPTION PS ON A2.AppointmentID = PS.AppointmentID JOIN PRESCRIBEDMEDICINE PM ON PS.PrescriptionID = PM.PRESCRIPTIONID WHERE A2.PATIENTID=:patientId AND PS.PRESCRIPTION_STATUS='PAID') ORDER BY PatientName, DoctorName, A.PATIENTDISEASE`;
        const params = { patientId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see advices like wise
router.post('/prescription/getPrescribedAdvicesOfRecent' , async (req, res) => {
    const{patientId}=req.body;
    try {
        const query = `SELECT
        P.FirstName || ' ' || P.LastName AS PatientName,
        D.FirstName || ' ' || D.LastName AS DoctorName,
        A.APPOINTMENTDATE,
        A.PATIENTDISEASE,
            AD.ADVICETYPE,
            AD.ADVICETEXT,
            A.APPOINTMENTID,
            P.PATIENT_ID,
            PS.PRESCRIPTIONID
    FROM PATIENT P
    JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID
    JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID
    JOIN PRESCRIBEDADVICE PA ON PS.PrescriptionID = PA.PRESCRIPTIONID
    JOIN ADVICEPRESCRIBEDADVICERELATION APR ON APR.PRESCRIBEDADVICEID= PA.PRESCRIBEDADVICEID
    JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID
    JOIN ADVICES AD ON AD.ADVICEID=APR.ADVICEID
    WHERE PS.PRESCRIPTIONID =(
            SELECT MAX(PS.PRESCRIPTIONID)
            FROM PATIENT P
            JOIN APPOINTMENT A2 ON P.PATIENT_ID = A2.PATIENTID
            JOIN PRESCRIPTION PS ON A2.AppointmentID = PS.AppointmentID
            JOIN PRESCRIBEDMEDICINE PM ON PS.PrescriptionID = PM.PRESCRIPTIONID
            WHERE A2.PATIENTID=:patientId AND PS.PRESCRIPTION_STATUS='PAID'
    )
    ORDER BY PatientName, DoctorName, A.PATIENTDISEASE`;
        const params = { patientId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see lab tests like wise
router.post('/prescription/getPrescribedTestsOfRecent' , async (req, res) => {
    const{patientId}=req.body;
    try {
        const query = `SELECT
        P.FirstName || ' ' || P.LastName AS PatientName,
        D.FirstName || ' ' || D.LastName AS DoctorName,
        A.APPOINTMENTDATE,
        A.PATIENTDISEASE,
            LT.TESTNAME,
            LT.DESCRIPTION,
            A.APPOINTMENTID,
            P.PATIENT_ID,
            PS.PRESCRIPTIONID
    FROM PATIENT P
    JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID
    JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID
    JOIN PRESCRIBEDLABTEST PL  ON PS.PrescriptionID = PL.PRESCRIPTIONID
    JOIN PRESCRIBEDLABTESTALLLABTESTRELATION  PLA ON PLA.PRESCRIBEDLABTESTID= PL.PRESCRIBEDLABTESTID
    JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID
    JOIN LABTESTS LT ON LT.LABTESTID=PLA.LABTESTID
    WHERE PS.PRESCRIPTIONID =(
            SELECT MAX(PS.PRESCRIPTIONID)
            FROM PATIENT P
            JOIN APPOINTMENT A2 ON P.PATIENT_ID = A2.PATIENTID
            JOIN PRESCRIPTION PS ON A2.AppointmentID = PS.AppointmentID
            JOIN PRESCRIBEDMEDICINE PM ON PS.PrescriptionID = PM.PRESCRIPTIONID
            WHERE A2.PATIENTID=:patientId AND PS.PRESCRIPTION_STATUS='PAID'
    )
    ORDER BY PatientName, DoctorName, A.PATIENTDISEASE`;
        const params = { patientId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see completed lab tests
router.post('/prescription/getCompletedTestResultsOfRecent' , async (req, res) => {
    const{patientId}=req.body;
    try {
        const query = `SELECT
        P.FirstName || ' ' || P.LastName AS PatientName,
        D.FirstName || ' ' || D.LastName AS DoctorName,
        A.APPOINTMENTDATE,
        A.PATIENTDISEASE,
            LT.TESTNAME,
            LT.DESCRIPTION,
            R.RESULTDETAILS,
            R.RESULTDATE,
            A.APPOINTMENTID,
            P.PATIENT_ID,
            PS.PRESCRIPTIONID
    FROM PATIENT P
    JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID
    JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID
    JOIN PRESCRIBEDLABTEST PL  ON PS.PrescriptionID = PL.PRESCRIPTIONID
    JOIN RESULT R ON R.PRESCRIBEDLABTESTID=PL.PRESCRIBEDLABTESTID
    JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID
    JOIN LABTESTS LT ON LT.LABTESTID=R.LABTESTID
    WHERE PS.PRESCRIPTIONID =(
            SELECT MAX(PS.PRESCRIPTIONID)
            FROM PATIENT P
            JOIN APPOINTMENT A2 ON P.PATIENT_ID = A2.PATIENTID
            JOIN PRESCRIPTION PS ON A2.AppointmentID = PS.AppointmentID
            JOIN PRESCRIBEDMEDICINE PM ON PS.PrescriptionID = PM.PRESCRIPTIONID
            WHERE A2.PATIENTID=:patientId AND PS.PRESCRIPTION_STATUS='PAID'
    )
    ORDER BY PatientName, DoctorName, A.PATIENTDISEASE`;
        const params = { patientId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

router.post('/prescription/getAllPrescribedMedicines' , async (req, res) => {
    const{patientId}=req.body;
    try {
        const query = `SELECT
        P.FirstName || ' ' || P.LastName AS PatientName,
        D.FirstName || ' ' || D.LastName AS DoctorName,
        A.APPOINTMENTDATE,
        A.PATIENTDISEASE,
        PM.HOWTOTAKE,
        M.MedicineName,
        M.Dosages,
        M.SideEffects,
            A.APPOINTMENTID,
            P.PATIENT_ID,
            PS.PRESCRIPTIONID
    FROM PATIENT P
    JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID
    JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID
    JOIN PRESCRIBEDMEDICINE PM ON PS.PrescriptionID = PM.PRESCRIPTIONID
    JOIN ALLMEDICINEPRESCRIBERMEDICINERELATION APR ON APR.PRESCRIBEDMEDICINEID=PM.PRESCRIBEDMEDICINEID
    JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID
    JOIN MEDICINES M ON APR.MedicineID = M.MedicineID
    WHERE A.PATIENTID=:patientId AND PS.PRESCRIPTION_STATUS='PAID'`;
        const params = { patientId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

router.post('/prescription/getAllPrescribedAdvices' , async (req, res) => {
    const{patientId}=req.body;
    try {
        const query = `SELECT
        P.FirstName || ' ' || P.LastName AS PatientName,
        D.FirstName || ' ' || D.LastName AS DoctorName,
        A.APPOINTMENTDATE,
        A.PATIENTDISEASE,
            AD.ADVICETYPE,
            AD.ADVICETEXT,
            A.APPOINTMENTID,
            P.PATIENT_ID,
            PS.PRESCRIPTIONID
    FROM PATIENT P
    JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID
    JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID
    JOIN PRESCRIBEDADVICE PA ON PS.PrescriptionID = PA.PRESCRIPTIONID
    JOIN ADVICEPRESCRIBEDADVICERELATION APR ON APR.PRESCRIBEDADVICEID= PA.PRESCRIBEDADVICEID
    JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID
    JOIN ADVICES AD ON AD.ADVICEID=APR.ADVICEID
    WHERE A.PATIENTID=:patientId AND PS.PRESCRIPTION_STATUS='PAID'`;
        const params = { patientId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);


//show all prescibed lab tests
router.post('/prescription/getAllPrescribedTests' , async (req, res) => {
    const{patientId}=req.body;
    try {
        const query = `SELECT
        P.FirstName || ' ' || P.LastName AS PatientName,
        D.FirstName || ' ' || D.LastName AS DoctorName,
        A.APPOINTMENTDATE,
        A.PATIENTDISEASE,
            LT.TESTNAME,
            LT.DESCRIPTION,
            A.APPOINTMENTID,
            P.PATIENT_ID,
            PS.PRESCRIPTIONID
    FROM PATIENT P
    JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID
    JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID
    JOIN PRESCRIBEDLABTEST PL  ON PS.PrescriptionID = PL.PRESCRIPTIONID
    JOIN PRESCRIBEDLABTESTALLLABTESTRELATION  PLA ON PLA.PRESCRIBEDLABTESTID= PL.PRESCRIBEDLABTESTID
    JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID
    JOIN LABTESTS LT ON LT.LABTESTID=PLA.LABTESTID
    WHERE A.PATIENTID=:patientId AND PS.PRESCRIPTION_STATUS='PAID'`;
        const params = { patientId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

router.post('/prescription/getAllCompletedTestResults' , async (req, res) => {
    const{patientId}=req.body;
    try {
        const query = `SELECT
        P.FirstName || ' ' || P.LastName AS PatientName,
        D.FirstName || ' ' || D.LastName AS DoctorName,
        A.APPOINTMENTDATE,
        A.PATIENTDISEASE,
            LT.TESTNAME,
            LT.DESCRIPTION,
            R.RESULTDETAILS,
            R.RESULTDATE,
            A.APPOINTMENTID,
            P.PATIENT_ID,
            PS.PRESCRIPTIONID
    FROM PATIENT P
    JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID
    JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID
    JOIN PRESCRIBEDLABTEST PL  ON PS.PrescriptionID = PL.PRESCRIPTIONID
    JOIN RESULT R ON R.PRESCRIBEDLABTESTID=PL.PRESCRIBEDLABTESTID
    JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID
    JOIN LABTESTS LT ON LT.LABTESTID=R.LABTESTID
    WHERE A.PATIENTID=:patientId AND PS.PRESCRIPTION_STATUS='PAID'`;
        const params = { patientId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

// on a given date 

router.post('/prescription/getPrescribedMedicineOnGivenAppointmentDate' , async (req, res) => {
    const{patientId,appointmentDate}=req.body;
    console.log(appointmentDate);
    try {
        const query = `SELECT
        P.FirstName || ' ' || P.LastName AS PatientName,
        D.FirstName || ' ' || D.LastName AS DoctorName,
        A.APPOINTMENTDATE,
        A.PATIENTDISEASE,
        PM.HOWTOTAKE,
        M.MedicineName,
        M.Dosages,
        M.SideEffects,
        A.APPOINTMENTID,
        P.PATIENT_ID,
        PS.PRESCRIPTIONID
    FROM PATIENT P
    JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID
    JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID
    JOIN PRESCRIBEDMEDICINE PM ON PS.PrescriptionID = PM.PRESCRIPTIONID
    JOIN ALLMEDICINEPRESCRIBERMEDICINERELATION APR ON APR.PRESCRIBEDMEDICINEID = PM.PRESCRIBEDMEDICINEID
    JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID
    JOIN MEDICINES M ON APR.MedicineID = M.MedicineID
    WHERE
        A.PATIENTID = :patientId
        AND TRUNC(A.APPOINTMENTDATE) = TO_DATE(:appointmentDate, 'DD-Mon-YYYY')
        AND PS.PRESCRIPTION_STATUS = 'PAID'
    `;
        const params = { patientId,appointmentDate};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

// on a given date see advices
 
router.post('/prescription/getPrescribedAdvicesOnGivenAppointmentDate' , async (req, res) => {
    const{patientId,appointmentDate}=req.body;
    try {
        const query = `SELECT
        P.FirstName || ' ' || P.LastName AS PatientName,
        D.FirstName || ' ' || D.LastName AS DoctorName,
        A.APPOINTMENTDATE,
        A.PATIENTDISEASE,
            AD.ADVICETYPE,
            AD.ADVICETEXT,
            A.APPOINTMENTID,
            P.PATIENT_ID,
            PS.PRESCRIPTIONID
    FROM PATIENT P
    JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID
    JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID
    JOIN PRESCRIBEDADVICE PA ON PS.PrescriptionID = PA.PRESCRIPTIONID
    JOIN ADVICEPRESCRIBEDADVICERELATION APR ON APR.PRESCRIBEDADVICEID= PA.PRESCRIBEDADVICEID
    JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID
    JOIN ADVICES AD ON AD.ADVICEID=APR.ADVICEID
    WHERE A.PATIENTID=:patientId AND  TRUNC(A.APPOINTMENTDATE) = TO_DATE(:appointmentDate, 'DD-Mon-YYYY') AND PS.PRESCRIPTION_STATUS='PAID'`;
        const params = { patientId,appointmentDate};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see lab tests on a given date

router.post('/prescription/getPrescribedTestsOnGivenAppointmentDate' , async (req, res) => {
    const{patientId,appointmentDate}=req.body;
    try {
        const query = `SELECT
        P.FirstName || ' ' || P.LastName AS PatientName,
        D.FirstName || ' ' || D.LastName AS DoctorName,
        A.APPOINTMENTDATE,
        A.PATIENTDISEASE,
            LT.TESTNAME,
            LT.DESCRIPTION,
            A.APPOINTMENTID,
            P.PATIENT_ID,
            PS.PRESCRIPTIONID
    FROM PATIENT P
    JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID
    JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID
    JOIN PRESCRIBEDLABTEST PL  ON PS.PrescriptionID = PL.PRESCRIPTIONID
    JOIN PRESCRIBEDLABTESTALLLABTESTRELATION  PLA ON PLA.PRESCRIBEDLABTESTID= PL.PRESCRIBEDLABTESTID
    JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID
    JOIN LABTESTS LT ON LT.LABTESTID=PLA.LABTESTID
    WHERE A.PATIENTID=:patientId AND TRUNC(A.APPOINTMENTDATE) = TO_DATE(:appointmentDate, 'DD-Mon-YYYY') AND PS.PRESCRIPTION_STATUS='PAID'`;
        const params = { patientId,appointmentDate};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
//see completed lab tests on a given date
router.post('/prescription/getCompletedTestResultsOnGivenAppointmentDate' , async (req, res) => {
    const{patientId,appointmentDate}=req.body;
    try {
        const query = `SELECT
        P.FirstName || ' ' || P.LastName AS PatientName,
        D.FirstName || ' ' || D.LastName AS DoctorName,
        A.APPOINTMENTDATE,
        A.PATIENTDISEASE,
            LT.TESTNAME,
            LT.DESCRIPTION,
            R.RESULTDETAILS,
            R.RESULTDATE,
            A.APPOINTMENTID,
            P.PATIENT_ID,
            PS.PRESCRIPTIONID
    FROM PATIENT P
    JOIN APPOINTMENT A ON P.PATIENT_ID = A.PATIENTID
    JOIN PRESCRIPTION PS ON A.AppointmentID = PS.AppointmentID
    JOIN PRESCRIBEDLABTEST PL  ON PS.PrescriptionID = PL.PRESCRIPTIONID
    JOIN RESULT R ON R.PRESCRIBEDLABTESTID=PL.PRESCRIBEDLABTESTID
    JOIN DOCTOR D ON A.DOCTORID = D.DOCTORID
    JOIN LABTESTS LT ON LT.LABTESTID=R.LABTESTID
    WHERE A.PATIENTID=:patientId AND TRUNC(A.APPOINTMENTDATE) = TO_DATE(:appointmentDate, 'DD-Mon-YYYY') AND PS.PRESCRIPTION_STATUS='PAID'`;
        const params = { patientId,appointmentDate};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//unpaid amount of a patient
router.post('/unpaidAmount' , async (req, res) => {
    const{patientId}=req.body;
    try {
        const query = `SELECT
        NVL(SUM(LB.COST), 0) AS LABCOST,
        NVL(SUM(DB.DOCTORCOST), 0) AS DOCTORCOST,
        NVL(SUM(LB.COST), 0) + NVL(SUM(DB.DOCTORCOST), 0) AS TOTALCOST,
        A.APPOINTMENTID,
        A.PATIENTID,
        (SELECT FIRSTNAME || ' ' || LASTNAME
         FROM PATIENT
         WHERE PATIENT_ID = A.PATIENTID) AS PATIENTNAME
    FROM
        APPOINTMENT A
    JOIN
        PRESCRIPTION P ON A.APPOINTMENTID = P.APPOINTMENTID
    LEFT JOIN
        (SELECT PRESCRIPTIONID, SUM(COST) AS COST
         FROM LABBILL
         GROUP BY PRESCRIPTIONID) LB ON LB.PRESCRIPTIONID = P.PRESCRIPTIONID
    LEFT JOIN
        (SELECT PRESCRIPTIONID, SUM(DOCTORCOST) AS DOCTORCOST
         FROM DOCTORBILL
         GROUP BY PRESCRIPTIONID) DB ON DB.PRESCRIPTIONID = P.PRESCRIPTIONID
    WHERE
        A.PATIENTID = :patientId AND P.PRESCRIPTION_STATUS = 'UNPAID'
    GROUP BY
        A.PATIENTID,
        A.APPOINTMENTID
    HAVING(NVL(SUM(LB.COST), 0) + NVL(SUM(DB.DOCTORCOST), 0)) > 0`;
        const params = { patientId};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//see all doctors income
router.get('/viewAllDoctorsIncome', async (req, res) => {
    try {
        const query1=`BEGIN
        CalculateDoctorEarnings;
        END;`;
        const result1=await db_query(query1, {});

        const query = `SELECT DOCTORNAME,EARNING FROM DOCTOREARNING`;
        const result
        = await db_query(query, {});
        console.log(result);
        res.status(200).json(result);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

//add a new Advice

router.post('/insertNewAdvice' , async (req, res) => {
    const{adviceType,adviceText}=req.body;
    try {
        const query = `INSERT INTO ADVICES (ADVICEID,ADVICETYPE,ADVICETEXT) VALUES (SEQ_ADVICE_ID.NEXTVAL,:adviceType,:adviceText)`;
        const params = { adviceType,adviceText};
        const result = await db_query(query, params);
        console.log(result);
        res.status(200).json({ message: 'Advice Added Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);
module.exports = app;
module.exports = router;




