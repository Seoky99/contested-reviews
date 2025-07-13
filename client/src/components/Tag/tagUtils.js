    /*(async function handleAddingTags(reviewId) {
           try {
            const url = `http://localhost:8080/api/reviews/${reviewId}/tags`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({
                    tagIds: Array.from(selectedTags)
                }),
            });

            if (!response.ok) {
                throw new Error("server error" + response.status);
            }     
        } catch (err) {
            console.log(err); 
        }
    }  */