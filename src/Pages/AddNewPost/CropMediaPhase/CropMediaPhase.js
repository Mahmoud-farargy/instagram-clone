import React, { Fragment, useState, useCallback } from "react";
import PropTypes from "prop-types";
import "./CropMedia.scss";
import Slider from '@material-ui/core/Slider';
import * as Consts from "../../../Utilities/Consts";
import Cropper from 'react-easy-crop';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import getCroppedImg from "./editMedia";

const CropMedia = ({ contentType, contentPreview, setCurrentPhase, changeContentPreview }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation,setRotation] = useState(0);
    const [selectedCrop, setCropMethod] = useState("original");
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
      }, []);
    const cropMethods = Object.freeze([
        {option: "Original", id:"original"},
        {option: "Custom Crop", id: "customCrop"}
    ]);
    const handleCropChange = (e) => {
        setCropMethod(e.target.value);
    }
    const showCroppedImage = useCallback(async () => {
        try {
          const croppedImage = await getCroppedImg(
            contentPreview,
            croppedAreaPixels,
            rotation
          )
          changeContentPreview(croppedImage)
        } catch (e) {
          console.error(e)
        }
      }, [croppedAreaPixels, rotation, contentPreview, changeContentPreview]);
    const nextPhase = () => {
        selectedCrop !== "original" && showCroppedImage();
        setCurrentPhase({index: contentType === Consts.Image ? 2 : 3,title: "post"});
    }
    return (
        <Fragment>
            <div id="cropMedia" className="uploadPhase flex-row">
                <div className="crop--media--preview">
                    {
                        contentType === Consts.Audio ?
                            <audio src={contentPreview} controls controlsList="nodownload" autoPlay> </audio>
                        :
                        <div className="crop--media--img--video flex-column">
                                {
                                    selectedCrop === "customCrop" ?
                                    <>
                                    <div className="crop-container">
                                            <Cropper
                                                loading="lazy"
                                                className="unselectable"
                                                image={contentPreview || ""}
                                                crop={crop}
                                                zoom={zoom}
                                                rotation={rotation}
                                                aspect={4 / 3}
                                                onCropChange={setCrop}
                                                onCropComplete={onCropComplete}
                                                onZoomChange={setZoom}
                                        />
                                    </div>
                                    <div className="flex-column">
                                        <div className="crop--controls mb-4">
                                                <Slider
                                                value={zoom}
                                                min={1}
                                                max={3}
                                                step={0.1}
                                                aria-labelledby="Zoom"
                                                onChange={(_, zoom) => setZoom(zoom)}
                                                classes={{ root: 'slider' }}
                                                />
                                        </div>
                                        <div className="rotation--controls">
                                                <Slider
                                                value={rotation}
                                                min={0}
                                                max={360}
                                                step={1}
                                                aria-labelledby="rotation"
                                                onChange={(_, rotation) => setRotation(rotation)}
                                                classes={{ root: 'slider' }}
                                                />
                                        </div> 
                                    </div>
               
                                    </>
                                        :
                                        <div className="original--review">
                                            <img loading="lazy" className="unselectable" src={contentPreview || ""} alt="new post" />   
                                        </div>
                                        
                                
                            }
        
                        </div>
                    }   
                </div>
                <div className="phase--media--right flex-column">
                    <div className="phase--media--choices flex-column">
                    <div id="crop" className="option--container">
                            <FormControl component="fieldset">
                            <FormLabel component="legend">Choose size</FormLabel>
                            <RadioGroup aria-label="gender" name="gender1" value={selectedCrop} defaultValue={selectedCrop} onChange={handleCropChange}>
                                {
                                    cropMethods && cropMethods.length > 0 &&
                                    cropMethods?.map(crop => {
                                        return crop &&
                                        (<FormControlLabel key={crop?.id} value={crop?.id} control={<Radio color="primary" />} label={crop?.option}/>)
                                    })
                                }
                            </RadioGroup>
                            </FormControl>
                    </div>
                    </div>
                    <span className="phase__media__next_btn mt-4">
                       <button className="profile__btn primary__btn" onClick={() => nextPhase()}>Next</button> 
                    </span>
                </div>    
            </div>

        </Fragment>
    )
}
CropMedia.propTypes = {
    contentType: PropTypes.string.isRequired,
    contentPreview: PropTypes.string.isRequired,
    setCurrentPhase:  PropTypes.func.isRequired,
}
CropMedia.defaultProps = {
    contentType: "",
    contentPreview: "",
}
export default CropMedia;