export const filterElementProps = {
    year:{
        parentId:"#byyear",
        type: "radio",
        name: "year",
        button:{
            id:"yearSubmitter",
        }
    },
    genre:{
        parentId:"#bygenre",
        type: "checkbox",
        name: "genre",
        button:{
            id:"genreSubmitter",
        }
    }
}
export const tableElements = [
    {
        variableName:"$tableEl",
        methodName:"getElementById",
        params:"movies-table"
    },
    {
        parent:"$tableEl",
        variableName:"$tbodyEl",
        methodName:"querySelector",
        params:"tbody"
    },
    {
        variableName:"$searchInput",
        methodName:"getElementById",
        params:"searchInput"
    },
    {
        variableName:"$searchForm",
        methodName:"getElementById",
        params:"searchForm"
    },
]