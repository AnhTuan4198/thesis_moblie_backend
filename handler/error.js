function errorHandler(err, req,res,next) {
    return res.status(err.statusCode || 500).json({
      Error: {
        message: err.message || "Something broken",
      },
    }); 
}

module.exports = errorHandler;