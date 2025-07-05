
//function for taking the books and return the same book with only the necessary details
export function refineRecommendationResponse(recommendations, preferredBookLength, preferredMinimumPublicationYear) {
    try {
        let refinedRecommendations = [];
        recommendations.items.forEach((item) => {
            const volumeInfo = item.volumeInfo || {};

            // if the any of the necessary information is not present, we skip the book
            //we can give this check in the later code present that already checks, but incase the pub year is not present,
            //dont bother running rest of the code
            const publishedDate = volumeInfo.publishedDate
            if (publishedDate == null){
                return;
            }
            const year = Number.parseInt(publishedDate.split("-")[0]) 

            //if this function is run for custom user recommendations then we check the constraints
            if (preferredMinimumPublicationYear!=null){
                if (year < Number.parseInt(preferredMinimumPublicationYear)){
                    return;
                }
            }
            if (preferredBookLength != null){
                const pageCount = volumeInfo.pageCount
                if (preferredBookLength == "SHORT" && pageCount > 200){
                    return;
                }else if (preferredBookLength == "MEDIUM" && (pageCount < 200 || pageCount > 400)){
                    return;
                }else if (preferredBookLength == "LONG" && pageCount < 400){
                    return;
                }
            }

            //gather necesarry details
            const ISBN = Number.parseInt(volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier) || null;  
            const Author = Array.isArray(volumeInfo.authors) ? volumeInfo.authors.join(", ") : null;
            const Title = volumeInfo.title || null;
            const Description = volumeInfo.description || null;
            const Cover_Art = volumeInfo.imageLinks?.thumbnail || null;
            const Genre = Array.isArray(volumeInfo.categories) ? volumeInfo.categories.join(", ") : null;

            // if the any of the necessary information is not present, we skip the book
            if (ISBN === null || Author === null || Title === null || Description === null || Cover_Art === null || Genre === null) {
                return;
            }
            refinedRecommendations.push({
                ISBN,
                Author,
                Title,
                Description,
                "Cover Art": Cover_Art,
                "Publication Year": year,
                Genre
            });
        });
        // console.log(refinedRecommendations)
        return refinedRecommendations;
    } catch (e) {
        console.error(e);
        return [];
    }
}

//function that refines the books object with the necessary information and orders them according to genre
export function refineUserRecommendationResponse(recommendations, preferredBookLength, preferredMinimumPublicationYear) {
    try {
        Object.keys(recommendations).map((genre)=>{
            recommendations[genre] = refineRecommendationResponse(recommendations[genre],preferredBookLength, preferredMinimumPublicationYear)
        })
        return recommendations
    } catch (e) {
        console.error(e);
        return [];
    }
}

//order user's saved books by its status
export function refineBooksByStatus(books) {
    const statusMap = new Map();
    
    books.forEach((book) => {
        const status = book.status
        if (!statusMap.has(status)) {
            statusMap.set(status, []);
        }
        statusMap.get(status).push(book);
    });
    // Convert the Map to a plain object and return it
    const statusObj = Object.fromEntries(statusMap.entries());
    return statusObj;
}

