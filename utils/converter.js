const convertGweiToEth=(gwei)=>{
    let result=(Number(gwei)/(1000000000000000000))
    result=result.toString()
    return result
    
}





module.exports={convertGweiToEth}