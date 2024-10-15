export const getErrorMessage = (err) => {
    switch (err.name) {
        case 'ValidationError':
            let errorMessages = "";
            
            if  (Object.values(err.errors) && Object.values(err.errors).length > 0){
                for (let i = 0; i < Object.values(err.errors).length; i++) {
                    errorMessages += Object.values(err.errors)[i] + '</br>';
                }
            }
            
            // let errorMessages = Object.values(err.errors)[0]?.message;
            return errorMessages;
        // TODO case 'CastError':
        default:
            return err.message;
    }
}