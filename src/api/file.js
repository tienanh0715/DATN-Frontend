import APIs from './APIs'
import Request from './request'
export default class File extends Request{

    static getFile(nameFile)
    {
        return this.get(APIs.file + nameFile)
    }

}