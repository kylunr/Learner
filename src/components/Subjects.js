import React, { useEffect, useState } from 'react';
import './Subjects.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import db from '../firebase';

function Subjects() {

    // Get user from Google Firebase
    const user = useSelector(selectUser);
    // Set state as subjects array
    let [subjects, setSubjects] = useState([]);

    /**
     * Retrieves the user's subjects from the
     * database before the page is rendered
     */
    useEffect(() => {
        getUserSubjects();
    }, []);

    /**
     * Allows user to create a new subject, subject
     * is stored in database
     * 
     * TODO:
     *  - Set maximum and minimum length 
     *  - Browser pop-up when input error (empty or too long)
     */
    const createSubject = () => {

        // If the user is submitting empty subject return
        if (document.getElementById("create_form").value === "") {
            return;
        } 
        // If the user is submitting a form that is too long
        else if (document.getElementById("create_form").value.length > 50) {
            return;
        }

        // Create a string for new subjects and add old subjects to string
        let newSubjects = "";
        subjects.forEach(element => newSubjects += (element + "$$"));

        // Add the new subject to string
        newSubjects += document.getElementById("create_form").value;

        // Clear the form
        document.getElementById("create_form").value = "";

        // Update the database with new subjects
        db.collection("users").doc(user.email).update({
            subjects: newSubjects
        })
        .then(function() {
            console.log("Document successfully written");
        })
        .catch(function(error) {
            console.error("Error updating document: ", error);
        });
    }

    /**
     * Gets the user's subjects from the database
     * 
     * TODO:
     *  - Delete duplicate objects
     *  - Alert for similar subjects?
     */
    const getUserSubjects = () => {
        // Getting the user's database document
        var docRef = db.collection("users").doc(user.email);

        // Get live updates of user's document using onSnapshot
        docRef.onSnapshot(function(doc) {
            // If the document exists
            if (doc.exists) {
                // Read the data into the state array
                let document = doc.data();
                if (!(document.subjects === "")) {
                    setSubjects(document.subjects.split('$$'));
                } 
            } 
            // If the document does not exist
            else {
                // Create a document for the user
                setSubjects("");

                db.collection("users").doc(user.email).set({
                    subjects: ""
                })
                .then(function() {
                    console.log("Document successfully written");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
            }
        });
    }

    /**
     * Deletes the subjects from the screen and removes
     * the subject from the database
     * 
     * @param {*} event 
     */
    const deleteSubject = (event) => {

        // Records number of subjects
        let numberOfSubjects = subjects.length;

        // If there is only one element left
        if (numberOfSubjects === 1) {
            // Set state array to be empty
            setSubjects([]);
            numberOfSubjects = 0;
        } else {
            // Get index of subject
            var index = subjects.indexOf(event.target.id);
            // Remove it from the state array
            if (index !== -1) {
                setSubjects(subjects.splice(index, 1));
                numberOfSubjects -= 1;
            } 
        }

        let newSubjects = "";

        // If there is still subjects
        if (numberOfSubjects > 0) {
            // Add them to string to send to database
            subjects.forEach(element => newSubjects += (element + "$$"));
            newSubjects = newSubjects.substring(0, newSubjects.length - 2);
        }

        // Send updated list to database
        db.collection("users").doc(user.email).update({
            subjects: newSubjects
        })
        .then(function() {
            console.log("Document successfully written");
        })
        .catch(function(error) {
            console.error("Error updating document: ", error);
        });
    }

    return (
        <div className="subjects">
        {/* Button for user to create new subjects */}

        <div className="form">
            <form>
                <input id="create_form" className="create_form" type="text" placeholder="Create a new subject..."/>
            </form>
            <h2 className="submit_button" onClick={createSubject}>Submit</h2>
        </div>

        <div className="subject_section" id="subject_section">
            {subjects.map((subject, idx) => 
                <div key={idx} className="subject_items">
                    <h3 className="subject_name">{subject}</h3>
                    <div className="delete_button" id={subject} onClick={deleteSubject}>X</div>
                </div>
            )}
        </div>
    </div>
    );
}

export default Subjects;