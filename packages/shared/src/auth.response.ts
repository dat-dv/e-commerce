import { IImage } from "./image";
import { IUser } from "./user";

export interface IUserResponse extends IUser { 
    avatar: IImage
}