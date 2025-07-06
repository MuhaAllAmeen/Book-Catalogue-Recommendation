import { useAuth } from "@/context/auth_context"
import { checkGenreDifference, responseHandler } from "@/lib/utils"
import UserConfigForm, { type formValueType } from "@/main_components/user_config_form"
import { BookLength, UserModel } from "@/models/UserModel"
import { updateUser } from "@/request/user"
import { toast } from "sonner"

//page for changing preferences
const SettingsPage = () =>{

    const {user, login} = useAuth()

  // Define a submit handler.
  async function onSubmit(values: formValueType) {
    if (user!=null){
        const fields = new Map().set("id", user?.id)
        var updatedUser: UserModel = user
        
        // if there is any difference from prefrences selected with the current then save it to the user variable
        // and send the values to backend 
        if (checkGenreDifference(user?.preferredGenres,values.genre.map((value)=> value.label))){
            fields.set("preferredGenres",values.genre.map((value)=>value.label).join(","))
            updatedUser = updatedUser.copyWith({
                preferredGenres: values.genre.map((value)=>value.label)
            })
        }
        if (user?.preferredBookLength != values.preferredSize){
            fields.set("preferredBookLength",values.preferredSize)
            updatedUser = updatedUser.copyWith({
                preferredBookLength: values.preferredSize as BookLength
            })
        }
        if (user?.preferredMinimumPublicationYear != values.minimumYear){
            fields.set("preferredMinimumPublicationYear",values.minimumYear)
            updatedUser = updatedUser.copyWith({
                preferredMinimumPublicationYear: values.minimumYear 
            })
        }

        responseHandler(()=>updateUser(user?.id,fields),()=>{
            // user with new preferences is saved to local storage
            login(updatedUser)
            toast("Success!", {
                description: "Details Updated",
                action: {
                  label: "Okay",
                  onClick: () => console.log("Okay"),
                }
              });
        },()=>{
        })
    }
  }
    return(
        <div>
            <h1 className="text-4xl text-primary-100 font-bold">Change your preferences.</h1>
            <UserConfigForm onFormSubmit={onSubmit} />
        </div>
    )
}

export default SettingsPage