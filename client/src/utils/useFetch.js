import axios from "axios"

export const privateRequest=function (accessToken,refreshToken){
    const instance=axios.create({
        baseURL:"http://localhost:4751",
        headers:{
            'accesstoken':accessToken,
            'refreshtoken':refreshToken
        }
    }
    )
    return instance;
}

export const publicRequest=function (){
    const instance=axios.create({
        baseURL:"http://localhost:4751"
    }
    )
    return instance;
}