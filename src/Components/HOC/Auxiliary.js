import PropTypes from "prop-types";

const Auxiliary = (props) => props.children;
Auxiliary.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
}
export default Auxiliary;