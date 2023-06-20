import { useFilter } from "../../context/filter-context";

export const Brand = () => {
    const {filterDispatch, brand} = useFilter();

    const handleBrandChange = (e, option) => {
        let check = e.target.checked;
        filterDispatch({
            type: "BRAND",
            payload: {
                option,
                check
            }
        })
    }
    

    return (
        <div className="category">
            
            <div className=" d-flex flex-column ">
                <label className="d-flex align-center gap-10px">
                    <input className="form-check-input" type="checkbox" value="Polycab" onChange={(e) => handleBrandChange(e, "Polycab")}  />
                    <span>Polycab</span>
                </label>
                <label className="d-flex align-center gap-10px">
                    <input className="form-check-input" type="checkbox" value="Finolex" onChange={(e) => handleBrandChange(e, "Finolex")} />
                    <span>Finolex</span>
                </label>
                <label className="d-flex align-center gap-10px">
                    <input className="form-check-input" type="checkbox" value="L&T EBG" onChange={(e) => handleBrandChange(e, "L&T EBG")} />
                    <span>L&T EBG</span>
                </label>
                <label className="d-flex align-center gap-10px">
                    <input className="form-check-input" type="checkbox" value="ABB" onChange={(e) => handleBrandChange(e, "ABB")}/>
                    <span>ABB</span>
                </label>
                <label className="d-flex align-center gap-10px">
                    <input className="form-check-input" type="checkbox" value="Crompton" onChange={(e) => handleBrandChange(e, "Crompton")} />
                    <span>Crompton</span>
                </label>
                <label className="d-flex align-center gap-10px">
                    <input className="form-check-input" type="checkbox" value="Bonfiglioil" onChange={(e) => handleBrandChange(e, "Bonfiglioil")} />
                    <span>Bonfiglioil</span>
                </label>
                <label className="d-flex align-center gap-10px">
                    <input className="form-check-input" type="checkbox" value="Highmust" onChange={(e) => handleBrandChange(e, "Highmust")} />
                    <span>Highmust</span>
                </label>
                <label className="d-flex align-center gap-10px">
                    <input className="form-check-input" type="checkbox" value="Bajaj" onChange={(e) => handleBrandChange(e, "Bajaj")} />
                    <span>Bajaj</span>
                </label>
                <label className="d-flex align-center gap-10px">
                    <input className="form-check-input" type="checkbox" value="Flotec" onChange={(e) => handleBrandChange(e, "Flotec")} />
                    <span>Flotec</span>
                </label>
                <label className="d-flex align-center gap-10px">
                    <input className="form-check-input" type="checkbox" value="Bosch" onChange={(e) => handleBrandChange(e, "Bosch")} />
                    <span>Bosch</span>
                </label>
                <label className="d-flex align-center gap-10px">
                    <input className="form-check-input" type="checkbox" value="Almonard" onChange={(e) => handleBrandChange(e, "Almonard")} />
                    <span>Almonard</span>
                </label>
                <label className="d-flex align-center gap-10px">
                    <input className="form-check-input" type="checkbox" value="Bosch" onChange={(e) => handleBrandChange(e, "Bosch")} />
                    <span>Bosch</span>
                </label>
            </div>
        </div>
    )
}