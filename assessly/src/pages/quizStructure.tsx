import sideImg from '../assets/Quiz_Structure_Graphic.png';
import questionMark from '../assets/Question_Mark.png';
import greenBackground from '../assets/Green_Box.png';
import backArrow from '../assets/Caret_Left.png';

import '../styles/quizStructure.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import {ToggleButton} from './ToggleButton';


function QuizStructure() {
    const structureQuestions = [
    {id: 1, title: "Which course quizzes would you like the quiz to be based on?", },
    {id: 2, title: "Which content would like to be included in the quiz?"},
    {id: 3, title: "Quiz Structure"},
    {id: 4, title: "AI Prompting"}
    ]
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    function incrementIndex() {
        setIndex((prevIndex) => {
            if (prevIndex >= structureQuestions.length - 1) {
                return prevIndex;
            }
            return prevIndex + 1;
        });
    }

    function decrementIndex() {
        setIndex((prevIndex) => {
            if (prevIndex <= 0) {
                return prevIndex;
            }
            return prevIndex - 1;
        });
    }

    function getQuizQuestionContent() {
        //Choose Canvas Quizzes 
        if (index === 0) {
            return (
            <div>
                <p>index = 0</p>
                <label >
                    <input type="checkbox" 
                    // checked={course.isChecked} 
                    // onChange={() => handleCheckboxChange(index)}/>
                    />
                    Quiz 1: Time Complexity Analysis 
                </label>
            </div>
            );
        }
        //Choose Canvas materials 
        else if (index === 1) {
            return (
                null
            );
        }
        //Quiz Qualities 
        else if (index === 2) {
            return (
                null
            );
        }
        //AI Prompt 
        else {
            return (
                <div>
                    <div>
                        <p>Enable image generation</p>
                    </div>
                    <div>
                        <p>Additional prompting notes</p>
                    </div>
                </div>
            );
        }

        return null;
    }

    return (
    <div className='page'>
        <div className="top-bar">
            <h2 className="top-bar-text" onClick={() => navigate('/dashboard')}>ASSESSLY</h2>
            <img src={questionMark} alt="Help button" className="top-bar-help"/>
        </div>
        <hr></hr>
        <div className="content">
            <div className="left">
                <img src={backArrow} className="back-arrow" alt="Back button"/>
                <div className="image-container-white">
                    <img src={sideImg} className="quiz-img" alt="Quiz Structure Image"/>
                </div>
            </div>
        
            <div className="questions-container">
                <img src={greenBackground} className="green-background" alt="Green Background"/>
                <div className="questions">
                    <p className="question-num">{structureQuestions[index].id}/{structureQuestions.length}</p>
                    <h3 className="question-text">{structureQuestions[index].title}</h3>
                    {getQuizQuestionContent()}
                    
                    {/* For button displays: back and next */}
                    {index === 0 ?
                        <div className="buttons" style={{display: "flex", justifyContent: "flex-end"}}>
                            <button className="button-next" onClick={() => incrementIndex()}>Next</button>
                        </div>     
                        :
                        <div className="buttons">
                            <button className="button-back" onClick={() => decrementIndex()}>Back</button>
                            <button className="button-next" onClick={() => incrementIndex()}>Next</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>
    );
}
export default QuizStructure;