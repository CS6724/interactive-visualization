import 'reflect-metadata';
import Container, { Service } from 'typedi';
import root from '../../assets/data/root.json';
import { DataService } from './data-service';
import { EventsService } from './event-service';
import { IVLaPEvents } from '../types';
import { StorageService } from './storage-service';

@Service()
export class DiagramService {
    private dataService:DataService;
    private eventService:EventsService;
    private storageService:StorageService;

    constructor(){
        this.dataService = Container.get(DataService);
        this.eventService = Container.get(EventsService);
        this.storageService = Container.get(StorageService);

    }
    async loadDiagram(source, url){
        this.storageService.pushBreadcrum(source,url);
        const response = await this.dataService.fetchData(url);
        // Load data
        this.storageService.setCurrentDiagram(response["data"]);

    }
    public back(){
        this.storageService.navigateToPervious()
    }
    
}