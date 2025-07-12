const asyncHandler =(requestHandler)=>{
    return(res,req,next)=>{
        Promise.resolve(requestHandler(req,res,next))
    }
}

export default asyncHandler;