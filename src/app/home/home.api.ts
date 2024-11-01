const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Obtener preguntas pupilo
export async function getQuestionsPupilo(){
    const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksInVzZXJuYW1lIjo5LCJyb2wiOjIsImlhdCI6MTczMDQzMjg4NywiZXhwIjoxNzMwNDM2NDg3fQ.hrlOrJ2YRlYvVy81mvNGvL0a8jRDGLHuabj51YpawW4";

    const data = await fetch(`${apiUrl}/user/preguntas`,{
        method: "GET",
        headers: {
            "Authorization": `Bearer ${access_token}`,
            "Content-Type": "application/json"
        }
    });

    return await data.json();
}

// Obtener categorias
export async function getCategories(){
    const data = await fetch(`${apiUrl}/categories`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return await data.json();
}