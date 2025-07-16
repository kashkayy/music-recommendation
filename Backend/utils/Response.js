export function successRes(data){
	return {message: "Success", results: data, ok:true}
}
export function badReq(msg="Error processing request"){
	return {message: msg, ok: false}
}