import 'reflect-metadata';
import Container, { Inject, Service } from 'typedi';
import { HumanMessage, isAIMessage } from "@langchain/core/messages";
import { EventsService } from './event-service';
import { ChatEvent, IVLaPEvents } from '../types';
import { constants } from '@maxgraph/core';
import { StorageService } from './storage-service';

import { CHAT_URL } from '../common/environment';
@Service()
export class ChatService {

  history = []
  private eventsService: EventsService;
  private storageService: StorageService;
  private base_url = CHAT_URL;
  constructor() {
    this.eventsService= Container.get(EventsService);
    this.storageService= Container.get(StorageService);
  }
  
  public async sendMessage(user_input:string){
    let payload = {
      "user_query": user_input,
      "diagram_data": this.storageService.getCurrentDiagram()
    }
    console.log(JSON.stringify(payload))
    fetch(this.base_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed with status " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        this.eventsService.emit(IVLaPEvents.CHAT_EVENT, data)
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  }  
}