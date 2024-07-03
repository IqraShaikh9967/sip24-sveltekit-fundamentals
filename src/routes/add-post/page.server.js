export const actions = {
    default: async ({ request }) => {
        const data = Object.fromEntries(await request.formData());
    
        console.log(data);
    }
}