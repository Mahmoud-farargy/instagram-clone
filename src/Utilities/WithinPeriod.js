export const withinPeriod = ({date, period, min}) => {
    if(date){
        const dateAlt = new Date(date * 1000);
        const now = new Date();
        if(period){
            if(min && period){
                return ((now - dateAlt) < period) && ((now - dateAlt) > min) ;
            }else{
                return ((now - dateAlt) < period);
            }
        }else if(min){
            return ((now - dateAlt) > min);
        }   
    }
};