import { IMessage, IUser } from "../models"

interface IChatMessageProps {
  message: IMessage
  curentUser?: IUser
}

const ChatMessage = ({ message, curentUser }: IChatMessageProps) => {
  const isUserMsg: boolean = message.user.id === curentUser?.id

  return <div className={`message ${isUserMsg ? 'right' : 'left'}`}>
    <p>{message.body}</p>
  </div>
}

export default ChatMessage