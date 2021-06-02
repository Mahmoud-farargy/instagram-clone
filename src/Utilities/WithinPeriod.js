export const withinPeriod = ({date, period, min}) => {
    if(date && period){
        const dateAlt = new Date(date * 1000);
        const now = new Date();
        if(min && period){
            return ((now - dateAlt) < period) && ((now - dateAlt) > min) ;
        }else if(min && !period){
            return ((now - dateAlt) > min);
        }else{
            return ((now - dateAlt) < period);
        }
    }
};