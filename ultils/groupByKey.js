const { hash } = require("bcrypt")


exports.groupListByKey = (ListObject,key , dataKey) =>{
    const array =  ListObject.reduce((hash,obj)=>{
        if(obj[key] === undefined) return hash;
        return Object.assign(hash,{
            [obj[key]]: ( hash[obj[key]] || []).concat(obj) ,
        })
    }
    ,{})
    console.log(array)
    let groupByValueOfKey = Object.keys(array);
    
    console.log(groupByValueOfKey)
    let listGroupedByKey = groupByValueOfKey.map(item=>{
        return {
            [key]: item,
            [dataKey]:[
                ...array[item]
            ]
        }
    })
    console.log(listGroupedByKey)
    return listGroupedByKey
}