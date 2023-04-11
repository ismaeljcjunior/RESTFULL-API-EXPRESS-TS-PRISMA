import * as dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from 'express'
import axios from 'axios'

export const loggerApiService = async (req: Request, res: Response) => {
    const optionsLogin = {
        headers: {
            "content-type": "multipart/form-data",
            "Authorization": process.env.LOGIN_AUTHORIZATION as string
        }
    }
    const optionsRefreshLogin = {
        headers: {
            "content-type": "multipart/form-data",
            "Authorization": process.env.LOGIN_AUTHORIZATION,
            "tenant": process.env.LOGIN_TENANT as string
        }
    }
    let objDataLogin = {
        access_token: '',
        refresh_token: '',
        grant_type: 'refresh_token',
        token_type: '',
        Authorization: process.env.LOGIN_AUTHORIZATION,
        tenant: process.env.LOGIN_TENANT,
        newAccess_token: '',
        newRefresh_token: '',
    }
    let dataLogin = {
        username: process.env.USER_LOGIN,
        password: process.env.USER_PASSWORD,
        grant_type: process.env.USER_GRANT_TYPE
    }
    let dataRefresh = {
        grant_type: process.env.LOGIN_GRANT_TYPE,
        refresh_token: ''
    }

    try {
        const resLogin = await axios.post(process.env.API_URL_LOGIN as string, dataLogin, optionsLogin)
        objDataLogin.access_token = resLogin.data.access_token
        objDataLogin.refresh_token = resLogin.data.refresh_token
        objDataLogin.token_type = resLogin.data.token_type
        dataRefresh.refresh_token = resLogin.data.refresh_token

        const resRefresh = await axios.post(process.env.API_URL_REFRESH as string, dataRefresh, optionsRefreshLogin)
        objDataLogin.newAccess_token = resRefresh.data.access_token
        objDataLogin.newRefresh_token = resRefresh.data.refresh_token

        return objDataLogin
    } catch (e) {
        console.log(e)
    }
}