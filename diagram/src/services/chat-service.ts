import 'reflect-metadata';
import Container, { Service } from 'typedi';
import { EventsService } from './event-service';
import { IVLaPEvents } from '../types';
import { StorageService } from './storage-service';

import { CHAT_URL } from '../common/environment';
@Service()
export class ChatService {

  private PROJECT_NAME = "keycloak";
  private SOURCE_DB = "uml-data";
  private REPOSITORY_PATH = "/Users/yoseph/Work/Personal/keycloak";
  private GITHUB_URL = "keycloak/keycloak";
  private DOCS_SOURCE = "https://www.keycloak.org/documentation";

  history = []
  private eventsService: EventsService;
  private storageService: StorageService;
  private base_url = CHAT_URL;
  constructor() {
    this.eventsService= Container.get(EventsService);
    this.storageService= Container.get(StorageService);
  }
  public async sendMessage(user_input:string, attempt:number=0, history:string[]=[]){
    let current_view = this.storageService.getCurrentView()
    if(this.storageService.getCurrentDiagramType() === "class"){
      current_view = "Classes in " + current_view
    }else {
      current_view = "Packages in " + current_view
    }
    this.storageService.getCurrentView()
    let payload = {
      "user_query": user_input,
      "project_name": this.PROJECT_NAME,
      "source_db": this.SOURCE_DB,
      "repository_path": this.REPOSITORY_PATH,
      "github_url": this.GITHUB_URL,
      "docs_source": this.DOCS_SOURCE,
      "current_diagram": this.storageService.getCurrentDiagram(),
      "current_selection": this.storageService.getSelected(),
      "current_view": current_view,
      "history": history,
      "attempt":  attempt
    }
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