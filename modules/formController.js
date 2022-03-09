import Stop from "./stop.js";

export default class FormController {
    constructor(latInput,lonInput) {
        this.lat_input = latInput;
        this.lon_input = lonInput;
        this.data = {
            lat:0,
            level:0,
            lon:0
        }
    }
    updateForm = (value) => {
        return (e) => {
            let val = e.target.value || 0;
            this.data[value] = val;
        }
    }
    resetForm() {
        this.lat_input.value = "";
        this.lon_input.value = "";
        this.data = {...this.data,...{lat:0,lon:0}}
    };
    handleSubmit = (masterList,callback) => {
        const newStop = new Stop(this.data.level, this.data.lat, this.data.lon);
        masterList.addStop(newStop);
            callback()
            this.resetForm();
    }
}