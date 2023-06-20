export const reducerFun = (state, action) => {
    switch (action.type){
        case "lth":
            return{
                ...state,
                sort: action.payload
            };
        case "htl":
            return{
                ...state,
                sort: action.payload
            };
        case "BRAND":
            return{
                ...state,
                brand: action.payload.check  
                ? [...state.brand, action.payload.option] 
                : state.brand.length>0
                ? state.brand.filter(
                    (brandValue) => brandValue !== action.payload.option
                )
                : []
                
            }
        default:
            return state;
    }

}