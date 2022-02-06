import React, { Fragment, useState, useContext, useEffect } from "react";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { AppContext } from "../../../Context";

const Themes = () => {
    const [themeList] = useState([
        {option: "Automatic Light/Dark", id:"lightDarkAuto"},
        {option: "Dark Mode", id: "darkMode"},
        {option: "Light Mode", id: "lightMode"},
        {option: "Iced Coffee", id:"icedCoffee"},
        {option: "Snorkel Blue", id: "snorkelBlue"},
        {option: "Blue Izis", id: "blueIzis"},
        {option: "Butter Cup", id: "butterCup"},
        {option: "Honeysucle", id: "honeysucle"},
    ]);
    const { handleThemeChange, receivedData } = useContext(AppContext);
    const [themeSelected, setThemeSelection] = useState("lightMode");
    useEffect(() => {
        const fetchedTheme = receivedData?.profileInfo?.theme;
        if(fetchedTheme){
            setThemeSelection(fetchedTheme);
        }
    },[]);
    const handleChange = (e) => {
        setThemeSelection(e.target.value);
        handleThemeChange(e.target.value);
    }
    return(
        <Fragment>
         <div id="theme" className="option--container fadeEffect">
            <FormControl component="fieldset">
            <FormLabel component="legend"><h5>Pick a theme</h5></FormLabel>
            <RadioGroup aria-label="gender" name="gender1" value={themeSelected} defaultValue={themeSelected} onChange={handleChange}>
                {
                    themeList && themeList.length > 0 &&
                    themeList?.map(theme => {
                        return theme &&
                        (<FormControlLabel key={theme?.id} value={theme?.id} control={<Radio color="primary" />} label={theme?.option}/>)
                    })
                }
            </RadioGroup>
            </FormControl>
        </div>
        </Fragment>
    )
}

export default Themes;