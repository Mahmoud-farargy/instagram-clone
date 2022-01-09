import React from 'react';
import InputForm from '../../../../Components/Generic/InpuForm/InputForm';
import PropTypes from "prop-types";

function answerItem({ item, index, onInputChange, isSubmitted, onCloseClick, answerCharsLimit }) {
    return (
        <div className="poll--answer">
            <InputForm
            type="text"
            inputType="text"
            name="answers"
            label={`Choice ${index +1}`}
            changeInput={onInputChange}
            submitted={isSubmitted}
            required={true}
            hideLabel={true}
            autoFocus={index > 1}
            val={item.value}
            maxLength={answerCharsLimit}
            payload={{id: item.id}}
            widthCloseBtn={index > 1}
            onCloseClick={onCloseClick}
            />
        </div>
    )
}

answerItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onInputChange: PropTypes.func.isRequired,
    isSubmitted: PropTypes.bool.isRequired,
    onCloseClick: PropTypes.func.isRequired,
    answerCharsLimit: PropTypes.number.isRequired
}
export default answerItem;