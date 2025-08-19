import { validationResult } from "express-validator";

export const handleValidationErrors = (req,res,next) => 
{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            status:'error',
            message:'Validacion fallida',
            errors:errors.array().map(error=>({
                field:error.param,
                message:error.msg,
            }))
        });
    }
    next();
};