export class ApiService {
    // private static url = "http://localhost:5000"
    private static url = process.env.NODE_ENV == "production" ? "https://book-catalogue-recommendation.onrender.com" : "http://localhost:5000"
    
    public static async get(endpoint: string, params?:Map<string,any>) {
        // If params are provided, append them as query parameters to the endpoint
        let endpointWithParams = endpoint;
        if (params && params.size > 0) {
            const searchParams = new URLSearchParams();
            params.forEach((value, key) => {
                searchParams.append(key, value);
            });
            endpointWithParams += `?${searchParams.toString()}`;
        }
        endpoint = endpointWithParams;

        const response = await fetch(`${this.url}${endpoint}`, {
            
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                // Add other headers here if needed
            }
        });
        return response;
    }

    public static async post(endpoint: string, data?:Map<string,any>) {
       
        const response = await fetch(`${this.url}${endpoint}`, {
            method:"POST",
            //include credentials for backend to read tokens from cookies
            credentials: "include",
            body:data ? JSON.stringify(Object.fromEntries(data)) : "",
            headers: {
                'Content-Type': 'application/json',
                // Add other headers here if needed
            }
        });
        return response;
    }

    public static async put(endpoint: string, data:Map<string,any>, params?:Map<string,string>) {
        // If params are provided, append them as query parameters to the endpoint
        let endpointWithParams = endpoint;
        if (params && params.size > 0) {
            const searchParams = new URLSearchParams();
            params.forEach((value, key) => {
                searchParams.append(key, value);
            });
            endpointWithParams += `?${searchParams.toString()}`;
        }
        endpoint = endpointWithParams;

        const response = await fetch(`${this.url}${endpoint}`, {
            method:"PUT",
            credentials: "include",
            body:data ? JSON.stringify(Object.fromEntries(data)) : "",
            headers: {
                'Content-Type': 'application/json',
                // Add other headers here if needed
            }
        });
        return response;
    }

    public static async delete(endpoint: string, params?: Map<string, string>) {
        // If params are provided, append them as query parameters to the endpoint
        let endpointWithParams = endpoint;
        if (params && params.size > 0) {
            const searchParams = new URLSearchParams();
            params.forEach((value, key) => {
                searchParams.append(key, value);
            });
            endpointWithParams += `?${searchParams.toString()}`;
        }
        endpoint = endpointWithParams;
        
        const response = await fetch(`${this.url}${endpoint}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                // Add other headers here if needed
            }
        });
        return response;
    }

}