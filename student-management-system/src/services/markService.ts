import API from "./api";

export const getMarks=()=>API.get("/marks");

export const addMarks=(data:any)=>
API.post("/marks",data);

export const updateMarks=(id:number,data:any)=>
API.put(`/marks/${id}`,data);

export const deleteMarks=(id:number)=>
API.delete(`/marks/${id}`);