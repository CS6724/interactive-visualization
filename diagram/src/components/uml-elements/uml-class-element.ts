import { Geometry } from '@maxgraph/core';
import { UMLElement } from './uml-element';
import { UMLProperty, UMLClass, UMLMethod } from '../../data-model';
import { SummaryTooltip } from '../../components/controls';
import { ConfigManager } from '../../services/configuration-manager';
export class UMLClassElement extends UMLElement {
    width = 0;
    height = 0;
    private tooltip: SummaryTooltip | null = null;
    constructor(public data: UMLClass, public options: any[]) {
        super(UMLClassElement.generateHTML(data, options));
        this.id = data.id;
        this.vertex = true;
        this.calcSize();
        this.geometry = new Geometry(0, 0, this.width, this.height);
        this.createTooltip();
        this.attachEventListeners();
    }

    private calcSize() {
        this.height = 35;
        if (this.options.find(option => option.id === 'properties')?.selected) {
            this.height += (this.data.properties.length * 15)
        }
        if (this.options.find(option => option.id === 'methods')?.selected) {
            this.height += (this.data.methods.length * 15)
        }
        this.width = 215; // Longest component
    }

    private createTooltip() {
        this.tooltip = document.createElement('summary-tooltip') as SummaryTooltip;
        document.body.appendChild(this.tooltip); // Append tooltip once
        this.tooltip.isVisible = false;
    }
    private static generateMethod(method: UMLMethod) {
        let return_value = `<div class="uml-method ${method.selected? method.selected:''} " ${method.style? "style='"+ method.style+"'":''} ${method.domId? "id='"+ method.domId+"'":''}><span class='data-type' >${method.returnType ? method.returnType + " " : ""}</span>${method.name}(`;
        method.parameters.forEach((p) => {
            return_value += `<span class='data-type' >${p.dataType}</span>, `;
        });
        return_value = return_value.endsWith(", ") ? return_value.slice(0, return_value.length - 2) : return_value;
        return_value += ")</div>";
        return return_value;
    }


    private static generateProperty(property: UMLProperty) {
        let return_value = `<div class="uml-property ${property.selected? property.selected:''} " ${property.style? "style='"+ property.style+"'":''} ${property.domId? "id='"+ property.domId+"'":''}><span class='data-type member' >${property.dataType}</span> ${property.name}</div>`;
        return return_value;
    }

    private static generateHTML(data: UMLClass, diagramOptions: any[]): HTMLElement {
        let properties_html = diagramOptions.find(option => option.id === 'properties')?.selected && data.properties.length > 0
            ? `<div class="uml-class-properties">${data.properties
                .map((property) => `${UMLClassElement.generateProperty(property)}`)
                .join('\n')}</div>`
            : "";

        let methods_html = diagramOptions.find(option => option.id === 'methods')?.selected && data.methods.length > 0
            ? `<div class="uml-class-methods">${data.methods
                .map((method) => `${UMLClassElement.generateMethod(method)}`)
                .join('\n')}</div>`
            : "";
        
        let appended_html = data.generatedContent? `<div class='uml-extra'> ${data.generatedContent}</div>`:'';
        let html = ` 
            <div class="uml-class ${data.selected? "selected":''} " ${data.style? "style='"+ data.style+"'":''} ${data.domId? "id='"+ data.domId+"'":''}>
                <div class="uml-class-name">
                ${data.name}
                <div class="icon-container">
                    <span class="note-icon" title="Click for more information">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </span>
                    <span class="selection-icon" title="Click to select">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 9l4 4l10-10"></path>
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" stroke-width="2" fill="none"></rect>
                        </svg>
                    </span>
                </div>
            </div>
                ${properties_html}
                ${methods_html}
                ${appended_html}
            </div>`;
        const containerEl = document.createElement('div');
        containerEl.innerHTML = html.trim();
        return containerEl.firstElementChild as HTMLElement;
    }
    private attachEventListeners() {
        const element = this.getValue() as HTMLElement;

        if (!element || !this.tooltip) return;
        element.addEventListener("mouseover", (event: MouseEvent) => {
            if (!this.options.find(option => option.id === 'summary')?.selected) {
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
            this.emit("click", { "id": this.id, "source": "class", "action": "summary" });
        });

        this.getValue().querySelector('.selection-icon').addEventListener("click", (event: MouseEvent) => {
            this.emit("click", { "id": this.id, "source": "class", "action": "selection-toggled" });
            event.stopPropagation();
        });
        this.getValue().querySelector('.note-icon').addEventListener("click", (event: MouseEvent) => {
            this.emit("click", { "id": this.id, "source": "class", "action": "open-note" });
            event.stopPropagation();
        });
        const propertiesElement = this.getValue().querySelector('.uml-property');
        if (propertiesElement) {
            propertiesElement.addEventListener("dblclick", (event: MouseEvent) => {
                const targetId = (event.target as HTMLElement).id;
                this.emit("click", { "class": this.id, "source": "class", "action": "property", "id": targetId });
                event.stopPropagation();
            });
        }

        const methodElement = this.getValue().querySelector('.uml-method');
        if (methodElement) {
            methodElement.addEventListener("dblclick", (event: MouseEvent) => {
                const targetId = (event.target as HTMLElement).id;
                this.emit("click", { "class": this.id, "source": "class", "action": "method", "id": targetId });
                event.stopPropagation();
            });
        }
    }

    public update(data: UMLClass, options?: any[]) {
        if (options) {
            this.options = options;
        }
        this.data = data;
        this.calcSize();
        this.geometry.width = this.width;
        this.geometry.height = this.height;
        
        const newElement = UMLClassElement.generateHTML(this.data, this.options);
        console.log(newElement)
        this.setValue(newElement);
    
        // Reattach tooltip and listeners
        this.attachEventListeners();
    }
}