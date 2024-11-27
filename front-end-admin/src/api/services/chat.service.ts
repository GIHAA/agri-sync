/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { EndpointPathId } from '../../interfaces'
import axios from '../request-handler'
import * as ChatRequests from '../endpoints/chat.endpoint'

class ChatApi {
  private static instance: ChatApi

  private constructor() {}

  public static useAPI(): ChatApi {
    if (ChatApi.instance === undefined) {
      ChatApi.instance = new ChatApi()
    }
    return this.instance
  }

  public sendMessage = async (data: any) => {
    try {
      const response = await ChatRequests.sendMessage(data)
      return response
    } catch (error) {
      return false
    }
  }

  public getMessages = async (id: EndpointPathId) => {
    try {
      const response = await ChatRequests.getMessages(id)
      return response
    } catch (error) {
      return false
    }
  }
}

export default ChatApi
