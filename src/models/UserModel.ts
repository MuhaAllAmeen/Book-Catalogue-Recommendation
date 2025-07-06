export enum BookLength{
    SHORT = "SHORT",
    MEDIUM = "MEDIUM",
    LONG = "LONG"
}

interface UserModelParams {
    id: string;
    name: string;
    email: string;
    preferredGenres: string[];
    preferredMinimumPublicationYear: number;
    preferredBookLength: BookLength;
}

//User Model
export class UserModel{
    id: string;
    name: string;
    email: string;
    preferredGenres: string[];
    preferredMinimumPublicationYear: number;
    preferredBookLength: BookLength;
    constructor({id, name,email, preferredGenres, preferredMinimumPublicationYear, preferredBookLength}:UserModelParams){
        this.id = id,
        this.email = email,
        this.name = name,
        this.preferredGenres = preferredGenres,
        this.preferredBookLength = preferredBookLength,
        this.preferredMinimumPublicationYear = preferredMinimumPublicationYear
    }

    static fromObj(obj:any){
        return new UserModel(
            {id: obj.id,
            name : obj.name,
            email : obj.email,
            preferredGenres : typeof obj.preferredGenres == "string" ? obj.preferredGenres.split(",") : obj.preferredGenres,
            preferredMinimumPublicationYear : obj.preferredMinimumPublicationYear,
            preferredBookLength : obj.preferredBookLength}
        )
    }

    toMap(): Map<string, any> {
        return new Map<string, any>([
            ['id', this.id],
            ['name', this.name],
            ['email', this.email],
            ['preferredGenres', this.preferredGenres.join(",")],
            ['preferredMinimumPublicationYear', this.preferredMinimumPublicationYear],
            ['preferredBookLength', this.preferredBookLength]
        ]);
    }

    //in case we need to copy the user details to another variable
    copyWith(params:{
        id?: string,
        name?: string,
        email?: string,
        preferredGenres?: string[],
        preferredMinimumPublicationYear?: number,
        preferredBookLength?: BookLength
    }
    ): UserModel {
        return new UserModel({
            id: params.id !== undefined ? params.id : this.id,
            name: params.name !== undefined ? params.name : this.name,
            email: params.email !== undefined ? params.email : this.email,
            preferredGenres: params.preferredGenres !== undefined ? params.preferredGenres : this.preferredGenres,
            preferredMinimumPublicationYear: params.preferredMinimumPublicationYear !== undefined ? params.preferredMinimumPublicationYear : this.preferredMinimumPublicationYear,
            preferredBookLength: params.preferredBookLength !== undefined ? params.preferredBookLength : this.preferredBookLength
        });
    }
    
}