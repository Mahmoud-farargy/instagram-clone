import React, {Fragment, useState, useContext, useEffect} from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { firebase } from "../../../Config/firebase";
import {AppContext} from "../../../Context";
import {BiEdit} from "react-icons/bi";

const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
  };
  const useStyles = makeStyles({
    root: {
      margin:"0 auto",
      display: 'flex',
      alignItems: 'center',
    },
  });
  const CssTextField = withStyles({
    root: {
      width:"90%",
      '& label.Mui-focused': {
        color: '#0095f6',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#0095f6',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'red',
        },
        '&:hover fieldset': {
          borderColor: 'yellow',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#0095f6',
        },
      },
    },
  })(TextField);
const Extra = () => {
    const [rate, setRate] = useState(0);
    const [hover, setHover] = useState(-1);
    const [isSubmitted, setSubmissionState] = useState(false);
    const [reviewTxt, setReviewTxt] = useState("");
    const [hasRated, setHasRated] = useState(false);
    const classes = useStyles();
    const isValid = (rate !== 0 || rate);
    const {receivedData, notify}= useContext(AppContext);

    const onRatingSubmission = (d) => {
      d.preventDefault();
      setSubmissionState(true);
      if(!isValid){
        return;
      }
      const refToDatabase = firebase.database().ref("/rating/" + receivedData?.uid);
      const objectToSubmit = {
         name: receivedData?.userName,
         uid: receivedData?.uid,
         ratingOutOfFive: rate,
         review: reviewTxt,
         label: labels[hover !== -1 ? hover : rate],
         date: firebase.database.ServerValue.TIMESTAMP
      }
      refToDatabase.set(objectToSubmit).then((f) => {
        setHasRated(true);
        notify("Thanks for your feedback.","success");
      });
    }
    useEffect(() => {
      if(receivedData && Object.keys(receivedData).length > 0){
        firebase?.database() &&  firebase.database().ref(`/rating/${receivedData?.uid}`).once('value').then((snapshot) => {
            if(snapshot.val() && snapshot.val()?.uid){
               setHasRated(true);
               setRate( snapshot.val()?.ratingOutOfFive ? snapshot.val()?.ratingOutOfFive : 2 );
               setReviewTxt( snapshot.val()?.review ? snapshot.val()?.review : "" );
               
            }else{
              setHasRated(false);
              setRate(0);
              setReviewTxt("");
            }
          });
      }
     
    },[]);
    return (
        <Fragment >
              <div id="feedback">
                  <div className="option--container flex-column">
                  <form onSubmit={(z) => onRatingSubmission(z)}
                  style={{
                    backgroundColor: hasRated ? "rgb(245, 245, 245)" : "inherit",
                    // opacity: hasRated ? "0.5" : "1"
                  }} className="feedback--section flex-column">
                   { hasRated && <button title="Edit" onClick={() => setHasRated(false)} className="rating__edit__btn"><BiEdit /></button> } 
                    <div className="top--feedback--text">
                      {
                        !hasRated ?
                        <div>
                          <h3>Enjoy Voxgram? </h3>
                          <p>Tap a star to rate it based on your experience </p>
                        </div>
                        :
                        <div>
                          <h3>Your rating was submitted.</h3>
                        </div>
                      }  
                    </div>
                 
                    <div className={`rating--box ${classes.root}`}>

                              <Rating
                                  name="hover-feedback"
                                  value={rate}
                                  precision={0.5}
                                  defaultChecked
                                  disabled={hasRated}
                                  onChange={(_, newValue) => {
                                    setRate(newValue);
                                  }}
                                  onChangeActive={(_, newHover) => {
                                  setHover(newHover);
                                  }}
                              />
                              {rate !== null && <Box ml={2}>{labels[hover !== -1 ? hover : rate]}</Box>}
                             { isSubmitted && (!isValid)  && <p className="text-danger">Rating is required.</p>  } 
                    </div>
                          
                 <CssTextField
                      className={classes.margin}
                      id="custom-css-standard-input"
                      label="Review (Optional)"
                      multiline
                      rows={12}
                      disabled={hasRated}
                      defaultValue={reviewTxt}
                      placeholder="Your opinion matters. Tell me your experience with the app and how can I make it better or if you faced any bug so I can work on it."
                      onChange={(k) => setReviewTxt(k.target.value)} />
                   
                      <div className="form--btns flex-row">
                                    <input
                                      type="submit"
                                      value="Submit"
                                      disabled={(!rate || hasRated )}
                                      className={
                                        (!rate || hasRated)
                                          ? "disabled profile__btn prof__btn__followed mb-2"
                                          : "profile__btn prof__btn__followed mb-2"
                                      }
                                    />
                                   
                      </div>
                    
                  </form>
                    
                      
                  </div>
              </div>
        </Fragment>
    )
}
export default Extra;