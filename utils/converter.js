const convertGweiToEth=(gwei)=>{
    let result=(Number(gwei)/(1000000000000000000))
    result=result.toFixed(2).toString()
    return result
    
}





module.exports={convertGweiToEth}