import { GraphLayout} from '@maxgraph/core';
import { DataService } from '../services';
import { StorageService } from '../services/storage-service';
import Container from 'typedi';
import { ConfigManager } from '../services/configuration-manager';
import { DiagramType } from '../data-model';

export abstract class UMLDiagramPainter {

    protected dataService: DataService;
    protected storageService: StorageService;
    protected configManager: ConfigManager;
    protected eventHandler: any;
    protected layout:GraphLayout;

    public constructor() {
        this.dataService = Container.get(DataService);
        this.storageService = Container.get(StorageService);
        this.configManager = Container.get(ConfigManager);
    }
    
    public abstract update();
    public abstract draw(eventHandler);
    public abstract getType():DiagramType;

}