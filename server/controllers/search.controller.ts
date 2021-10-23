import { Request, Response } from "express";
import { Response as fetchResponse } from "node-fetch";
import { SearchApiResult } from "../interfaces/item/search.interface";

const fetch = require("node-fetch");

const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.params;

  fetch(`https://www.ah.nl/zoeken/api/products/search?query=${query}`).then(
    (response: fetchResponse) =>
      response.json().then((result: SearchApiResult) => {
        res.json(
          result.cards.map((item) => {
            const product = item.products[0];
            if (!product) return;

            const highestResImageIndex = product.images
              .map((image, index) => ({
                index,
                height: image.height,
              }))
              ?.sort((item1, item2) => item2.height - item1.height)[0]?.index;
            const highestResImageUrl =
              product.images[highestResImageIndex]?.url ?? "";

            return {
              id: product.id,
              name: product.title,
              url: `https://ah.nl${product.link}`,
              price: {
                amount: product.price.now,
                unitSize: product.price.unitSize,
              },
              imageUrl: highestResImageUrl,
            };
          })
        );
      })
  );
};

export { search };
