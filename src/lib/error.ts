import { toast } from "sonner";

//handles error by showing a toast. can be called anywhere
export class ErrorHandler extends Error{
    error: string;
    constructor(error:string){
        super();
        this.error = error;  
          toast("Error Occured", {
            description: error,
            action: {
              label: "Okay",
              onClick: () => console.log("Okay"),
            }
          });
    }
}