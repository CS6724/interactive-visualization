import 'reflect-metadata';
import Container, { Service } from 'typedi';
import { DATA_URL } from '../common/environment';

@Service()
export class DataService {
    private base_url = DATA_URL;

    public async fetchData(path:string = null) {
        // Construct URL with optional query parameters
        // 
        
        let url = "";
        if(path){
            url = `${this.base_url}/data/${path}`;
        }else {
            url = `${this.base_url}/data`;
        }
        console.log(`Loading: ${url}`)
        try {
            // Fetch data from the endpoint
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            // Check if the response is successful
            if (!response.ok) {
                console.log("error")
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Parse the JSON response
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }


    public async fetchFAQs(): Promise<any> {
        
        let url = `${this.base_url}/data/faq`;
        try {
            // Fetch data from the endpoint
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            // Check if the response is successful
            if (!response.ok) {
                console.log("error")
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Parse the JSON response
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }
}