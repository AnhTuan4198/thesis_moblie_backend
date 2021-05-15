
exports.generateQuery= (query,sort,nextKey) =>{
    const sortFiled = sort === null ? null :sort[0];
    
    function nextKeyFn(items){
        if(items.length === 0){
            return null
        }
        const item  = items[items.length-1];
        if(sortFiled === null){
            return {
                _id:item._id
            }
        }
        return {_id:item._id,[sortFiled]:item[sortFiled]};
    }


    if(nextKey === null){
        return {query,nextKeyFn}
    }
    const paginatedQuery = query;
    if(sort === null){
        paginationQuery._id = {$gt:nextKey._id}
        return {paginationQuery,nextKeyFn}
    }

    const sortOperation = sort[1]? "$gt":"$lt";
    const paginationQuery = [
        { [sortField]: { [sortOperator]: nextKey[sortField] } },
        {
            $and: [
                { [sortField]: nextKey[sortField] },
                { _id: { [sortOperator]: nextKey._id } }
            ]
        }
    ]
     if (paginatedQuery.$or == null) {
        paginatedQuery.$or = paginationQuery;
    } else {
         paginatedQuery = { $and: [query, { $or: paginationQuery }] };
    }

  return { paginatedQuery, nextKeyFn };

}