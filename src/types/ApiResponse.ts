import {Message}  from "@/model/user.model"



export interface ApiResonse{
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?:Array<Message>
}