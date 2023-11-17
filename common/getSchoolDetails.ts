import type { School } from './types';
import schools from './schools';

const getSchoolDetails = ( schoolCode : string ) :  School | undefined => {

    const key = schoolCode.toUpperCase();
    if( key in schools ) {
        return schools[key]; 
    }

    return undefined;
}

export default getSchoolDetails;


