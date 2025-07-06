
//BOok Model
interface BookModelParams {
    ISBN: number;
    title: string;
    author: string;
    description: string;
    coverArt?: string;
    publicationYear: number;
    genre: string;
}

export class BookModel {
    ISBN: number;
    title: string;
    author: string;
    description: string;
    coverArt?: string;
    publicationYear: number;
    genre: string;

    constructor({ ISBN, title, author, description, coverArt, genre, publicationYear }: BookModelParams) {
        this.ISBN = ISBN;
        this.title = title;
        this.author = author;
        this.description = description;
        this.coverArt = coverArt;
        this.publicationYear = publicationYear
        this.genre = genre;
    }

    static fromMap(map: Map<string, any>): BookModel {
        return new BookModel({
            ISBN: map.get("ISBN"),
            title: map.get("Title"),
            author: map.get("Author"),
            description: map.get("Description"),
            coverArt: map.get("Cover Art"),
            publicationYear: map.get("Publication Year"),
            genre: map.get("Genre"),
        });
    }

    //used when we recive books from backend
    static fromObj(obj: any): BookModel {
        return new BookModel({
            ISBN: obj.ISBN,
            title: obj.Title,
            author: obj.Author,
            description: obj.Description,
            coverArt: obj["Cover Art"] ?? null, // or obj.coverArt if that's the key
            publicationYear: obj["Publication Year"],
            genre: obj.Genre,
        });
    }

    toMap(): Map<string, any> {
        const map = new Map<string, any>();
        map.set("ISBN", this.ISBN);
        map.set("Title", this.title);
        map.set("Author", this.author);
        map.set("Description", this.description);
        map.set("Cover Art", this.coverArt);
        map.set("Publication Year", this.publicationYear);
        map.set("Genre", this.genre);
        return map;
    }

    //used in case we neeed to pass the book to backend as object
    toObject(): Record<string, any> {
        return {
            ISBN: this.ISBN,
            Title: this.title,
            Author: this.author,
            Description: this.description,
            "Cover Art": this.coverArt,
            "Publication Year": this.publicationYear,
            Genre: this.genre,
        };
    }


}