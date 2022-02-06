import React, { Fragment, useState, useContext, useEffect, useRef } from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { firebase } from "../../../Config/firebase";
import { AppContext } from "../../../Context";
import { BiEdit } from "react-icons/bi";
import loadingGif from "../../../Assets/loadingGif.gif";

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
    margin: "0 auto",
    display: 'flex',
    alignItems: 'center',
  },
});
const CssTextField = withStyles({
  root: {
    width: "90%",
    '& label.Mui-focused': {
      color: 'var(--secondary-clr)',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'var(--secondary-clr)',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red',
      },
      '&:hover fieldset': {
        borderColor: 'yellow',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--secondary-clr)',
      },
    },
  },
})(TextField);
const Extra = () => {
  const [isLoading, setLoading] = useState(false);
  const [rate, setRate] = useState(0);
  const [hover, setHover] = useState(-1);
  const [isSubmitted, setSubmissionState] = useState(false);
  const [reviewTxt, setReviewTxt] = useState("");
  const [hasRated, setHasRated] = useState(false);
  const _isMounted = useRef(true);
  const classes = useStyles();
  const isValid = (rate !== 0 || rate);
  const { receivedData, notify, handleRealTimeState } = useContext(AppContext);

  const onRatingSubmission = (d) => {
    d.preventDefault();
    setSubmissionState(true);
    if (!isValid) {
      return;
    }
    setLoading(true);
    const refToDatabase = firebase.database().ref("/rating/" + receivedData?.uid);
    const objectToSubmit = {
      name: receivedData?.userName,
      uid: receivedData?.uid,
      ratingOutOfFive: rate,
      review: reviewTxt,
      label: labels[hover !== -1 ? hover : rate],
      date: firebase.database.ServerValue.TIMESTAMP
    }
    refToDatabase.set(objectToSubmit).then(() => {
      if (_isMounted?.current) {
        setLoading(false);
        setHasRated(true);
        notify("Thanks for your feedback.", "success");
      }
    }).catch(() => {
      if (_isMounted?.current) {
        setLoading(false);
        notify("An error occurred while submitting your feedback. Please try again later.", "error");
      }
    });
  }
  useEffect(() => {
    setLoading(true);
    handleRealTimeState(`/rating/${receivedData?.uid}`).then((returnedData) => {
      if (_isMounted?.current) {
        setLoading(false);
        if (returnedData && returnedData?.uid) {
          setHasRated(true);
          setRate(returnedData?.ratingOutOfFive ? returnedData?.ratingOutOfFive : 2);
          setReviewTxt(returnedData?.review ? returnedData?.review : "");
        } else {
          setHasRated(false);
          setRate(0);
          setReviewTxt("");
        }
      }
    }).catch(() => {
      if (_isMounted?.current) {
        setLoading(false);
      }
    });
    return () => _isMounted.current = false;
  }, []);
  return (
    <Fragment >
      <div id="feedback" className="fadeEffect">
        {
          isLoading ?
            <div className="loading--box">
              <img src={loadingGif} loading="lazy"  alt="loading" />
            </div>
            :
            <div className="option--container flex-column">
              <form onSubmit={(z) => onRatingSubmission(z)}
                style={{
                  backgroundColor: hasRated ? "var(--shadow-white)" : "inherit"
                }} className="feedback--section flex-column">
                {hasRated && <button title="Edit" onClick={() => setHasRated(false)} className="rating__edit__btn"><BiEdit /></button>}
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
                  {isSubmitted && (!isValid) && <p className="text-danger">Rating is required.</p>}
                </div>

                <CssTextField
                  className={classes.margin}
                  id="custom-css-standard-input"
                  label="Review (Optional)"
                  multiline
                  rows={12}
                  disabled={hasRated}
                  defaultValue={reviewTxt}
                  spellCheck="true"
                  placeholder="Your opinion matters. Tell me your experience with the app and how can I make it better or if you faced any bug so I can work on it."
                  onChange={(k) => setReviewTxt(k.target.value)} />

                <div className="form--btns flex-row">
                  <input
                    type="submit"
                    value="Submit"
                    disabled={(!rate || hasRated)}
                    className={
                      (!rate || hasRated)
                        ? "disabled profile__btn primary__btn mb-2"
                        : "profile__btn primary__btn mb-2"
                    }
                  />

                </div>

              </form>
            </div>
        }

      </div>
    </Fragment>
  )
}
export default Extra;