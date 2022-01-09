import React, { PureComponent } from "react";
import Auxiliary from "../../../Components/HOC/Auxiliary";
import "./TweetPhase.scss";
import { updateObject } from "../../../Utilities/Utility";
import { AppContext } from "../../../Context";
import * as Consts from "../../../Utilities/Consts";
import { withRouter } from "react-router-dom";

class TweetPhase extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            textValue: "",
            maxCharactersLimit: 280,
            currentLimit: 280,
            submitted: false,
            error: { show: false, msg: "" },
            loading: false
        }
        this._isMounted = true;
    }
    static contextType = AppContext;

    onInputChange(e) {
        const { state } = this;
        const val = e.target.value;
        this.setState({
            ...state,
            textValue: e.target.value,
            currentLimit: state.maxCharactersLimit - val?.split("")?.length
        });
    }
    componentDidUpdate(_, prevState) {
        if (prevState.currentLimit !== this.state.currentLimit) {
            const { textValue, currentLimit, maxCharactersLimit } = this.state;
            if (textValue) {
                if (currentLimit < maxCharactersLimit && currentLimit >= 0) {
                    this.setState(updateObject(this.state, { error: { show: false, msg: "" } }));
                } else if (currentLimit < 0) {
                    const calcDiff = 0 - currentLimit;
                    this.setState(updateObject(this.state, { error: { show: true, msg: `Max charaters limit exceeded. Cut at least ${calcDiff} ${calcDiff > 1 ? "characters" : "character"}.` } }));
                }
            } else {
                this.setState(updateObject(this.state, { error: { show: true, msg: `The field above should not be left empty` } }));
            }
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    onFormSubmission(e) {
        e.preventDefault();
        const { currentLimit, error, textValue } = this.state;
        this.setState(updateObject(this.state, { submitted: true }));
        if (!error.show && currentLimit >= 0 && typeof textValue === "string") {
            this.setState({ ...this.state, loading: true });
            let { receivedData, uid, notify, generateNewId, addPost } = this.context;
            const addedPost = {
                caption: "",
                id: generateNewId(),
                contentType: Consts.Tweet,
                contentURL: `${textValue?.charAt(0)?.toUpperCase()}${textValue?.slice(1)}`,
                comments: [],
                date: new Date(),
                likes: { people: [] },
                userName: receivedData?.userName,
                location: "",
                postOwnerId: uid,
                userAvatarUrl: receivedData?.userAvatarUrl,
                contentName: false,
                songInfo: {},
                disableComments: false
            }
            addPost(addedPost, Consts.Post).then(() => {
                if (this._isMounted) {
                    notify("Tweet has been added");
                    this.setState(
                        {
                            ...this.state,
                            textValue: "",
                            currentLimit: 50,
                            submitted: false,
                            error: { show: false, msg: "" },
                            loading: false
                        });
                    this.props.history.push("/");
                }
            }).catch(() => {
                if (this._isMounted) {
                    this.setState({ ...this.state, loading: false });
                    notify("Failed to make a tweet. Please try again later!", "error");
                }
            });
        }

    }
    render() {
        const { currentLimit, textValue, submitted, error, loading, maxCharactersLimit } = this.state;
        return (
            <Auxiliary>
                <form id="tweetEditor" onSubmit={(e) => this.onFormSubmission(e)}>
                    <textarea autoFocus maxLength={maxCharactersLimit} autoCorrect="true" spellCheck="true" minLength={1} className="tweet__text__area" placeholder="What's happening?" value={this.state.textValue} onChange={(e) => this.onInputChange(e)} />
                    <div className="errors--box">
                        {submitted && (error.show) && <span className="text-danger">{error.msg}</span>}
                    </div>
                    <div className="tweet--btns flex-row">
                        <input type="submit" disabled={!textValue || loading} className={`${(!textValue || loading) ? "disabled" : ""} profile__btn primary__btn`} value={loading? "Publishing..." : "Publish"} />
                        <span style={{ color: currentLimit < 0 ? "red" : currentLimit > 50 ? "green" : "orange" }} className="tweet__counter">{this.state.currentLimit}</span>
                    </div>
                </form>
            </Auxiliary>
        )
    }
}


export default withRouter(TweetPhase);