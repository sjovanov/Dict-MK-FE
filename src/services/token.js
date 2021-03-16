const TokenService = {
    getToken(){
        return sessionStorage.getItem('user-token')
    }
}

export {TokenService}