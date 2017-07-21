export class Message
{
    content: string;
    username: string;
    messageId?: string;
    userId?: string; 

    constructor(content: string , username: string , messsageId?: string , userId?: string)
    {
        this.content = content;
        this.username = username;
        this.messageId = messsageId;
        this.userId = userId;
    }
}