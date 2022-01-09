import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import ImageFilter from 'react-image-filter';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const FilterMediaPhase = ({ setCurrentPhase, contentPreview }) => {
    const [filterMethods] = useState([
        {option: "Normal", id: "normal"},
        {option: "Duotone", id:"duotone"},
        {option: "Invert", id: "invert"},
        {option: "Grayscale", id:"grayscale"},
        {option: "Sepia", id: "sepia"},
    ]);
    const [selectedFilter, setFilter] = useState("normal");
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    }
    return (
        <Fragment>
            <div id="filterMediaPhase" className="uploadPhase flex-row">
                <div className="filter--media--container">
                {/* filter */}
                {
                    selectedFilter !== "normal" ?
                    <ImageFilter
                        className="original--review"
                        image={contentPreview}
                        filter={ selectedFilter }
                        colorOne={ [40, 250, 250] }
                        colorTwo={ [250, 150, 30] }
                    />
                    :
                    <div className="original--review">
                        <img loading="lazy" className="unselectable" src={contentPreview || ""} alt="new post" />   
                    </div>
                }

                {/* end filter */}
                </div>
                <div className="phase--media--right">
                    <div className="phase--media--choices flex-column">
                    <div id="Filter" className="option--container">
                            <FormControl component="fieldset">
                            <FormLabel component="legend">Filters</FormLabel>
                            <RadioGroup aria-label="gender" name="gender1" value={selectedFilter} defaultValue={selectedFilter} onChange={handleFilterChange}>
                                {
                                    filterMethods && filterMethods.length > 0 &&
                                    filterMethods?.map(filter => {
                                        return filter &&
                                        (<FormControlLabel key={filter?.id} value={filter?.id} control={<Radio color="primary" />} label={filter?.option}/>)
                                    })
                                }
                            </RadioGroup>
                            </FormControl>
                    </div>
                    </div>
                    <span className="phase__media__next_btn mt-4">
                       <button className="profile__btn primary__btn" onClick={() => setCurrentPhase({index: 3, title: "post"})}>Next</button> 
                    </span>
                </div>
            </div>
        </Fragment>
    )
}
FilterMediaPhase.propTypes = {
    setCurrentPhase: PropTypes.func.isRequired,
    contentPreview: PropTypes.string.isRequired
}
export default FilterMediaPhase;