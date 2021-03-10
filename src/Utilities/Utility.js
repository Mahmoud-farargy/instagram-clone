
export const updateObject = (oldObject, newObject) =>{
    const deepClonedObj = JSON.parse(JSON.stringify(oldObject));
    return {
        deepClonedObj,
        ...newObject
    }
}