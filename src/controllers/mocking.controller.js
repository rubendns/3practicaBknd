import { generateProducts } from "../utils.js"

export const getProducts = async (req,res) => {
    try{
        let products = [];
        for (let i = 0; i < 50; i++){
            products.push(generateProducts());
        }
        res.send({status: "success", payload: products});
    } catch (error){
        console.log(error);
        res.status(500).send({ error: error, message: "Products could not be obtained"})
    }
}