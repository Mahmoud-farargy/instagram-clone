import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";

const CheckboxIos = (props) => {
    const {checked,changeInput,name,...args} = props;
    const IOSSwitch = withStyles((theme) => ({
        root: {
          width: 42,
          height: 26,
          padding: 0,
          margin: theme.spacing(1),
        },
        switchBase: {
          padding: 1,
          '&$checked': {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': {
              backgroundColor: 'var(--secondary-clr)',
              opacity: 1,
              border: 'none',
            },
          },
          '&$focusVisible $thumb': {
            color: '#52d869',
            border: '6px solid var(--white)',
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 26 / 2,
          border: `1px solid ${theme.palette.grey[400]}`,
          backgroundColor: theme.palette.grey[200],
          opacity: 1,
          transition: theme.transitions.create(['background-color', 'border']),
        },
        checked: {},
        focusVisible: {},
      }))(({ classes, ...props }) => {
        return (
          <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
              root: classes.root,
              switchBase: classes.switchBase,
              thumb: classes.thumb,
              track: classes.track,
              checked: classes.checked,
            }}
            {...props}
          />
        );
      });
    return (<FormControlLabel control={<IOSSwitch checked={checked || false} onChange={(x)=> changeInput(x.target.checked, name)} name={name} {...args} />} />)
}
CheckboxIos.propTypes = {
    checked: PropTypes.bool.isRequired,
    changeInput: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
}
export default CheckboxIos;