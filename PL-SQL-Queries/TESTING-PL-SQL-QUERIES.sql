--TESTING PL/SQL QUERIES 
--7
--SEE PATIENTPREVIOUSDISEASES
UPDATE PATIENT SET DISEASE='NewDisease2' WHERE PATIENT_ID=1;
SELECT* FROM PATIENTPREVIOUSDISEASES WHERE PATIENT_ID=1;
--9
--doctor will see if a specific medicine has been given or NOT
SELECT
    M.MEDICINEID,
    M.MedicineName,
    M.Dosages,
    A.PATIENTDISEASE,
    P.FirstName || ' ' || P.LastName AS PatientName,
    CASE
        WHEN MG.APPOINTMENTID IS NOT NULL THEN 'Given'
        ELSE 'Not Given'
    END AS MedicineStatus
FROM
    MEDICINES M
LEFT JOIN
    MEDICINEGIVENLOG MG ON M.MedicineID = MG.MEDICINEID AND MG.PATIENTID = 1
LEFT JOIN
    APPOINTMENT A ON MG.APPOINTMENTID = A.AppointmentID
LEFT JOIN
    PATIENT P ON A.PATIENTID = P.PATIENT_ID
WHERE
    LOWER(M.MedicineName) LIKE '%xe%';
--10
--doctor will see if a specific lab test have been given or not 
SELECT
    LT.LABTESTID,
    LT.TestName,
    A.PATIENTDISEASE,
    P.FirstName || ' ' || P.LastName AS PatientName,
    CASE
        WHEN GLT.APPOINTMENTID IS NOT NULL THEN 'Given'
        ELSE 'Not Given'
    END AS LabTestStatus
FROM
    LABTESTS LT
LEFT JOIN
    GIVENLABTESTLOG GLT ON LT.LABTESTID = GLT.LABTESTID AND GLT.PATIENTID = 1
LEFT JOIN
    APPOINTMENT A ON GLT.APPOINTMENTID = A.AppointmentID
LEFT JOIN
    PATIENT P ON A.PATIENTID = P.PATIENT_ID
WHERE
    LOWER(LT.TestName) LIKE '%x%';
		
--11
--see from admin how many times a medicine has been prescribed 
DECLARE
BEGIN
FILL_MEDICINE_COUNT;
END;

--CHECK 
SELECT * FROM MEDICINECOUNT MC WHERE LOWER(MC.MEDICINENAME) LIKE '%pa%';

--12
--see from admin how many times a lab test has been prescribed 
BEGIN
FILL_LABTEST_COUNT;
END;
SELECT * FROM LOGLABTESTCOUNT LTT WHERE LOWER(LTT.TESTNAME) LIKE '%x%' 

--13
--see from admin how many times a lab test has been conducted
BEGIN
FILL_COMPLETED_LABTEST_COUNT;
END;

SELECT * FROM COMPLETEDLABTESTLOGCOUNT CLT WHERE LOWER(CLT.TESTNAME) LIKE 

--14,15
--see from patient how many times he has taken APPOINTMENT with a doctor 
SELECT * FROM APPOINTMENTINFOLOG APL ON APL.PATIENTNAME= AND APL.DOCTORNAME=:name

--16
--see from doctors side his income last month 
BEGIN
CalculateDoctorEarnings;
END;
SELECT DOCTORNAME,EARNING FROM DOCTOREARNING WHERE

--17
--see from doctors side witch which patienth he has done most APPOINTMENT
BEGIN
FindMaxAppointmentsForDoctor(7);
END;
SELECT * FROM MAXAPPOINTMENT;

--18
--see from PATIENT side with doctor he has done most APPOINTMENT
BEGIN
FindMaxAppointmentsForPatient(1);
END;
SELECT * FROM MAXAPPOINTMENTPATIENT;