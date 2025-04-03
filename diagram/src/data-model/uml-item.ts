export interface UMLItem{
    id?: string;
    domId?:string;
    name:string;
    displayName?:string;
    summary?: string;
    selected?: boolean;
    style?: string;
    generatedContent?: string;  // Generated content for the class (rendering)
}