import { useAuth } from "@/context/auth_context"
import { responseHandler } from "@/lib/utils"
import UserConfigForm, { type formValueType } from "@/main_components/user_config_form"
import { BookLength, UserModel } from "@/models/UserModel"
import { addUser } from "@/request/user"
import { useLocation, useNavigate } from "react-router"


//page user visit for setting preferences after registration
 const ConfigRecommendation = () =>{
    const location = useLocation();

    //get uid, email and name after registration from react router
    const uid:string = location.state?.uid;
    const email:string = location.state?.email
    const name:string = location.state?.name


    const {login} = useAuth()
    const navigate = useNavigate();
  
  // Define a submit handler.
  async function onSubmit(values: formValueType) {

    //get only genre names 
    const preferredGenres:string[] = values.genre.map((genre)=>genre.label)
    const user = new UserModel({id: uid, name: name, email:email, preferredGenres:preferredGenres,preferredMinimumPublicationYear:values.minimumYear,preferredBookLength:values.preferredSize as BookLength})
   
    //add user to db
    responseHandler(()=>addUser(user),()=>{
        //after adding to db. call auth context login to save user locally
        login(user)
        navigate("/")
    },()=>{

    })
      
  }
  
    return(
        <div>
            <h1 className="text-4xl text-primary-100">Help us recommend you great books.</h1>
                <UserConfigForm onFormSubmit={onSubmit}/>
        </div>
    )
}

export default ConfigRecommendation