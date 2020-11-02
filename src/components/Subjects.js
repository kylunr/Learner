import React, { useEffect, useState } from 'react';
import './Subjects.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import db from '../firebase';

function Subjects() {

    // Get user from Google Firebase
    const user = useSelector(selectUser);
    let [subjects, setSubjects] = useState([]);

    useEffect(() => {
        getUserSubjects();
    }, []);

    // Function used to prompt the user to create a new 
    // subject by entering a name
    const createSubject = () => {

        if (document.getElementById("create_form").value === "") {
            return;
        }

        let newSubjects = "";

        subjects.forEach(element => newSubjects += (element + "$$"));

        newSubjects += document.getElementById("create_form").value;

        document.getElementById("create_form").value = "";

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

    // Function used to get the user's subjects from 
    // Firestore db
    const getUserSubjects = () => {
        var docRef = db.collection("users").doc(user.email);

        docRef.onSnapshot(function(doc) {
            if (doc.exists) {
                let document = doc.data();
                if (!(document.subjects === "")) {
                    setSubjects(document.subjects.split('$$'));
                } 
            } else {
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

    const deleteSubject = (event) => {

        if (subjects.length === 1) {
            setSubjects([]);
        } else {
            var index = subjects.indexOf(event.target.id);

            if (index !== -1) {
                setSubjects(subjects.splice(index, 1));
            } 
        }

        let newSubjects = "";

        if (subjects.length > 0) {
            subjects.forEach(element => newSubjects += (element + "$$"));
            newSubjects = newSubjects.substring(0, newSubjects.length - 2);
        }
        
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