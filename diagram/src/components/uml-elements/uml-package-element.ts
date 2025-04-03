import { constants, Geometry } from '@maxgraph/core';
import { UMLElement } from './uml-element';
import { UMLPackage } from '../../data-model';
import { SummaryTooltip } from '../../components/controls';
import { EventsService } from '../../services';
import Container from 'typedi';
import { IVLaPEvents } from '../../types';
import { DiagramService } from '../../services/diagram-service';
export class UMLPackageElement extends UMLElement {
    width = 90;
    height = 150;
    private diagramService: DiagramService;
    private tooltip: SummaryTooltip | null = null;
    private on_click_url: string;
    private name: string;
    constructor(public data: UMLPackage, public options:any[]) {
        super(UMLPackageElement.generateHTML(data,options));
        this.id = data.id;
        this.on_click_url = data.on_click;
        this.name = data.name;
        this.vertex = true;
        this.calcSize();
        this.geometry = new Geometry(0, 0, this.width, this.height);
        this.createTooltip();
        this.attachEventListeners();
        this.diagramService = Container.get(DiagramService)
    }
    // Won't work for very large number
    private static formatIntl(num: number) {
        return new Intl.NumberFormat("en", {
            notation: "compact",
            compactDisplay: "short",
            maximumFractionDigits: 1
        }).format(num);
    };

    private calcSize() {
        this.height = 35;
        if (this.options.find(option => option.id === 'subpackages')?.selected && this.data.subpackages){
            this.height += (this.data.subpackages.length * 35)
        }
        this.width = 215; // Longest component
    }

    private createTooltip() {
        this.tooltip = document.createElement('summary-tooltip') as SummaryTooltip;
        document.body.appendChild(this.tooltip); // Append tooltip once
        this.tooltip.isVisible = false;
    }
    
    private static generateHTML(data: UMLPackage, diagramOptions: any[]): HTMLElement {
        let classes_html = "";
        if(data.classes){
        classes_html = diagramOptions.find(option => option.id === 'classes')?.selected && data.classes.length > 0
            ? `${data.classes.map((c) => `<div class="uml-class" id="${c.id}"> <div class="uml-class-name"> ${c.name}</div></div>`).join('\n')}`
            : "";
        }
        let subpackages_html = "";
        if(data.subpackages){
            subpackages_html = diagramOptions.find(option => option.id === 'subpackages')?.selected && data.subpackages.length > 0
                ? `<div class="uml-package">${data.subpackages
                    .map((subpackage) => `<div class="uml-package" id="${subpackage.id}">${subpackage.name}</div>`)
                    .join('\n')}</div>`
                : "";
        }
        let html = `<div class="uml-package" data="${data.on_click}">
            <div class="uml-package-header" id="${data.id}">${data.name}</div>
            <div class="uml-package-content">
                ${subpackages_html}
                ${classes_html}
            </div>
        </div>`;
        const containerEl = document.createElement('div');
        containerEl.innerHTML = html.trim();
        return containerEl.firstElementChild as HTMLElement;
    }
    private attachEventListeners() {
        const element = this.getValue() as HTMLElement;

        if (!element || !this.tooltip) return;
        element.addEventListener("mouseover", (event: MouseEvent) => {
            if (!this.options.find(option => option.id === 'summary')?.selected){
                return;
            }
            if (!this.tooltip) return;
            if (!this.data.summary) return;
            this.tooltip.summary = this.data.summary;
            this.tooltip.id = this.data.id
            this.tooltip.style.position = "absolute";
            this.tooltip.style.left = `${event.pageX + 10}px`;
            this.tooltip.style.top = `${event.pageY + 10}px`;
            this.tooltip.isVisible = true;
        });

        element.addEventListener("mousemove", (event: MouseEvent) => {
            if (!this.tooltip) return;

            this.tooltip.style.left = `${event.pageX + 10}px`;
            this.tooltip.style.top = `${event.pageY + 10}px`;
        });

        element.addEventListener("mouseout", () => {
            if (!this.tooltip) return;

            this.tooltip.isVisible = false; // Just hide tooltip instead of removing
        });
        element.addEventListener("dblclick", (event: MouseEvent) => {
            console.log("Event: " + this.on_click_url);
            // this.eventsService.emit(IVLaPEvents.LOAD_DIAGRAM, this.on_click_url)
            this.diagramService.loadDiagram(this.name, this.on_click_url)
            // this.emit("click", { "id": this.id, "source":"package", "action":"load" });
            
        });

        const noteElement = this.getValue().querySelector('.note-icon');
        if (noteElement) {
                noteElement.addEventListener("click", (event: MouseEvent) => {
                this.emit("click", { "id": this.id, "source":"package", "action":"note" });
                event.stopPropagation();
            });
        }
        const chatElement = this.getValue().querySelector('.selection-icon');
        if (chatElement) {
                chatElement.addEventListener("click", (event: MouseEvent) => {
                this.emit("click", { "id": this.id, "source":"package", "action":"chat" });
                event.stopPropagation();
            });
        }

        const attributeElement = this.getValue().querySelector('.uml-subpackage');
        if (attributeElement) {
            attributeElement.addEventListener("dblclick", (event: MouseEvent) => {
                const targetId = (event.target as HTMLElement).id;
                this.emit("click", { "class": this.id, "source":"package", "action":"attribute", "id": targetId});
                event.stopPropagation();
            });
        }
        
        const methodElement = this.getValue().querySelector('.uml-method');
        if (methodElement) {
            methodElement.addEventListener("dblclick", (event: MouseEvent) => {
                const targetId = (event.target as HTMLElement).id;
                this.emit("click", { "class": this.id, "source":"package", "action":"method", "id": targetId});
                event.stopPropagation();
            });
        }
        
    }

}