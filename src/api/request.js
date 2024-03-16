import APIs from './APIs'
import localStore from '../utils/localStorage'
import Util from '../utils'
// import store from '../store'

export default class Request{

    static async send(url, post, method, header='',resend = false){

        let token = await localStore.get('accessToken', "not-set")
        if(Util.isEmpty(token)) token = 'not-set'

        if(header === '')
        {
            header = {
                'Accept':       'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            }
        }
        else
        {
            header = {  
                'Accept':       'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache',
                ...header
            }
        }

        const contentType = header['Content-Type'];
        let data = {
            method: method,
            mode: 'cors',
            headers: header
        }
        
        if(method.toUpperCase() != 'GET')
        {
            data.body = contentType == 'application/json' ? JSON.stringify(post) : post
        }

        console.log('Sent data: '+ data.method+ " " + url, post) //,data) //--> easier check

        return fetch(url,data)
            .then(response =>  response.text())
            .then( res => JSON.parse(res))
            .then( async output => {

                if( !resend && !Util.isEmpty(output.connection)) 
                {
                    if(output.connection == "expired-token")
                    {
                        console.log(url,"Run hear 1")
                        let refreshPost = {
                             refreshToken : await localStore.get('refreshToken', "not-set")
                        }
                        if(url != APIs.token.refresh)
                        {
                            console.log(url,"Run hear 1.1")
                            await this.post(APIs.token.refresh, refreshPost)
                            return this.send(url, post, method, header,true)
                        }
                        else
                        {
                            console.log(url,"Run hear 1.2")

                            return {'result': 'logout'}
                        }
                    }
                    if(output.connection == "set-token")
                    {
                        console.log(url,"Run hear 2")

                        await localStore.set('accessToken', output.tokens.accessToken)
                        await localStore.set('refreshToken', output.tokens.refreshToken)
                    }
                    if(output.connection == "invalid-token" || output.connection == "not-allowed")
                    {
                        console.log(url,"Run hear 3")
                        return {'result': 'logout'}
                    }
                }
 
                console.log(method+" "+url+": ", output)
                if(output.result != 'okie')
                {
                    // if(Util.isEmpty(output.msg))
                    // {
                    //     output.msg = 'Error, please contact admin.'
                    // }
                }

                return output
            })
            .catch(error=>{
                console.log("Sent Request (resend " +resend+ ") got Error: ", error )
                return {'result': 'Failed', 'msg': 'Connection failed. Oops, we catched an error!'}
            }) //to catch the errors if any
    }

    static async get(url, header='')
    {
        return this.send(url , {}, 'GET', header)
    }

    static async post(url, post={}, header='')
    {
    
        return this.send(url, post, 'POST', header)
    } 

    static async put(url, post={}, header='')
    {
        return this.send(url, post, 'PUT', header) 
    }

    static async delete(url, post={}, header='')
    {
        return this.send(url, post, 'DELETE', header)
    }
    static async getBasic(url, header='')
    {
        if(header === '')
        {
            header = {
                'Accept':       'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }
        else
        {
            header = { ...header, 
                'Accept':       'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }

        let data = {
            method: 'GET',
            mode: 'cors',
            headers: header
        }

        console.log('Sent data: '+ data.method+ " " + url)//, data) --> easier check

        return fetch(url, data)
            .then(response =>  response.text())
            .then( res => JSON.parse(res))
            .then( async output => output)
            .catch(error=>{
                console.log("Sent Request ) got Error: ", error )
                return {'result': 'Failed', 'msg': 'Connection failed. Oops, we catched an error!'}
            }) //to catch the errors if any
    }
}
