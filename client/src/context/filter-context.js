import { useContext, createContext, useReducer } from "react";
import {reducerFun} from "./reducerFun";


const initialState = {
    sort: "",
    category: "",
    brand:[]
};

const FilterContext = createContext();

const FilterProvider = ({children}) => {
    const [state, filterDispatch] = useReducer(reducerFun, {sort: "", category: "", brand: [], })
    return(
        <FilterContext.Provider value={{state, filterDispatch}}>
            {children}
        </FilterContext.Provider>
    )
}

const useFilter = () => useContext(FilterContext);

export {useFilter, FilterProvider};